const express = require('express');
const ensureLoggedIn = require('../middlewares/ensureLoggedIn');
const {
  getItem,
  createItem,
  updateItem,
  deleteItem,
} = require('../controllers/itemController');
const {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} = require('../controllers/commentController');

const router = express.Router();

router
  .route('/')
  .post(ensureLoggedIn, createItem);

router
  .route('/:id')
  .get(getItem)
  .put(ensureLoggedIn, updateItem)
  .delete(ensureLoggedIn, deleteItem);

// comment routes
router
  .route('/:id/comments')
  .get(getComments)
  .post(ensureLoggedIn, createComment)
  .put(ensureLoggedIn, updateComment)
  .delete(ensureLoggedIn, deleteComment);

module.exports = router;
