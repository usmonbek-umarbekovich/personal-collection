const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Tag = require('../models/tagModel');
const Item = require('../models/itemModel');
const Collection = require('../models/collectionModel');
const { notFoundError, notAuthorizedError } = require('../customErrors');

const searchItems = asyncHandler(async (req, res) => {
  const { term, limit, skip, ...sortBy } = req.query;
  const pipeline = [
    {
      $search: {
        index: 'searchItems',
        text: {
          query: term,
          path: ['name', 'description'],
          fuzzy: { maxExpansions: 10 },
        },
      },
    },
    {
      $addFields: {score: {$meta: 'searchScore'}}
    }
  ];

  const items = await Item.aggregate([
    ...pipeline,
    ...getItemsPipeline({}, { skip, limit, score: -1 }),
  ]);
  res.status(200).json(items);
});

/**
 * @desc Get all items
 * @route GET /api/items
 * @access Public
 */
const getAllItems = asyncHandler(async (req, res) => {
  const items = await Item.aggregate(getItemsPipeline({}, req.query));
  res.status(200).json(items);
});

/**
 * @desc Get single collection item
 * @route GET /api/items/:id
 * @access Public
 */
const getSingleItem = asyncHandler(async (req, res) => {
  const [item] = await Item.aggregate(
    getItemsPipeline(
      { _id: new mongoose.Types.ObjectId(req.params.id) },
      { skip: 0, limit: Number.MAX_SAFE_INTEGER, createdAt: -1 }
    )
  );
  res.status(200).json(item);
});

/**
 * @desc Get tags
 * @route GET /api/items/all/tags
 * @access Public
 */
const getAllTags = asyncHandler(async (req, res) => {
  const { skip, limit } = req.query;
  const tags = await Tag.find({}).limit(limit).skip(skip);
  res.status(200).json(tags);
});

/**
 * @desc Get item tags
 * @route GET /api/items/:id/tags
 * @access Public
 */
const getItemTags = asyncHandler(async (req, res) => {
  const { skip, limit } = req.query;
  const item = await Item.findById(req.params.id).select('tags').populate({
    path: 'tags',
    options: { skip, limit },
  });

  res.status(200).json(item.tags);
});

/**
 * @desc Create collection item
 * @route POST /api/items
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

  const item = await Item.create({ ...req.body, user: req.user._id, tags });
  collection.meta.numItems++;
  await collection.save();

  res.status(200).json(item);
});

/**
 * @desc Update collection item
 * @route PUT /api/items/:id
 * @access Private
 */
const updateItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) notFoundError(res, 'Item');

  if (!item.user.equals(req.user._id)) {
    notAuthorizedError(res);
  }

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

  const updatedItem = await Item.findByIdAndUpdate(
    req.params.id,
    { ...req.body, tags },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json(updatedItem);
});

/**
 * @desc Delete collection item
 * @route DELETE /api/items/:id
 * @access Private
 */
const deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) notFoundError(res, 'Item');

  if (!item.user.equals(req.user._id)) {
    notAuthorizedError(res);
  }

  await item.remove();

  const collection = await Collection.findById(item.collectionId);
  await collection.updateOne(
    { 'meta.numItems': collection.meta.numItems - 1 },
    { runValidators: true }
  );

  res.status(200).json({ id: req.params.id });
});

// LIKES
/**
 * @desc Like or Unlike collection item
 * @route POST /api/items/:id/likes
 * @access Private
 */
const likeOrUnlikeItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) notFoundError(res, 'Item');

  if (item.likes.get(req.user._id)) {
    item.likes.delete(req.user._id);
  } else {
    item.likes.set(req.user._id, req.user._id);
  }

  await item.save();

  res.status(200).json({ user: req.user._id });
});

const getItemsPipeline = (filters, query = {}) => {
  const { limit, skip, ...sortBy } = query;
  Object.entries(sortBy).forEach(([key, value]) => {
    sortBy[key] = +value;
  });

  return [
    { $match: filters },
    {
      $addFields: {
        commentCount: { $size: '$comments' },
        likeCount: { $size: { $objectToArray: '$likes' } },
      },
    },
    { $project: { comments: 0 } },
    { $sort: sortBy },
    { $skip: +skip },
    { $limit: +limit },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user',
        pipeline: [
          {
            $project: {
              _id: 1,
              name: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: 'collections',
        localField: 'collectionId',
        foreignField: '_id',
        as: 'collectionId',
        pipeline: [{ $project: { name: 1 } }],
      },
    },
    {
      $lookup: {
        from: 'tags',
        localField: 'tags',
        foreignField: '_id',
        as: 'tags',
        pipeline: [{ $limit: 3 }],
      },
    },
    { $unwind: '$user' },
    { $unwind: '$collectionId' },
  ];
};

module.exports = {
  getAllItems,
  getSingleItem,
  getAllTags,
  getItemTags,
  getItemsPipeline,
  createItem,
  updateItem,
  deleteItem,
  likeOrUnlikeItem,
  searchItems,
};
