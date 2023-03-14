const express = require('express');
const router = express.Router();
const causeCtrl = require('../controllers/causes');

// /*---------- Public Routes ----------*/
router.post('/create', causeCtrl.create);
router.put('/:id', causeCtrl.update);
router.get('/one/:id', causeCtrl.getOne);
router.get('/all', causeCtrl.getAll);
router.delete('/:id', causeCtrl.remove);


/*---------- Protected Routes ----------*/




module.exports = router;