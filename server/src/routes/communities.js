const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check } = require('express-validator');
const communityController = require('../controllers/communityController');

// @route   GET api/communities
// @desc    Get all communities
// @access  Public
router.get('/', communityController.getCommunities);

// @route   POST api/communities
// @desc    Create a new community
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
    ],
  ],
  communityController.createCommunity
);

// // @route   GET api/communities/:id
// // @desc    Get community by ID
// // @access  Public
// router.get('/:id', communityController.getCommunityById);

// // @route   PUT api/communities/:id
// // @desc    Update a community
// // @access  Private
// router.put('/:id', auth, communityController.updateCommunity);

// @route   POST api/communities/:id/join
// @desc    Join a community
// @access  Private
router.post('/:id/join', auth, communityController.joinCommunity);

module.exports = router;