const express = require('express');
const ensureLoggedIn = require('../middlewares/ensureLoggedIn');
const {
  getAllItems,
  getSingleItem,
  getAllTags,
  getItemTags,
  createItem,
  updateItem,
  deleteItem,
  likeOrUnlikeItem,
  searchItems,
} = require('../controllers/itemController');
const {
  getItemComments,
  createComment,
  updateComment,
  deleteComment,
} = require('../controllers/commentController');

const router = express.Router();

router.route('/').get(getAllItems).post(ensureLoggedIn, createItem);
router.route('/search').get(searchItems);

router.get('/tags/all', getAllTags);
router.get('/:id/tags', getItemTags);
router.post('/:id/likes', ensureLoggedIn, likeOrUnlikeItem);

router
  .route('/:id')
  .get(getSingleItem)
  .put(ensureLoggedIn, updateItem)
  .delete(ensureLoggedIn, deleteItem);

// comment routes
router
  .route('/:id/comments')
  .get(getItemComments)
  .post(ensureLoggedIn, createComment);

router
  .route('/:itemId/comments/:commentId')
  .put(ensureLoggedIn, updateComment)
  .delete(ensureLoggedIn, deleteComment);

module.exports = router;
