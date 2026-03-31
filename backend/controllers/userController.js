const User = require('../models/user');
const bcrypt = require('bcryptjs');

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      addresses: user.addresses,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      role: updatedUser.role,
      addresses: updatedUser.addresses,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Add new address
// @route   POST /api/user/addresses
// @access  Private
const addAddress = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { fullName, addressLine, city, state, pincode, isDefault } = req.body;

    // If isDefault is true, unset other defaults
    if (isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    // If this is the first address, make it default
    const firstAddress = user.addresses.length === 0;

    user.addresses.push({
      fullName,
      addressLine,
      city,
      state,
      pincode,
      isDefault: firstAddress || isDefault,
    });

    await user.save();
    res.status(201).json(user.addresses);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Update address
// @route   PUT /api/user/addresses/:id
// @access  Private
const updateAddress = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const address = user.addresses.id(req.params.id);

    if (address) {
      address.fullName = req.body.fullName || address.fullName;
      address.addressLine = req.body.addressLine || address.addressLine;
      address.city = req.body.city || address.city;
      address.state = req.body.state || address.state;
      address.pincode = req.body.pincode || address.pincode;

      if (req.body.isDefault) {
        user.addresses.forEach((addr) => {
          addr.isDefault = false;
        });
        address.isDefault = true;
      }

      await user.save();
      res.json(user.addresses);
    } else {
      res.status(404).json({ message: 'Address not found' });
    }
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Delete address
// @route   DELETE /api/user/addresses/:id
// @access  Private
const deleteAddress = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const addressIndex = user.addresses.findIndex((addr) => addr._id.toString() === req.params.id);

    if (addressIndex !== -1) {
      const wasDefault = user.addresses[addressIndex].isDefault;
      user.addresses.splice(addressIndex, 1);

      // If we deleted the default, make another one default
      if (wasDefault && user.addresses.length > 0) {
        user.addresses[0].isDefault = true;
      }

      await user.save();
      res.json(user.addresses);
    } else {
      res.status(404).json({ message: 'Address not found' });
    }
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  logout,
};
