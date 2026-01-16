const Product = require('../models/Product');
const Category = require('../models/Category');

const getProducts = async (req, res) => {
  try {
    const { categoryId } = req.query;
    let filter = {};
    
    if (categoryId) {
      filter.categoryId = categoryId;
    }

    const products = await Product.find(filter)
      .populate('categoryId', 'name')
      .sort({ createdAt: -1 });
    
    res.json({ success: true, data: products });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate('categoryId', 'name');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, imageUrl, pricePerSqft, categoryId } = req.body;

    if (!name || !description || !imageUrl || !pricePerSqft || !categoryId) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).json({ success: false, message: 'Invalid category' });
    }

    const product = new Product({
      name,
      description,
      imageUrl,
      pricePerSqft,
      categoryId
    });

    await product.save();
    await product.populate('categoryId', 'name');

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, imageUrl, pricePerSqft, categoryId } = req.body;

    if (categoryId) {
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(400).json({ success: false, message: 'Invalid category' });
      }
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { name, description, imageUrl, pricePerSqft, categoryId },
      { new: true, runValidators: true }
    ).populate('categoryId', 'name');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { 
  getProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct 
};
