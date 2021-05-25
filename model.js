const mongoose = require("mongoose");
const {Schema} = mongoose;

const likesSchema = new Schema({
  symbol: {type: String, uppercase: true},
  likes: {type: Number, default: 0},
  ip: [String],
})

let Stock = mongoose.model("Stock", likesSchema)

exports.Stock = Stock;