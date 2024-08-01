const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check } = require('express-validator');
const projectController = require('../controllers/projectController');

// @route   GET api/projects
// @desc    Get all projects
// @access  Public
router.get('/', projectController.getProjects);

// @route   POST api/projects
// @desc    Create a new project
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
    ],
  ],
  projectController.createProject
);

// @route   GET api/projects/:id
// @desc    Get project by ID
// @access  Public
router.get('/:id', projectController.getProjectById);

// @route   PUT api/projects/:id
// @desc    Update a project
// @access  Private
router.put('/:id', auth, projectController.updateProject);

// @route   DELETE api/projects/:id
// @desc    Delete a project
// @access  Private
router.delete('/:id', auth, projectController.deleteProject);

module.exports = router;