const asyncHandler = require('express-async-handler');
const Item = require('../models/itemModel');
const Collection = require('../models/collectionModel');
const Tag = require('../models/tagModel');
const { notFoundError, notAuthorizedError } = require('../customErrors');

/**
 * @desc Get items
 * @route GET /api/item
 * @access Public
 */
const getItems = asyncHandler(async (req, res) => {
  const { limit, skip } = req.query;
  const items = await Item.find({})
    .limit(limit)
    .skip(skip)
    .populate({
      path: 'collectionId',
      select: 'name user',
      populate: {
        path: 'user',
        select: 'name picture _id',
      },
    })
    .populate({ path: 'tags', options: { limit: 3 } })
    .sort({ createdAt: 'desc' });

  res.status(200).json(items);
});

/**
 * @desc Get tags
 * @route GET /api/item/tags/all
 * @access Public
 */
const getTags = asyncHandler(async (req, res) => {
  const { skip, limit } = req.query;
  const tags = await Tag.find({}).limit(limit).skip(skip);
  res.status(200).json(tags);
});

/**
 * @desc Get single collection item
 * @route GET /api/item/:id
 * @access Public
 */
const getItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) notFoundError(res, 'Item');

  res.status(200).json(item);
});

/**
 * @desc Create collection item
 * @route POST /api/item
 * @access Private
 */
const createItem = asyncHandler(async (req, res) => {
  const collection = await Collection.findById(req.body.collectionId);
  if (!collection) notFoundError(res, 'Collection');

  let savedTags = await Promise.all(
    req.body.tags.map(name => {
      return Tag.findOne({ name });
    })
  );
  savedTags = savedTags.filter(Boolean);

  const newTags = await Promise.all(
    req.body.tags
      .filter(name => !savedTags.find(tag => tag.name === name))
      .map(name => Tag.create({ name }))
  );
  const tags = savedTags.concat(newTags).map(tag => tag._id);

  const item = await Item.create({ ...req.body, tags });
  collection.meta.numItems++;
  await collection.save();

  res.status(200).json(item);
});

/**
 * @desc Update collection item
 * @route PUT /api/item/:id
 * @access Private
 */
const updateItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) notFoundError(res, 'Item');

  const userId = await item.populate('collectionId', 'user');
  if (!userId.equals(req.user._id)) {
    notAuthorizedError(res);
  }

  const updatedItem = Item.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(updatedItem);
});

/**
 * @desc Delete collection item
 * @route DELETE /api/item/:id
 * @access Private
 */
const deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) notFoundError(res, 'Item');

  const collection = item.populate('collectionId');
  if (!collection.user.equals(req.user._id)) {
    notAuthorizedError(res);
  }

  await item.remove();

  await collection.update(
    { 'meta.numItems': collection.meta.numItems - 1 },
    { runValidators: true }
  );

  res.status(200).json({ id: req.params.id });
});

// LIKES
/**
 * @desc Like or Unlike collection item
 * @route POST /api/item/:id
 * @access Private
 */
const likeOrUnlikeItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) notFoundError(res, 'Item');

  const userIndex = item.likes.findIndex(l => {
    return l.user.equals(req.user._id);
  });

  if (userIndex < 0) {
    item.likes.push({ user: req.user._id });
  } else {
    item.likes.splice(userIndex, 1);
  }
  await item.save();

  res.status(200).json({ message: 'request was successfull' });
});

module.exports = {
  getItem,
  getItems,
  getTags,
  createItem,
  updateItem,
  deleteItem,
  likeOrUnlikeItem,
};
