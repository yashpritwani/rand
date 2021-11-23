const User = require('../models/user');

exports.recover = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'The email address ' + req.body.email + ' is not associated with any account.'});
        user.generatePasswordReset();
        await user.save();
        let link = "http://" + req.headers.host + "/auth/reset/" + user.resetPasswordToken;
        res.status(200).json({message: 'Reset link:- ' + link});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

exports.reset = async (req, res) => {
    try {
        const { token } = req.params;
        const user = await User.findOne({resetPasswordToken: token, resetPasswordExpires: {$gt: Date.now()}});
        if (!user) return res.status(401).json({message: 'Password reset token is invalid or has expired.'});
        res.render('reset', {user});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const user = await User.findOne({resetPasswordToken: token, resetPasswordExpires: {$gt: Date.now()}});
        if (!user) return res.status(401).json({message: 'Password reset token is invalid or has expired.'});
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        user.isVerified = true;
        await user.save();
        res.status(200).json({message: 'Your password has been updated.'});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};