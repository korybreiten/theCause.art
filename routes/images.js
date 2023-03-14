const express = require('express');
const router = express.Router();
const imagesCtrl = require('../controllers/images');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, './public/images')
    },
    filename: (req, file, callBack) => {
        callBack(null, Date.now() / 1000 + '.' + file.originalname.split('.').pop())
    }
});
const upload = multer({ storage: storage });

/*---------- Public Routes ----------*/
router.post('/save_image', upload.single('image'), imagesCtrl.saveImage);

/*---------- Protected Routes ----------*/




module.exports = router;