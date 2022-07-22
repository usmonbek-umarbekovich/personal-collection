const express = require('express');
const ensureLoggedIn = require('../middlewares/ensureLoggedIn');
const {
  getAllCollections,
  getSingleCollection,
  getCollectionItems,
  getCollectionTags,
  getAllTopics,
  createCollection,
  updateCollection,
  deleteCollection,
} = require('../controllers/collectionController');

const router = express.Router();

router.route('/').get(getAllCollections).post(ensureLoggedIn, createCollection);

router.get('/topics/all', getAllTopics);
router.get('/:id/items', getCollectionItems);
router.get('/:id/tags', getCollectionTags);

// protected routes
router
  .route('/:id')
  .get(getSingleCollection)
  .put(ensureLoggedIn, updateCollection)
  .delete(ensureLoggedIn, deleteCollection);

module.exports = router;
