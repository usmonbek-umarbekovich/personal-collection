const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const User = require('../models/userModel');
const Item = require('../models/itemModel');
const { getItemsPipeline } = require('./itemController');
const { notFoundError, notAuthorizedError } = require('../customErrors');

/**
 * @desc Get user data
 * @route Get /api/users/:id
 * @access Public
 */
const getSingleUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) notFoundError(res, 'User');

  res.status(200).json(user);
});

/**
 * @desc Get user collections
 * @route GET /api/users/:id/collections
 * @access Public
 */
const getUserCollections = asyncHandler(async (req, res) => {
  const { limit, skip, ...sortBy } = req.query;
  const { id } = req.params;

  const user = await User.findById(id)
    .select('collections')
    .populate({
      path: 'collections',
      options: {
        skip,
        limit,
        sort: sortBy,
      },
    });

  res.status(200).json(user.collections);
});

/**
 * @desc Get user items
 * @route GET /api/users/:id/items
 * @access Public
 */
const getUserItems = asyncHandler(async (req, res) => {
  const items = await Item.aggregate(
    getItemsPipeline(
      { user: new mongoose.Types.ObjectId(req.params.id) },
      req.query
    )
  );
  res.status(200).json(items);
});

/**
 * @desc Update user
 * @route PUT /api/users/:id
 * @access Private
 */
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) notFoundError(res, 'User');
  if (!req.user._id.equals(req.params.id)) notAuthorizedError(res);

  const name = {
    first: req.body.firstName ?? user.name.first,
    last: req.body.lastName ?? user.name.last,
  };

  let onlineDevices = [...user.onlineDevices];
  if (req.body.online === true && !onlineDevices.includes(req.sessionID)) {
    onlineDevices.push(req.sessionID);
  } else if (req.body.online === false) {
    onlineDevices = onlineDevices.filter(d => d !== req.sessionID);
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    { ...req.body, name, onlineDevices },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json(updatedUser);
});

/**
 * @desc Block or Unblock user
 * @route POST /api/users/:id/block
 * @access Private
 */
const blockOrUnblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) notFoundError(res, 'User');

  user.active = !user.active;
  await user.save();
  res.status(200).json({ id, active: user.active });
});

module.exports = {
  getSingleUser,
  getUserItems,
  getUserCollections,
  updateUser,
  blockOrUnblockUser,
};
