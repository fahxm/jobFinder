const User = require('../models/User');

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        const { fullName, qualification, experience, skills, resumeSummary } = req.body;
        const user = await User.findOneAndUpdate(
            { email: req.params.email },
            { fullName, qualification, experience, skills, resumeSummary, updatedAt: Date.now() },
            { new: true }
        );
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
