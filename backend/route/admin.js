const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin,getAdminProfile ,updateAdminProfile
,logoutUser
} = require('../controller/admin');
const {uploadLogo} =  require('../middleware/logoUpload')

const { requireAuth } = require('../middleware/requireAuth');
const image = require('../middleware/imgUpload');

// Admin registration route
router.post('/register',uploadLogo, registerAdmin);

router.get('/adminprofile', requireAuth, getAdminProfile);
router.put('/updateAdminprofile', requireAuth,image,updateAdminProfile);

// Admin login route
router.post('/login', loginAdmin);
router.post('/logout',logoutUser
);

module.exports = router;
