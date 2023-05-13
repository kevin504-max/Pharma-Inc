const router = require('express').Router();
const UserController = require('../controllers/UserController');
const userController = new UserController();

router.post('/users', (request, response) => userController.registerUsers(request, response));
router.get('/users', (request, response) => userController.getUsers(request, response));
router.get('/users/:userId', (request, response) => userController.findUser(request, response));
router.put('/users/:userId', (request, response) => userController.updateUser(request, response));
router.delete('/users/:userId', (request, response) => userController.removeUser(request, response));

module.exports = router;