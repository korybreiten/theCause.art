const express = require('express');
const router = express.Router();
const bidCtrl = require('../controllers/bids');

// /*---------- Public Routes ----------*/
router.post('/create', bidCtrl.create);
router.put('/:id', bidCtrl.update);
router.get('/one/:id', bidCtrl.getOne);
router.get('/all', bidCtrl.getAll);
router.get('/all/:id', bidCtrl.getUser);
router.delete('/:id', bidCtrl.remove);


/*---------- Protected Routes ----------*/




module.exports = router;