const express = require('express');
const ensureLoggedIn = require('../middlewares/ensureLoggedIn');
const {
  getItem,
  getItems,
  getTags,
  createItem,
  updateItem,
  deleteItem,
  likeOrUnlikeItem,
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
  .get(getItems)
  .post(ensureLoggedIn, createItem);

router
  .route('/:id')
  .get(getItem)
  .put(ensureLoggedIn, updateItem)
  .delete(ensureLoggedIn, deleteItem);

router
  .route('/:id/like')
  .post(ensureLoggedIn, likeOrUnlikeItem);

router
  .route('/tags/all')
  .get(getTags)

// comment routes
router
  .route('/:id/comments')
  .get(getComments)
  .post(ensureLoggedIn, createComment)
  .put(ensureLoggedIn, updateComment)
  .delete(ensureLoggedIn, deleteComment);

module.exports = router;
