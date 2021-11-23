const User = require('../models/user');

exports.index = async function (req, res) {
    const users = await User.find({});
    res.status(200).json({users});
};

exports.store = async (req, res) => {
    try {
        const {email} = req.body;
        const user = await User.findOne({email});
        if (user) 
            return res.status(401).json({message: 'The email address you have entered is already associated with another account. You can change this users role instead.'});
        const password = '_' + Math.random().toString(36).substr(2, 9); 
        const newUser = new User({...req.body, password});
        const user_ = await newUser.save();
        user_.generatePasswordReset();
        await user_.save();
        res.status(200).json({message: 'User created'});
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
};

exports.show = async function (req, res) {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        if (!user) 
            return res.status(401).json({message: 'User does not exist'});
        res.status(200).json({user});
    } catch (error) {
        res.status(500).json({message: error.message})
    }
};

exports.update = async function (req, res) {
    try {
        const update = req.body;
        const id = req.user._id;
        
        const user = await User.findByIdAndUpdate(id, {$set: update}, {new: true});
        if (!req.file) 
            return res.status(200).json({user, message: 'User has been updated'});
        const result = await uploader(req);
        const user_ = await User.findByIdAndUpdate(id, {$set: update}, {$set: {profileImage: result.url}}, {new: true});
        if (!req.file) 
            return res.status(200).json({user: user_, message: 'User has been updated'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.destroy = async function (req, res) {
    try {
        const id = req.params.id;
        const user_id = req.user._id;
        if (user_id.toString() !== id.toString()) 
            return res.status(401).json({message: "No permission to delete this data."});
        await User.findByIdAndDelete(id);
        res.status(200).json({message: 'User has been deleted'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.upgrade = async function (req, res) {
    try {
        const id = req.params.id;
        const user_ = await User.findById(id) 
        if (!user_) 
            return res.status(401).json({message: 'User does not exist'});
        user_.role = 'enterprise'
        await user_.save();

        res.status(200).json({user: user_, message: 'Upgraded to Enteprise'});
    }
    catch (error) {
        res.status(500).json({message: error.message});
    }
}