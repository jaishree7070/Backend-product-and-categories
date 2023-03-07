//This will have all the functions that will be reached through the /api/categories/... middlewares
const Category = require("../models/category");
const HttpError = require("../models/http-error");

const getAllCategories = async (req, res, next) => {
  let categories;
  try {
    categories =await Category.find({});
    res.json({
      categories: categories.map((c) => c.toObject({ getters: true })),
    });
  } catch (e) {
    return next(
      new HttpError("Something went wrong, fetching categories failed", 500)
    );
  }
};

const createCategory = async (req, res, next) => {
  const { categoryName } = req.body;
  try {
    existingCategory = await Category.findOne({ categoryName });
  } catch (e) {
    return next(
      new HttpError("Something went wrong, creating category failed", 500)
    );
  }
  if (existingCategory) {
    return next(new HttpError("Category already exists", 422));
  }
  const createdCategory = new Category({
    categoryName,
    products:[]
  });
  try {
    //To save the data in the database  with new category id
    await createdCategory.save();
  } catch (e) {
    const error = new HttpError(
      "Something went wrong! creating category failed",
      500
    );
    return next(error);
  }
  res
    .status(201)
    .json({ category: createdCategory.toObject({ getters: true }) });
};

exports.getAllCategories = getAllCategories;
exports.createCategory = createCategory;
