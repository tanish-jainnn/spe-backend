const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Seed data for SPE products
const seedProducts = [
  {
    name: 'Mini Shot Cup',
    category: 'Disposable Cups',
    sizes: ['25ml', '50ml'],
    variants: ['White', 'Black'],
    description: 'Perfect for sampling, tasting events, and small servings. Hygienic single-use design with smooth finish.',
    shortDesc: 'Ideal for shots & tastings',
    badge: 'Bestseller',
  },
  {
    name: 'Standard Beverage Cup',
    category: 'Disposable Cups',
    sizes: ['100ml', '150ml'],
    variants: ['White', 'Black'],
    description: 'Versatile everyday cup suitable for offices, events, and food stalls. Leak-resistant and sturdy.',
    shortDesc: 'Everyday office & event use',
    badge: '',
  },
  {
    name: 'Medium Serving Cup',
    category: 'Disposable Cups',
    sizes: ['200ml', '250ml'],
    variants: ['White', 'Black'],
    description: 'Great for cold drinks, juices, and desserts. Wider base for stability, available in bulk packs.',
    shortDesc: 'Perfect for cold drinks & juices',
    badge: 'Popular',
  },
  {
    name: 'Large Party Cup',
    category: 'Disposable Cups',
    sizes: ['350ml', '500ml'],
    variants: ['White', 'Black'],
    description: 'Designed for parties, canteens, and food stalls. Holds soups, shakes, and large cold beverages.',
    shortDesc: 'Parties, canteens & food stalls',
    badge: '',
  },
  {
    name: 'Jumbo Container',
    category: 'Disposable Containers',
    sizes: ['750ml', '1000ml'],
    variants: ['White', 'Black'],
    description: 'High-capacity container for meal boxes, bulk food packaging, and catering events. Rigid and leak-proof.',
    shortDesc: 'Bulk food & catering use',
    badge: 'New',
  },
  {
    name: 'Economy Bulk Pack',
    category: 'Bulk Packs',
    sizes: ['25ml', '50ml', '100ml', '250ml', '500ml', '1000ml'],
    variants: ['White', 'Black'],
    description: 'Available in all sizes. Wholesale pricing for shopkeepers and distributors. Consistent quality every batch.',
    shortDesc: 'Wholesale for retailers',
    badge: 'Wholesale',
  },
];

// GET all products (with optional category filter)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category) filter.category = category;

    let products = await Product.find(filter).sort({ createdAt: -1 });

    // Auto-seed if DB is empty
    if (products.length === 0) {
      await Product.insertMany(seedProducts);
      products = await Product.find(filter).sort({ createdAt: -1 });
    }

    res.json({ success: true, count: products.length, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create product (admin use)
router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// POST seed products manually
router.post('/seed/all', async (req, res) => {
  try {
    await Product.deleteMany({});
    const products = await Product.insertMany(seedProducts);
    res.json({ success: true, count: products.length, message: 'Products seeded!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
