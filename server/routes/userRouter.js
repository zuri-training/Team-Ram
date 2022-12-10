const express = require('express');
const router = express.Router();
const controller = require('../controller/userController');

router
.get('/:id', controller.getUser)
.put('/:id', controller.updateUser)
.delete('/:id', controller.deleteUser);

module.exports = router;
