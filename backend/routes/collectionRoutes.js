const express = require('express');
const ensureLoggedIn = require('../middlewares/ensureLoggedIn');
const {
  getCollections,
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

module.exports = router;
