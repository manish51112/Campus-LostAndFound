const Item = require('../models/Item');

// @desc    Get all items with optional filters (excluding posts older than 30 days)
// @route   GET /api/items
// @access  Public
const getItems = async (req, res) => {
  try {
    const { type, category, search, status } = req.query;

    // 30 days cutoff date
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const query = {
      createdAt: { $gte: thirtyDaysAgo },
    };

    if (type && type !== 'All') {
      query.type = type;
    }
    if (category && category !== 'All') {
      query.category = category;
    }
    if (status) {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const items = await Item.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single item by ID
// @route   GET /api/items/:id
// @access  Public
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('user', 'name email phone');

    if (!item) {
      return res.status(404).json({ message: 'Item not found or has expired' });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new item post
// @route   POST /api/items
// @access  Private
const createItem = async (req, res) => {
  try {
    const { title, type, category, description, location, date, imageUrl, contactInfo } = req.body;

    if (!title || !type || !description || !location || !contactInfo) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const item = await Item.create({
      title,
      type,
      category: category || 'Other',
      description,
      location,
      date: date || Date.now(),
      imageUrl: imageUrl || '',
      contactInfo,
      user: req.user._id,
    });

    const populatedItem = await item.populate('user', 'name email phone');
    res.status(201).json(populatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update item (or mark as Claimed)
// @route   PUT /api/items/:id
// @access  Private
const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Only post owner can update
    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to modify this item' });
    }

    const updated = await Item.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('user', 'name email phone');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }

    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user's posted items
// @route   GET /api/items/my-posts
// @access  Private
const getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  getMyItems,
};
