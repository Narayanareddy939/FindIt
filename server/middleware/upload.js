const path = require('path');
const fs = require('fs');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const isCloudinaryConfigured = () => {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = {
  _handleFile(req, file, callback) {
    if (isCloudinaryConfigured()) {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'findit/items',
          format: 'jpeg',
          public_id: `item-${Date.now()}-${Math.round(Math.random() * 1e9)}`,
          resource_type: 'auto',
          quality: 'auto',
          fetch_format: 'auto',
        },
        (error, result) => {
          if (error) return callback(error);
          if (!result) return callback(new Error('Cloudinary returned no upload result'));

          callback(null, {
            path: result.secure_url,
            filename: result.public_id,
            size: result.bytes,
          });
        },
      );

      return file.stream.pipe(uploadStream);
    }

    // Local disk fallback
    const ext = path.extname(file.originalname) || '.jpg';
    const filename = `item-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    const filePath = path.join(uploadsDir, filename);
    const outStream = fs.createWriteStream(filePath);

    file.stream.pipe(outStream);
    outStream.on('error', callback);
    outStream.on('finish', () => {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      callback(null, {
        path: `${baseUrl}/uploads/${filename}`,
        filename,
        size: outStream.bytesWritten,
      });
    });
  },
  _removeFile(_req, file, callback) {
    if (!file.filename) return callback(null);
    if (isCloudinaryConfigured()) {
      cloudinary.uploader.destroy(file.filename, { resource_type: 'image' }, callback);
    } else {
      const localFile = path.join(uploadsDir, file.filename);
      fs.unlink(localFile, () => callback(null));
    }
  },
};

// Create multer upload instance
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (_req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
    }
  },
});

module.exports = upload;
