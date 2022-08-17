const asyncHandler = require('express-async-handler');
const Item = require('../models/itemModel');
const Collection = require('../models/collectionModel');
const User = require('../models/userModel');
const { getItemsPipeline } = require('./itemController');

/**
 * @desc Search database
 * @route GET /api/search
 * @access Private
 */
const search = asyncHandler(async (req, res) => {
  let { term, limit, skip, type = 'all' } = req.query;

  const itemPipeline = [
    {
      $search: {
        index: 'searchItems',
        text: {
          query: term,
          path: ['name', 'description'],
          fuzzy: {},
        },
      },
    },
    { $addFields: { score: { $meta: 'searchScore' } } },
  ];

  const colPipeline = [
    {
      $search: {
        index: 'searchCollections',
        text: {
          query: term,
          path: ['name', 'description'],
          fuzzy: {},
        },
      },
    },
    { $addFields: { score: { $meta: 'searchScore' } } },
    { $sort: { score: -1, createdAt: -1 } },
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
      $unwind: '$user',
    },
  ];

  const userPipeline = [
    {
      $search: {
        index: 'searchUsers',
        text: {
          query: term,
          path: ['name.first', 'name.last'],
          fuzzy: {},
        },
      },
    },
    {
      $lookup: {
        from: 'collections',
        localField: '_id',
        foreignField: 'user',
        as: 'numCollections',
        pipeline: [{ $count: 'num' }],
      },
    },
    {
      $lookup: {
        from: 'items',
        localField: '_id',
        foreignField: 'user',
        as: 'numItems',
        pipeline: [{ $count: 'num' }],
      },
    },
    { $unwind: '$numCollections' },
    { $unwind: '$numItems' },
    {
      $addFields: {
        score: { $meta: 'searchScore' },
        numCollections: '$numCollections.num',
        numItems: '$numItems.num',
      },
    },
    { $sort: { score: -1, registrationTime: -1 } },
    { $skip: +skip },
    { $limit: +limit },
  ];

  let result = { items: [], collections: [], users: [] };

  if (type === 'item' || type === 'all') {
    result.items = await Item.aggregate([
      ...itemPipeline,
      ...getItemsPipeline({}, { skip, limit, score: -1, createdAt: -1 }),
    ]);
  }
  if (type === 'collection' || type === 'all') {
    result.collections = await Collection.aggregate(colPipeline);
  }
  if (type === 'user' || type === 'all') {
    result.users = await User.aggregate(userPipeline);
  }

  res.status(200).json(result);
});

module.exports = search;
