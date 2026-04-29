const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');

// POST submit inquiry
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, message, productInterest } = req.body;

    if (!name || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone, and message are required.'
      });
    }

    const inquiry = await Inquiry.create({ name, phone, email, message, productInterest });

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been submitted! We will contact you shortly.',
      data: { id: inquiry._id, name: inquiry.name }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET all inquiries (admin)
router.get('/', async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.json({ success: true, count: inquiries.length, data: inquiries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH mark as read
router.patch('/:id', async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json({ success: true, data: inquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
