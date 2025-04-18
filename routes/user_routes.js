const Router = require('express')
const authMiddleware = require('../middleWare')
const router = new Router()

const userController =require('../controllers/user_controller')

const middleWare = require('../middleWare');

router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/', userController.getUsers)
router.get('/:id', userController.getOneUser)
router.delete('/:id', userController.deleteUser)
router.put('/update/:id', middleWare,userController.updateUser)
router.post('/refreshToken', userController.refreshToken)
router.post('/logout', userController.logout)


module.exports = router