const asyncHandler = require('express-async-handler');
const Item = require('../models/itemModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const { notFoundError, notAuthorizedError } = require('../customErrors');

/**
 * @desc Get item comments
 * @route GET /api/items/:id/comments
 * @access Public
 */
const getItemComments = asyncHandler(async (req, res) => {
  const { skip, limit } = req.query;
  const { id } = req.params;
  const userId = req.user && new mongoose.Types.ObjectId(req.user._id);

  const comments = await Item.aggregate()
    .match({ _id: new mongoose.Types.ObjectId(id) })
    .project('user comments')
    .unwind('comments')
    .addFields({
      'comments.priority': {
        $indexOfArray: [[userId, '$user'], '$comments.user'],
      },
    })
    .lookup({
      from: 'users',
      localField: 'comments.user',
      foreignField: '_id',
      as: 'comments.user',
      pipeline: [
        {
          $project: {
            _id: 1,
            name: 1,
            avatar: 1,
          },
        },
      ],
    })
    .unwind('comments.user')
    .replaceRoot('comments')
    .sort('-priority -date')
    .skip(+skip)
    .limit(+limit);

  res.status(200).json(comments);
});

/**
 * @desc Create new comment
 * @route POST /api/items/:id/comments
 * @access Private
 */
const createComment = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) notFoundError(res, 'Item');

  const newComment = await item.comments.create({
    user: req.user._id,
    ...req.body,
  });
  item.comments.push(newComment);
  await item.save();

  const user = await User.findById(req.user._id).select('_id name avatar');
  res.status(200).json({ ...newComment._doc, user });
});

/**
 * @desc Update comment
 * @route PUT /api/items/:itemId/comments/:commentId
 * @access Private
 */
const updateComment = asyncHandler(async (req, res) => {
  const { itemId, commentId } = req.params;

  const item = await Item.findById(itemId);
  if (!item) notFoundError(res, 'Item');

  const comment = item.comments.id(commentId);
  if (!comment.user.equals(req.user._id)) notAuthorizedError(res);

  Object.assign(comment, req.body);
  await item.save();

  const user = await User.findById(req.user._id).select('_id name avatar');
  res.status(200).json({ ...comment._doc, user });
});

/**
 * @desc Delete comment
 * @route DELETE /api/items/:itemId/comments/commentId
 * @access Private
 */
const deleteComment = asyncHandler(async (req, res) => {
  const { itemId, commentId } = req.params;

  const item = await Item.findById(itemId);
  if (!item) notFoundError(res, 'Item');

  const comment = item.comments.id(commentId);
  if (!comment.user.equals(req.user._id)) notAuthorizedError(res);

  comment.remove();
  await item.save();

  res.status(200).json({ id: commentId });
});

module.exports = {
  getItemComments,
  createComment,
  updateComment,
  deleteComment,
};
