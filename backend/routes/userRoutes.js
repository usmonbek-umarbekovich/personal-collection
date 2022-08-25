const express = require('express');
const ensureLoggedIn = require('../middlewares/ensureLoggedIn');
const {
  getSingleUser,
  getUserItems,
  getUserCollections,
  updateUser,
  blockOrUnblockUser,
} = require('../controllers/userController');

const router = express.Router();

module.exports = router;

// public routes
router.get('/:id', getSingleUser);
router.get('/:id/items', getUserItems);
router.get('/:id/collections', getUserCollections);

// private routes
router.put('/:id', ensureLoggedIn, updateUser);
router.post('/:id/block', ensureLoggedIn, blockOrUnblockUser);
