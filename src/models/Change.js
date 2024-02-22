const mongoose = require("mongoose");

if (process.env.MONGOOSE_DEBUG === "TRUE") {
  mongoose.set("debug", true);
}

const changeSchema = mongoose.Schema(
  {
    schema: { type: String },
    changeid: { type: String, required: true, unique: true }, 
    itemid: { type: String, required: true }, 
    author: { type: String, required: true },
    date: { type: Date, required: true }, 
    command: { type: String, required: true },
    changes: { type: Object }
  },
  { strict: true },
);

module.exports = mongoose.model("Change", changeSchema);
