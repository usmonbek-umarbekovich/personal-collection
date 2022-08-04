const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Collection = require('../models/collectionModel');
const Item = require('../models/itemModel');
const { getItemsAggregation } = require('./itemController');
const { notFoundError, notAuthorizedError } = require('../customErrors');

/**
 * @desc Get all collections
 * @route GET /api/collections/all
 * @access Public
 */
const getAllCollections = asyncHandler(async (req, res) => {
  const { limit, skip, ...sortBy } = req.query;
  const collections = await Collection.find({})
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .populate('user', 'name avatar _id');

  res.status(200).json(collections);
});

/**
 * @desc Get single collection
 * @route GET /api/collections/single/:id
 * @access Public
 */
const getSingleCollection = asyncHandler(async (req, res) => {
  const collection = await Collection.findById(req.params.id).populate(
    'user',
    '_id name avatar'
  );
  if (!collection) notFoundError(res, 'Collection');

  res.status(200).json(collection);
});

/**
 * @desc Get collection items
 * @route GET /api/collections/:id/items
 * @access Public
 */
const getCollectionItems = asyncHandler(async (req, res) => {
  const items = await getItemsAggregation(
    { collectionId: new mongoose.Types.ObjectId(req.params.id) },
    req.query
  );
  res.status(200).json(items);
});

/**
 * @desc Get collection tags
 * @route GET /api/collections/:id/tags
 * @access Public
 */
const getCollectionTags = asyncHandler(async (req, res) => {
  const { skip, limit } = req.query;
  const { id } = req.params;

  const collection = await Collection.findById(id)
    .select('items')
    .populate({
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
 * @desc Get all topics
 * @route GET /api/collections/topics
 * @access Public
 */
const getAllTopics = asyncHandler(async (req, res) => {
  const { skip, limit } = req.query;

  let topics = await Collection.find({})
    .limit(limit)
    .skip(skip)
    .select('topic');

  topics = topics.map(t => t.topic);
  res.status(200).json(topics);
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
  const { id } = req.params;

  const collection = await Collection.findById(id);
  if (!collection) notFoundError(res, 'Collection');

  if (!collection.user.equals(req.user._id)) {
    notAuthorizedError(res);
  }

  await collection.remove();
  await Item.deleteMany({ collectionId: id });

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getAllCollections,
  getSingleCollection,
  getCollectionItems,
  getCollectionTags,
  getAllTopics,
  createCollection,
  updateCollection,
  deleteCollection,
};
