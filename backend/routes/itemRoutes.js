const express = require('express');
const ensureLoggedIn = require('../middlewares/ensureLoggedIn');
const {
  getAllItems,
  getSingleItem,
  getAllTags,
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

router.route('/').get(getAllItems).post(ensureLoggedIn, createItem);

router.get('/all/tags', getAllTags);
router.post('/:id/likes', ensureLoggedIn, likeOrUnlikeItem);

router
  .route('/:id')
  .get(getSingleItem)
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
