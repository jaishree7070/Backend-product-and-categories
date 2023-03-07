const express = require("express"); //importing express in an object
const bodyParser = require("body-parser"); //to parse the body of the incomming request
const mongoose = require("mongoose");

const HttpError = require("./models/http-error");
const productRoutes = require("./routes/products-routes");
const categoriesRoutes = require("./routes/categories-routes");


const app = express(); //an app object to execute express as a function

//Registering Middlewares

app.use(bodyParser.json());

//Outsourcing routes to the products-routes with a filter of /api/products
app.use("/api/products", productRoutes);
app.use("/api/categories", categoriesRoutes);

//A middleware that will be executed if we didnt get any matching  routes
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  throw error;
});

//An Error handling middleware function
app.use((error, req, res, next) => {
  if (res.HeaderSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured" });
});

 mongoose.connect("mongodb+srv://rj:WePDKI6oWNzdwPZL@assignment.khczdj9.mongodb.net/Table").then(app.listen(5000)).catch(error=>console.log(error+"errroiertjhoiejn"));//To listen to a certain port


// {
//   "productName":"Xyz",
//   "qtyPerUnit":20,
//   "unitPrice":1,
//   "unitInStock":12,
//   "discontinued":true,
//   "categoryId":1
// }