const asyncHandler = require('express-async-handler');
const Collection = require('../models/collectionModel');
const notFoundError = require('../helpers/notFoundError');

/**
 * @desc Get single collection item
 * @route GET /api/collections/:colId/item/:itemId
 * @access Public
 */
const getItem = asyncHandler(async (req, res) => {
  const { colId, itemId } = req.params;
  const collection = await Collection.findById(colId);
  if (!collection) notFoundError(res, 'Collection');

  const item = collection.items.id(itemId);
  if (!item) notFoundError(res, 'Item');

  res.status(200).json(item);
});

/**
 * @desc Create collection item
 * @route POST /api/collections/:colId/item
 * @access Private
 */
const createItem = asyncHandler(async (req, res) => {
  const collection = await Collection.findById(req.params.colId);
  if (!collection) notFoundError(res, 'Collection');

  collection.items.push(req.body);
  await collection.save();

  res.status(200).json(collection.items);
});

/**
 * @desc Update collection item
 * @route PUT /api/collections/:colId/item/:itemId
 * @access Private
 */
const updateItem = asyncHandler(async (req, res) => {
  const { colId, itemId } = req.params;
  const collection = await Collection.findById(colId);
  if (!collection) notFoundError(res, 'Collection');

  const item = collection.items.id(itemId);
  if (!item) notFoundError(res, 'Item');

  Object.assign(item, req.body);
  await collection.save();

  res.status(200).json(item);
});

/**
 * @desc Delete collection item
 * @route DELETE /api/collections/:colId/item/:itemId
 * @access Private
 */
const deleteItem = asyncHandler(async (req, res) => {
  const { colId, itemId } = req.params;
  const collection = await Collection.findById(colId);
  if (!collection) notFoundError(res, 'Collection');

  const item = collection.items.id(itemId);
  if (!item) notFoundError(res, 'Item');

  item.remove();
  await collection.save();

  res.status(200).json({ id: itemId });
});

module.exports = {
  getItem,
  createItem,
  updateItem,
  deleteItem,
};
