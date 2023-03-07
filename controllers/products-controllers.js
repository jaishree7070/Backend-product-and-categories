//This will have all the middleware functions that will be reached through the /api/products/... middlewares

const HttpError = require("../models/http-error");
const Product = require("../models/product");
const Category = require("../models/category");
const { default: mongoose } = require("mongoose");

const getProductByProductId = async (req, res, next) => {
  const productId = req.params.pid;
  //if the Product table has the productID
  try {
    const product = await Product.findById(productId);
    //if we cant find any product with the given product ID throw an error for async functionn
    if (!product) {
      return next(
        new HttpError(
          "Could not find any product with the given ID",
          404 //NOT FOUND
        )
      );
    }
    res.json({ product: product.toObject({ getters: true }) }); //to add an ID property to the data
  } catch (e) {
    return next(
      new HttpError("Something went wrong! Fetching a product failed", 500)
    );
  }
};

const getProductsByCategoryId = async (req, res, next) => {
  const cid = req.params.cid;
  try {
    //if the data has the certain category
    const products = await Product.find({ categoryId: cid });
    //if we cant find any product with the given Product ID the
    if (!products || products.length === 0) {
      return next(
        new HttpError(
          "Could not find any product with the given category ID",
          404 //NOT FOUND
        )
      );
    }

    res.json({
      products: products.map((product) => product.toObject({ getters: true })),
    });
    //to add an ID property to the data
  } catch (e) {
    console.log(e);
    return next(
      new HttpError(
        "Something went wrong, Fetching products failed",
        500 //NOT FOUND
      )
    );
  }
};

const createProduct = async (req, res, next) => {
  const {
    productName,
    qtyPerUnit,
    unitPrice,
    unitInStock,
    discontinued,
    categoryId,
  } = req.body;

  let category;
  try {
    category = await Category.findById(categoryId);
    //If the categoryId does not exists
    if (!category) {
      const error = new HttpError(
        "Could not find any category with the category id",
        404
      );
      return next(error);
    }
  } catch (e) {
    const error = new HttpError(
      "Something went wrong! creating product failed",
      500
    );
    return next(error);
  }

  const createdProduct = new Product({
    productName,
    qtyPerUnit,
    unitPrice,
    unitInStock,
    discontinued,
    categoryId,
  });
  try {
    //To roll back all the changes ,if any of the tasks fails we use sessions
    const sess = await mongoose.startSession();
    sess.startTransaction();
    //To save the data in the database with new Product id
    await createdProduct.save({ session: sess });
    category.products.push(createdProduct);
    await category.save({ session: sess });
    await sess.commitTransaction();
  } catch (e) {
    const error = new HttpError(
      "Something went wrong!Creating category failed",
      500
    );
    return next(error);
  }
  res.status(201).json({ product: createdProduct });
};

const updateProductById = async (req, res, next) => {
  const {
    productName,
    qtyPerUnit,
    unitPrice,
    unitInStock,
    discontinued,
    categoryId,
  } = req.body;
  const productId = req.params.pid;
  let product;
  //if the table has the productID
  try {
    product = await Product.findById(productId);
    //if we cant find any product with the given product ID throw an error for async functionn
    if (!product) {
      return next(
        new HttpError(
          "Could not find any product with the given ID to update",
          404 //NOT FOUND
        )
      );
    }
  } catch (e) {
    return next(
      new HttpError("Something went wrong! Fetching a product failed", 500)
    );
  }
  product.productName = productName;
  product.qtyPerUnit = qtyPerUnit;
  product.unitPrice = unitPrice;
  product.unitInStock = unitInStock;
  product.discontinued = discontinued;
  product.categoryId = categoryId;
  try {
    await product.save();
    res.status(200).json({ product: product.toObject({ getters: true }) });
  } catch (e) {
    return next(
      new HttpError("Something went wrong! Updating the product failed", 500)
    );
  }
};

const deleteProductById = async (req, res, next) => {
  const productId = req.params.pid;
  let product;
  //if the table has the productID
  try {
    product = await Product.findById(productId).populate("categoryId"); //to populate to the related documents
    //if we cant find any product with the given product ID throw an error for async functionn
    if (!product) {
      return next(
        new HttpError(
          "Could not find any product with the given ID to delete",
          404 //NOT FOUND
        )
      );
    }
  } catch (e) {
    return next(
      new HttpError("Something went wrong! Deleting the product failed ", 500)
    );
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await product.deleteOne({session:sess});
    product.categoryId.products.pull(product);
    await product.categoryId.save({session:sess});
    await sess.commitTransaction();

  } catch (e) {
    return next(
      new HttpError(e, 500)
    );
  }
  res.status(200).json({ message: "Deleted the product" });
};

exports.getProductByProductId = getProductByProductId;
exports.getProductsByCategoryId = getProductsByCategoryId;
exports.createProduct = createProduct;
exports.deleteProductById = deleteProductById;
exports.updateProductById = updateProductById;
