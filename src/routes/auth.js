const express = require('express');
const {check} = require('express-validator');
const Auth = require('../controllers/auth');
const Password = require('../controllers/password');
const validate = require('../middlewares/validate');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({message: "You are in the Auth Endpoint. Register or Login to test Authentication."});
});

router.post('/register', validate, Auth.register);

router.post('/form', Auth.form);

router.post("/login", [
    check('email').isEmail().withMessage('Enter a valid email address'),
    check('password').not().isEmpty(),
], validate, Auth.login);

router.get('/verify/:token', Auth.verify);
router.post('/resend', Auth.resendToken);

router.post('/recover', [
    check('email').isEmail().withMessage('Enter a valid email address'),
], validate, Password.recover);

router.get('/reset/:token', Password.reset);

router.post('/reset/:token', [
    check('password').not().isEmpty().isLength({min: 8}).withMessage('Must be at least 8 chars long'),
    check('confirmPassword', 'Passwords do not match').custom((value, {req}) => (value === req.body.password)),
], validate, Password.resetPassword);

module.exports = router;