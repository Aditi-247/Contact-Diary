const express = require('express');
const passport = require('passport');
const router =  express.Router();
const userController = require('../Controller/user_controller');

router.get('/profile',passport.checkAuthentication, userController.profile);
router.get('/update',passport.checkAuthentication, userController.update);
router.post('/updated',passport.checkAuthentication, userController.updatep);
router.get('/sign-up', userController.signUp);
router.get('/sign-in', userController.signIn);

router.post('/create', userController.create);
router.post('/createsession',passport.authenticate(
    'local',
    {failureRedirect:'/user/sign-in'}),
    userController.createSession);
// signing out
router.get('/sign-out',userController.destroySession);   

// verify
router.get('/verify/:accesstokenvalue',userController.verify);
// google auth 
router.get('/auth/google', passport.authenticate('google',{scope: ['profile','email']}));
router.get('/auth/google/callback', passport.authenticate('google',{failureRedirect: "/user/sign-in"}),userController.createSession); 

router.get('/forgetpassword',userController.forgetpage);
router.post('/forgetmypass',userController.forgetpass);
router.get('/updatepassword/:accesstokenvalue/:email',userController.updatepass);
router.post('/newpass',userController.newpass);

module.exports = router;

