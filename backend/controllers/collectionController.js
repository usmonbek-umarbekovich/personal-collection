const asyncHandler = require('express-async-handler');
const Collection = require('../models/collectionModel');
const notFoundError = require('../helpers/notFoundError');

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

  const updatedCollection = await Collection.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
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

  await collection.remove();

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getCollections,
  getOwnCollections,
  getCollectionTopics,
  getSingleCollection,
  createCollection,
  updateCollection,
  deleteCollection,
};
