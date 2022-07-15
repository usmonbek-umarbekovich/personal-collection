const asyncHandler = require('express-async-handler');
const Item = require('../models/itemModel');
const { notFoundError } = require('../customErrors');

/**
 * @desc Get item comments
 * @route GET /api/item/:id/comments
 * @access Public
 */
const getComments = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) notFoundError(res, 'Item');

  res.status(200).json(item.comments);
});

/**
 * @desc Create new comment
 * @route POST /api/item/:id/comments
 * @access Private
 */
const createComment = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) notFoundError(res, 'Item');

  const userCommented = item.comments.find(com => {
    return com.user.valueOf() === req.user._id.valueOf();
  });
  if (userCommented) {
    throw new Error('You have already commented on this item');
  }

  const newComment = {
    user: req.user._id,
    body: req.body.comment,
  };
  item.comments.push(newComment);
  await item.save();

  res.status(200).json(item.comments[item.comments.length - 1]);
});

/**
 * @desc Update comment
 * @route PUT /api/item/:id/comments
 * @access Private
 */
const updateComment = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) notFoundError(res, 'Item');

  const commentIndex = item.comments.findIndex(com => {
    return com.user.valueOf() === req.user._id.valueOf();
  });
  if (commentIndex < 0) {
    throw new Error("You don't have a comment on this item yet");
  }

  Object.assign(item.comments[commentIndex], { body: req.body.comment });
  await item.save();

  res.status(200).json(item.comments[commentIndex]);
});

/**
 * @desc Delete comment
 * @route DELETE /api/item/:id/comments
 * @access Private
 */
const deleteComment = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) notFoundError(res, 'Item');

  const commentIndex = item.comments.findIndex(com => {
    return com.user.valueOf() === req.user._id.valueOf();
  });
  if (commentIndex < 0) {
    throw new Error("You don't have a comment on this item yet");
  }

  item.comments.splice(commentIndex, 1);
  await item.save();

  res.status(200).json({ message: 'The comment has been deleted' });
});

module.exports = {
  getComments,
  createComment,
  updateComment,
  deleteComment,
};
