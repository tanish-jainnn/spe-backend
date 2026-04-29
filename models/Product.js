const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  sizes: [{ type: String }],
  variants: [{ type: String, enum: ['White', 'Black'] }],
  description: { type: String, required: true },
  shortDesc: { type: String },
  image: { type: String, default: '' },
  badge: { type: String, default: '' },
  isAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
