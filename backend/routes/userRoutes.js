const express = require('express');
const {
  getSingleUser,
  getUserItems,
  getUserComment,
  getUserCollections,
} = require('../controllers/userController');

const router = express.Router();

module.exports = router;

// public routes
router.get('/:id', getSingleUser);
router.get('/:id/items', getUserItems);
router.get('/:id/comment', getUserComment);
router.get('/:id/collections', getUserCollections);
