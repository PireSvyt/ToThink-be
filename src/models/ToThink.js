const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const tothinkContract = require("../controllers/tothink/tothink.contracts.json")

if (process.env.MONGOOSE_DEBUG === "TRUE") {
  mongoose.set("debug", true);
}

const tothinkSchema = mongoose.Schema(
  {
    schema: { type: String },
    tothinkid: { type: String, required: true, unique: true },
    owner: { type: String, required: true },
    activityid: { type: String, required: true },
    state: { type: String, required: true, enum: tothinkContract.values.state },
    name: { type: String, required: true },
    description: { type: String },
    order: { type: Number },
    dueDate: { type: Date },
    recurring: { type: Boolean },
    recurrence: { type: Object },
    history: [ { date: Date, command: String, change: Object} ]
  },
  { strict: true },
);

tothinkSchema.plugin(uniqueValidator);

module.exports = mongoose.model("ToThink", tothinkSchema);
