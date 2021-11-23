const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Token = require('../models/token');

const FormSchema = new mongoose.Schema({
    emailId: {
        type: String,
        unique: true,
        required: false,
        trim: true
    },
    username: {
        type: String,
        unique: true,
        required: false,
    },
    password: {
        type: String,
        required: false,
        max: 100
    },
    phone: {
        type: String,
        required: false,
        max: 100
    },
    firstName: {
        type: String,
        required: false,
        max: 100
    },
    lastName: {
        type: String,
        required: false,
        max: 100
    },
    lovedFirstName: {
        type: String,
        required: false,
        max: 100
    },
    lovedLastName: {
        type: String,
        required: false,
        max: 100
    },
    gender: {
        type: String,
        required: false,
        max: 100
    },
    dob: {
        type: String,
        required: false,
        max: 100
    },
    dateOfDeath: {
        type: String,
        required: false,
        max: 100
    },
    relation: {
        type: String,
        required: false,
        max: 100
    },
    placeOfDemise: {
        type: String,
        required: false,
        max: 100
    },
    relativeNumber: {
        type: String,
        required: false,
        max: 100
    },
    state: {
        type: String,
        required: false,
        max: 100
    },
    district: {
        type: String,
        required: false,
        max: 100
    },
    lovedState: {
        type: String,
        required: false,
        max: 100
    },
    lovedDistrict: {
        type: String,
        required: false,
        max: 100
    },
    whatsappNumber: {
        type: String,
        required: false,
        max: 100
    },
    organisationName: {
        type: String,
        required: false,
        max: 100
    },
    assembly: {
        type: String,
        required: false,
        max: 100
    },
    profileImage: {
        type: String,
        required: false,
        max: 5000
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: {
        type: String,
        required: false
    },
    resetPasswordExpires: {
        type: Date,
        required: false
    },
}, {timestamps: true});


FormSchema.pre('save',  function(next) {
    const form = this;
    if (!form.isModified('password')) return next();
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(form.password, salt, function(err, hash) {
            if (err) return next(err);
            form.password = hash;
            next();
        });
    });
});

FormSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

FormSchema.methods.generateJWT = function() {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);
    let payload = {
        id: this._id,
        email: this.email,
        username: this.username,
        firstName: this.firstName,
        lastName: this.lastName,
    };
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: parseInt(expirationDate.getTime() / 1000, 10)
    });
};

FormSchema.methods.generatePasswordReset = function() {
    this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};

FormSchema.methods.generateVerificationToken = function() {
    let payload = {
        userId: this._id,
        token: crypto.randomBytes(20).toString('hex')
    };

    return new Token(payload);
};

module.exports = mongoose.model('Forms', FormSchema);