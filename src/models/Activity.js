const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

if (process.env.MONGOOSE_DEBUG === "TRUE") {
  mongoose.set("debug", true);
}

const activitySchema = mongoose.Schema(
  {
    schema: { type: String },
    activityid: { type: String, required: true, unique: true },
    owner: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    order: { type: Number }
  },
  { strict: true },
);

activitySchema.plugin(uniqueValidator);

module.exports = mongoose.model("Activity", activitySchema);
