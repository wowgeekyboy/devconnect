const Community = require('../models/Community');

exports.createCommunity = async (req, res) => {
  try {
    const { name, description } = req.body;
    const community = new Community({
      name,
      description,
      creator: req.user.id,
      members: [req.user.id],
    });
    await community.save();
    res.status(201).json(community);
  } catch (error) {
    res.status(500).json({ message: 'Error creating community', error: error.message });
  }
};

exports.getCommunities = async (req, res) => {
  try {
    const communities = await Community.find().populate('creator', 'name');
    res.json(communities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching communities', error: error.message });
  }
};

exports.joinCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }
    if (community.members.includes(req.user.id)) {
      return res.status(400).json({ message: 'User already a member' });
    }
    community.members.push(req.user.id);
    await community.save();
    res.json(community);
  } catch (error) {
    res.status(500).json({ message: 'Error joining community', error: error.message });
  }
};