const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema;

const categorySchema = new Schema({
  categoryName: { type: String, required: true},
  products:[{ type: mongoose.Types.ObjectId, required: true, ref: "Product" }],
});

module.exports=mongoose.model('Category',categorySchema);
