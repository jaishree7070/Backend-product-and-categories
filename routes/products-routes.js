const express = require("express"); //importing express in an object

const router = express.Router(); //to setup middlewares
const productControllers=require("../controllers/products-controllers")

//**** To read a particular product from the table****//
router.get('/read/:pid',productControllers.getProductByProductId);

//**** To read all the products from a particular category from the table****//
router.get('/readAll/category/:cid',productControllers.getProductsByCategoryId);

//*** To create a product ***//
router.post('/create',productControllers.createProduct)

//*** To update a product ***//
router.patch('/:pid',productControllers.updateProductById);

//*** To delete a product ***//
router.delete('/:pid',productControllers.deleteProductById)

module.exports = router;
