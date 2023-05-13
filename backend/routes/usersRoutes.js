const router = require('express').Router();
const UserController = require('../controllers/UserController');
// const userController = new UserController();

router.route('/users').post((request, response) => UserController.registerUsers(request, response));

module.exports = router;