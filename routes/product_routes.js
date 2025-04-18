const Router = require('express')
const router = new Router()
const controller = require('../controllers/product_controller')
const middleWare = require('../middleWare');

router.post('/create', middleWare,controller.createProduct)
router.get('/get', controller.getProducts)
router.get('/get/:id', middleWare,controller.getOneProduct)
router.put('/update', middleWare,controller.updateProduct)
router.delete('/delete/:id', middleWare,controller.deleteProduct)

module.exports = router
