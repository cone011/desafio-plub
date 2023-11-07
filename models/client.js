const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const clientSchema = new Schema({
  name: { type: String, require: true },
  email: { type: String, require: true },
  phone: { type: String, require: true },
  address: { type: String, require: true },
  userId: { type: Schema.Types.ObjectId, ref: "user", require: true },
});

module.exports = mongoose.model("client", clientSchema);
