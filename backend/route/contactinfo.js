const express = require('express');
const router = express.Router();
const UserController = require('../controller/contactinfo');
const image =  require('../middleware/imgUpload')

const { requireAuth } = require('../middleware/requireAuth');

// Routes for user operations
router.post('/add',image, UserController.createUser);
router.get('/get', UserController.getAllUsers);
router.get('/getById', UserController.getUserById);
router.put('/update',image, UserController.updateUser);
router.delete('/delete', UserController.deleteUser);

module.exports = router;
