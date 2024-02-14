const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

if (process.env.MONGOOSE_DEBUG === "TRUE") {
  mongoose.set("debug", true);
}

const settingSchema = mongoose.Schema(
  {
    schema: { type: String },
    settingid: { type: String, required: true, unique: true },
    type: { type: String, required: true, enum: ['string'] },
    key: { type: String, required: true, unique: true },
    value: { type: String, required: true },
  },
  { strict: true },
);

settingSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Setting", settingSchema);
