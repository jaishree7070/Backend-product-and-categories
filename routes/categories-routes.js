const express = require("express"); //importing express in an object

const router = express.Router(); //to setup middlewares
const categoriesControllers=require("../controllers/categories-controllers")


//****To read all the categories  from the table****//
router.get('/readAll',categoriesControllers.getAllCategories);

//***To create a category ***//
router.post('/create',categoriesControllers.createCategory)


module.exports = router;
