const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const { 
  getStateList
} = require("./tothink.services.js")

if (process.env.MONGOOSE_DEBUG === "TRUE") {
  mongoose.set("debug", true);
}

const tothinkSchema = mongoose.Schema(
  {
    schema: { type: String },
    tothinkid: { type: String, required: true, unique: true },
    owner: { type: String, required: true },
    activityid: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    order: { type: Number },
    reminders: [{
      reminderid: { type: String, required: true },
      dueDate: { type: Date, required: true },
      isActive: { type: Boolean, required: true },
      isRecurring: { type: Boolean, required: true },
      recurrence: { type: Object },
      endDate: { type: Date },
    }],
    todos: [{
      todoid: { type: String, required: true },
      date: { type: Date, required: true },
      state: { type: String, required: true },
      reminderid: { type: String, required: true }
    }]
  },
  { strict: true },
);

tothinkSchema.plugin(uniqueValidator);

module.exports = mongoose.model("ToThink", tothinkSchema);
