const User = require('../models/User');

exports.createUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    const user = await User.create({ name, email });
    return res.status(201).json({ success: true, message: 'User created successfully', data: user });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    return res.status(200).json({ success: true, message: 'User retrieved successfully', data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
