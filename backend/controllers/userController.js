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

/**
 * @desc Get user items
 * @route GET /api/users/:id/comment
 * @access Public
 */
const getUserComment = asyncHandler(async (req, res) => {
  const { itemId } = req.query;
  const { id } = req.params;

  const item = await Item.findById(itemId)
    .select('comments')
    .where('comments')
    .elemMatch({ user: id })
    .populate('comments.0.user', '_id name avatar');

  res.status(200).json(item.comments[0]);
}, []);

module.exports = {
  getSingleUser,
  getUserItems,
  getUserComment,
  getUserCollections,
};
