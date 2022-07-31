const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const Item = require('../models/itemModel');
const { notFoundError } = require('../customErrors');

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
  const { limit, skip, ...sortBy } = req.query;
  const { id } = req.params;

  const user = await User.findById(id)
    .select('items')
    .populate({
      path: 'items',
      select: '-comments',
      populate: [
        { path: 'collectionId', select: 'name' },
        { path: 'tags', options: { limit: 3 } },
      ],
      options: {
        skip,
        limit,
        sort: sortBy,
      },
    });

  res.status(200).json(user.items);
});

module.exports = {
  getSingleUser,
  getUserItems,
  getUserCollections,
};
