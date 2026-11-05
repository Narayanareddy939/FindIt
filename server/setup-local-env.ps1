param(
  [switch]$Force,
  [string]$ClusterHost = 'findit-cluster.syt4jw3.mongodb.net',
  [string]$DatabaseUsername = 'findit_admin'
)

$ErrorActionPreference = 'Stop'
$envPath = Join-Path $PSScriptRoot '.env'

function ConvertFrom-SecureInput {
  param([Security.SecureString]$Value)

  $pointer = [IntPtr]::Zero
  try {
    $pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($Value)
    [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer)
  } finally {
    if ($pointer -ne [IntPtr]::Zero) {
      [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer)
    }
  }
}

$replaceExisting = $Force
if ((Test-Path -LiteralPath $envPath) -and -not $Force) {
  $existingContent = Get-Content -LiteralPath $envPath -Raw
  $hasMongoUri = $existingContent -match '(?m)^MONGO_URI=\S+'
  $hasJwtSecret = $existingContent -match '(?m)^JWT_SECRET=\S+'

  if (-not ($hasMongoUri -and $hasJwtSecret)) {
    Write-Output 'The existing server/.env is incomplete and will be replaced.'
    $replaceExisting = $true
  }
}

if ((Test-Path -LiteralPath $envPath) -and -not $replaceExisting) {
  $answer = Read-Host 'server/.env already exists. Replace it with fresh local credentials? (y/N)'
  if ($answer -notmatch '^(y|yes)$') {
    Write-Output 'No files changed.'
    exit 0
  }
}

$ClusterHost = (Read-Host "Atlas SRV host [$ClusterHost]").Trim()
if ([string]::IsNullOrWhiteSpace($ClusterHost)) {
  $ClusterHost = 'findit-cluster.syt4jw3.mongodb.net'
}
if ($ClusterHost -notmatch '^[A-Za-z0-9.-]+\.mongodb\.net$') {
  throw 'Enter the cluster SRV hostname ending in .mongodb.net, without a scheme or path.'
}

$DatabaseUsername = (Read-Host "Atlas database username [$DatabaseUsername]").Trim()
if ([string]::IsNullOrWhiteSpace($DatabaseUsername)) {
  $DatabaseUsername = 'findit_admin'
}

$securePassword = Read-Host 'Enter the rotated Atlas database password (input is hidden)' -AsSecureString
$password = $null
$cloudinaryApiKey = $null
$cloudinaryApiSecret = $null
$secureCloudinaryApiKey = $null
$secureCloudinaryApiSecret = $null

try {
  $password = ConvertFrom-SecureInput $securePassword
  if ([string]::IsNullOrWhiteSpace($password)) {
    throw 'The Atlas password cannot be empty.'
  }

  $cloudinaryCloudName = ''
  $configureCloudinary = Read-Host 'Configure Cloudinary image uploads now? (y/N)'
  if ($configureCloudinary -match '^(y|yes)$') {
    $cloudinaryCloudName = (Read-Host 'Enter your rotated Cloudinary cloud name').Trim()
    $secureCloudinaryApiKey = Read-Host 'Enter your rotated Cloudinary API key (input is hidden)' -AsSecureString
    $secureCloudinaryApiSecret = Read-Host 'Enter your rotated Cloudinary API secret (input is hidden)' -AsSecureString
    $cloudinaryApiKey = ConvertFrom-SecureInput $secureCloudinaryApiKey
    $cloudinaryApiSecret = ConvertFrom-SecureInput $secureCloudinaryApiSecret

    if ([string]::IsNullOrWhiteSpace($cloudinaryCloudName) -or
        [string]::IsNullOrWhiteSpace($cloudinaryApiKey) -or
        [string]::IsNullOrWhiteSpace($cloudinaryApiSecret)) {
      throw 'Cloudinary cloud name, API key, and API secret are all required to enable uploads.'
    }
  }

  $encodedUsername = [Uri]::EscapeDataString($DatabaseUsername)
  $encodedPassword = [Uri]::EscapeDataString($password)
  $uri = "mongodb+srv://${encodedUsername}:${encodedPassword}@${ClusterHost}/findit?retryWrites=true&w=majority&appName=FindIt"

  $randomBytes = New-Object byte[] 32
  $randomGenerator = [Security.Cryptography.RandomNumberGenerator]::Create()
  try {
    $randomGenerator.GetBytes($randomBytes)
  } finally {
    $randomGenerator.Dispose()
  }
  $jwtSecret = [BitConverter]::ToString($randomBytes).Replace('-', '').ToLowerInvariant()

  $lines = @(
    'PORT=5000',
    'NODE_ENV=development',
    "MONGO_URI=$uri",
    "JWT_SECRET=$jwtSecret",
    'JWT_EXPIRE=30d',
    'CLIENT_URL=http://localhost:5173',
    "CLOUDINARY_CLOUD_NAME=$cloudinaryCloudName",
    "CLOUDINARY_API_KEY=$cloudinaryApiKey",
    "CLOUDINARY_API_SECRET=$cloudinaryApiSecret"
  )

  Set-Content -LiteralPath $envPath -Value $lines -Encoding ASCII
  Write-Output 'Created server/.env for the existing Atlas findit database. Secret values were not displayed.'
} finally {
  $securePassword.Dispose()
  if ($secureCloudinaryApiKey) {
    $secureCloudinaryApiKey.Dispose()
  }
  if ($secureCloudinaryApiSecret) {
    $secureCloudinaryApiSecret.Dispose()
  }
  $password = $null
  $cloudinaryApiKey = $null
  $cloudinaryApiSecret = $null
}
