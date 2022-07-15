const asyncHandler = require('express-async-handler');
const Collection = require('../models/collectionModel');
const { notFoundError, notAuthorizedError } = require('../customErrors');

/**
 * @desc Get collections
 * @route GET /api/collections
 * @access Public
 */
const getCollections = asyncHandler(async (req, res) => {
  const { limit, ...sortBy } = req.query;
  const collections = await Collection.find({})
    .sort(sortBy)
    .limit(+limit)
    .populate('user', 'name picture _id');

  res.status(200).json(collections);
});

/**
 * @desc Get collection items
 * @route GET /api/collections/:id/items
 * @access Public
 */
const getCollectionItems = asyncHandler(async (req, res) => {
  const { skip, limit } = req.query;
  const { id } = req.params;

  const collection = await Collection.findById(id).populate({
    path: 'items',
    populate: [
      {
        path: 'collectionId',
        select: 'name user',
        populate: {
          path: 'user',
          select: 'name picture _id',
        },
      },
      { path: 'tags', options: { limit: 3 } },
    ],
    options: {
      limit,
      skip,
      sort: { createdAt: 'desc' },
    },
  });

  res.status(200).json(collection.items);
});

/**
 * @desc Get collection tags
 * @route GET /api/collections/:id/tags
 * @access Public
 */
const getCollectionTags = asyncHandler(async (req, res) => {
  const { skip, limit } = req.query;
  const { id } = req.params;

  const collection = await Collection.findById(id).populate({
    path: 'items',
    select: 'tags',
    populate: {
      path: 'tags',
      select: 'name',
    },
    options: { limit, skip },
  });

  const seen = new Set();
  const tags = collection.items
    .flatMap(item => item.tags)
    .filter(tag => {
      if (seen.has(tag._id)) return false;

      seen.add(tag._id);
      return true;
    });

  res.status(200).json(tags);
});

/**
 * @desc Get collection topics
 * @route GET /api/collections/topics
 * @access Public
 */
const getCollectionTopics = asyncHandler(async (req, res) => {
  const { skip, limit } = req.query;

  let topics = await Collection.find({})
    .limit(limit)
    .skip(skip)
    .select('topic');

  topics = topics.map(t => t.topic);
  res.status(200).json(topics);
});

/**
 * @desc Get user's collections
 * @route Get /api/collections/me
 * @access Private
 */
const getOwnCollections = asyncHandler(async (req, res) => {
  const { skip, limit } = req.query;
  const collections = await Collection.where('user')
    .equals(req.user._id)
    .limit(limit)
    .skip(skip);
  res.status(200).json(collections);
});

/**
 * @desc Get single collection
 * @route GET /api/collections/single/:id
 * @access Public
 */
const getSingleCollection = asyncHandler(async (req, res) => {
  const collection = await Collection.findById(req.params.id);
  if (!collection) notFoundError(res, 'Collection');

  res.status(200).json(collection);
});

/**
 * @desc Create collection
 * @route POST /api/collections
 * @access Private
 */
const createCollection = asyncHandler(async (req, res) => {
  const { name, topic, description } = req.body;

  const collection = await Collection.create({
    user: req.user._id,
    name,
    topic,
    description,
  });

  res.status(200).json(collection);
});

/**
 * @desc Update Collection
 * @route PUT /api/collections/:id
 * @access Private
 */
const updateCollection = asyncHandler(async (req, res) => {
  const collection = await Collection.findById(req.params.id);
  if (!collection) notFoundError(res, 'Collection');

  if (!collection.user.equals(req.user._id)) {
    notAuthorizedError(res);
  }

  const updatedCollection = await Collection.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json(updatedCollection);
});

/**
 * @desc Delete Collection
 * @route DELETE /api/collections/:id
 * @access Private
 */
const deleteCollection = asyncHandler(async (req, res) => {
  const collection = await Collection.findById(req.params.id);
  if (!collection) notFoundError(res, 'Collection');

  if (!collection.user.equals(req.user._id)) {
    notAuthorizedError(res);
  }

  await collection.remove();

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getCollections,
  getOwnCollections,
  getCollectionItems,
  getCollectionTags,
  getCollectionTopics,
  getSingleCollection,
  createCollection,
  updateCollection,
  deleteCollection,
};
