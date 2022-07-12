const express = require('express');
const ensureLoggedIn = require('../middlewares/ensureLoggedIn');
const {
  getCollections,
  getOwnCollections,
  getCollectionTopics,
  getSingleCollection,
  createCollection,
  updateCollection,
  deleteCollection,
} = require('../controllers/collectionController');

const router = express.Router();

router
  .route('/')
  .get(getCollections)
  .post(ensureLoggedIn, createCollection);

router
  .route('/:id')
  .put(ensureLoggedIn, updateCollection)
  .delete(ensureLoggedIn, deleteCollection);

router
  .route('/me')
  .get(ensureLoggedIn, getOwnCollections);

router
  .route('/topics')
  .get(getCollectionTopics);

router
  .route('/single/:id')
  .get(getSingleCollection);

module.exports = router;
