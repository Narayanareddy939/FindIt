const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema(
  {
    type: {
      type:     String,
      enum:     ['lost', 'found'],
      required: [true, 'Item type is required'],
    },
    title: {
      type:      String,
      required:  [true, 'Title is required'],
      trim:      true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    category: {
      type:     String,
      required: [true, 'Category is required'],
      enum:     ['student-id', 'wallet', 'electronics', 'laptop', 'mobile', 'earphones',
                 'books', 'stationery', 'keys', 'bags', 'clothing', 'jewelry', 'documents', 'others'],
    },
    description: {
      type:      String,
      required:  [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    location: { type: String, required: [true, 'Location is required'] },
    date:     { type: Date,   required: [true, 'Date is required'] },
    time:     { type: String, default: '' },
    images:   [{
      type: mongoose.Schema.Types.Mixed,
    }],

    // Reporter
    reporter: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },

    // Status tracking
    status:   { type: String, enum: ['lost', 'found', 'returned'], default: function () { return this.type; } },
    verified: { type: Boolean, default: false },
    reward:   { type: String, default: null },
    views:    { type: Number, default: 0 },

    // AI match
    matchScore: { type: Number, default: null },
    matchItem:  { type: mongoose.Schema.Types.ObjectId, ref: 'Item', default: null },

    // Contact
    contactPhone: { type: String, default: '' },
    contactEmail: { type: String, default: '' },
    holderName:   { type: String, default: '' },
    notes:        { type: String, default: '' },
  },
  {
    timestamps: true,
    toJSON:     { virtuals: true },
    toObject:   { virtuals: true },
  },
);

// Text search index
ItemSchema.index({ title: 'text', description: 'text', location: 'text' });

// View counter
ItemSchema.methods.incrementViews = async function () {
  this.views += 1;
  return this.save();
};

module.exports = mongoose.model('Item', ItemSchema);
