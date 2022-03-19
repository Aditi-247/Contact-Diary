const express = require('express');
const passport = require('passport');
const router =  express.Router();
const homeController = require('../Controller/home_controller');

router.get('/', homeController.landing);
router.get('/home', passport.checkAuthentication,homeController.home);
router.use('/user',require('./user'));
router.get('/create_contact', homeController.addContacts);
router.post('/show_contact', homeController.createcontact);
router.get('/delete-contact', homeController.deletecontact);
// router.use('/user',require('./user'));
console.log('runing');
module.exports = router; 