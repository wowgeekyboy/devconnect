const Challenge = require('../models/Challenge');

exports.createChallenge = async (req, res) => {
  try {
    const { title, description, difficulty, starterCode, testCases } = req.body;
    const newChallenge = new Challenge({
      user: req.user.id,
      title,
      description,
      difficulty,
      starterCode,
      testCases
    });
    const challenge = await newChallenge.save();
    res.status(201).json(challenge);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find().sort({ createdAt: -1 }).populate('user', 'name');
    res.json(challenges);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getChallengeById = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id).populate('user', 'name');
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    res.json(challenge);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateChallenge = async (req, res) => {
  try {
    const { title, description, difficulty, starterCode, testCases } = req.body;
    let challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    if (challenge.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    challenge = await Challenge.findByIdAndUpdate(req.params.id, 
      { title, description, difficulty, starterCode, testCases },
      { new: true }
    );
    res.json(challenge);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    if (challenge.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await challenge.remove();
    res.json({ message: 'Challenge removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.submitChallenge = async (req, res) => {
  try {
    const { code } = req.body;
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    
    // Here, you would typically run the submitted code against the test cases
    // For simplicity, we'll just mark it as passed
    const passed = true;

    challenge.submissions.push({
      user: req.user.id,
      code,
      passed
    });
    await challenge.save();
    
    res.json({ message: 'Submission successful', passed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};