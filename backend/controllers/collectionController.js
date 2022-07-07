const asyncHandler = require('express-async-handler');
const Collection = require('../models/collectionModel');

/**
 * @desc Get collections
 * @route GET /api/collections
 * @access Public
 */
const getCollections = asyncHandler(async (req, res, next) => {
  const { term = '' } = req.query;
  const collection = await Collection.aggregate([
    {
      $search: {
        index: "searchIndex",
        text: {
          query: term,
          path: { wildcard: '*' },
          fuzzy: {},
        },
      },
    },
  ]);
  res.status(200).json(collection);
});

/**
 * @desc Create collection
 * @route POST /api/collections
 * @access Private
 */
const createCollection = asyncHandler(async (req, res) => {
  const { name, topic, description, picture } = req.body;

  const collection = await Collection.create({
    user: req.user._id,
    name,
    topic,
    description,
    picture,
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

  if (!collection) {
    res.status(400);
    throw new Error('Collection not found');
  }

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

  if (!collection) {
    res.status(400);
    throw new Error('collection not found');
  }

  await collection.remove();

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getCollections,
  createCollection,
  updateCollection,
  deleteCollection,
};
