const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check } = require('express-validator');
const jobController = require('../controllers/jobController');

// @route   GET api/jobs
// @desc    Get all jobs
// @access  Public
router.get('/', jobController.getJobs);

// @route   POST api/jobs
// @desc    Create a new job
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('company', 'Company is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
    ],
  ],
  jobController.createJob
);

// @route   GET api/jobs/:id
// @desc    Get job by ID
// @access  Public
router.get('/:id', jobController.getJobById);

// @route   PUT api/jobs/:id
// @desc    Update a job
// @access  Private
router.put('/:id', auth, jobController.updateJob);

// @route   DELETE api/jobs/:id
// @desc    Delete a job
// @access  Private
router.delete('/:id', auth, jobController.deleteJob);

module.exports = router;