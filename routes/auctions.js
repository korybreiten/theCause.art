const express = require('express');
const router = express.Router();
const auctionsCtrl = require('../controllers/auctions');

/*---------- Public Routes ----------*/
router.post('/create', auctionsCtrl.create);
router.put('/:id', auctionsCtrl.update);
router.get('/one/:id', auctionsCtrl.getOne);
router.get('/user/:id', auctionsCtrl.getUser);
router.get('/all', auctionsCtrl.getAll);
router.get('/all/:id', auctionsCtrl.getCause);
router.delete('/:id', auctionsCtrl.remove);

/*---------- Protected Routes ----------*/




module.exports = router;