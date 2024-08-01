const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check } = require('express-validator');
const challengeController = require('../controllers/challengeController');

// @route   GET api/challenges
// @desc    Get all challenges
// @access  Public
router.get('/', challengeController.getChallenges);

// @route   POST api/challenges
// @desc    Create a new challenge
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('difficulty', 'Difficulty is required').not().isEmpty(),
    ],
  ],
  challengeController.createChallenge
);

// @route   GET api/challenges/:id
// @desc    Get challenge by ID
// @access  Public
router.get('/:id', challengeController.getChallengeById);

// @route   PUT api/challenges/:id
// @desc    Update a challenge
// @access  Private
router.put('/:id', auth, challengeController.updateChallenge);

// @route   DELETE api/challenges/:id
// @desc    Delete a challenge
// @access  Private
router.delete('/:id', auth, challengeController.deleteChallenge);

// @route   POST api/challenges/:id/submit
// @desc    Submit a solution to a challenge
// @access  Private
router.post('/:id/submit', auth, challengeController.submitChallenge);

module.exports = router;