const Job = require('../models/Job');

exports.createJob = async (req, res) => {
  try {
    const { title, company, location, description, requirements, salary, applicationLink } = req.body;
    const newJob = new Job({
      user: req.user.id,
      title,
      company,
      location,
      description,
      requirements,
      salary,
      applicationLink
    });
    const job = await newJob.save();
    res.status(201).json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 }).populate('user', 'name');
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('user', 'name');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const { title, company, location, description, requirements, salary, applicationLink } = req.body;
    let job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    if (job.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    job = await Job.findByIdAndUpdate(req.params.id, 
      { title, company, location, description, requirements, salary, applicationLink },
      { new: true }
    );
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    if (job.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await job.remove();
    res.json({ message: 'Job removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.applyToJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    if (job.applicants.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already applied to this job' });
    }
    job.applicants.push(req.user.id);
    await job.save();
    res.json({ message: 'Application submitted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};