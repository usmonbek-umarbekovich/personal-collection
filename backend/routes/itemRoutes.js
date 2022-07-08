const express = require('express');
const ensureLoggedIn = require('../middlewares/ensureLoggedIn');
const {
  getItem,
  createItem,
  updateItem,
  deleteItem,
} = require('../controllers/itemController');

const router = express.Router({ mergeParams: true });

// public routes
router.get('/:itemId', getItem);

// private routes
router.post('/', ensureLoggedIn, createItem);
router.put('/:itemId', ensureLoggedIn, updateItem);
router.delete('/:itemId', ensureLoggedIn, deleteItem);

module.exports = router;
