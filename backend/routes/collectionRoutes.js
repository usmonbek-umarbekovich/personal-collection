const express = require('express');
const ensureLoggedIn = require('../middlewares/ensureLoggedIn');
const {
  getCollections,
  getOwnCollections,
  createCollection,
  updateCollection,
  deleteCollection,
} = require('../controllers/collectionController');

const router = express.Router();

// public routes
router.get('/', getCollections);

// private routes
router.post('/', ensureLoggedIn, createCollection);
router.put('/:id', ensureLoggedIn, updateCollection);
router.delete('/:id', ensureLoggedIn, deleteCollection);
router.get('/me', ensureLoggedIn, getOwnCollections);

// collection items routes
router.use('/:colId/item', require('./itemRoutes'));

module.exports = router;
