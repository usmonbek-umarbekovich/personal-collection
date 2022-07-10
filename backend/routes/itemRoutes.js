const express = require('express');
const ensureLoggedIn = require('../middlewares/ensureLoggedIn');
const {
  getItem,
  createItem,
  updateItem,
  deleteItem,
} = require('../controllers/itemController');

const router = express.Router();

// public routes
router.get('/:id', getItem);

// private routes
router.post('/', ensureLoggedIn, createItem);
router.put('/:id', ensureLoggedIn, updateItem);
router.delete('/:id', ensureLoggedIn, deleteItem);

module.exports = router;
