const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

if (process.env.MONGOOSE_DEBUG === "TRUE") {
  mongoose.set("debug", true);
}

const taskSchema = mongoose.Schema(
  {
    schema: { type: String },
    taskid: { type: String, required: true, unique: true },
    owner: { type: String, required: true },
    activityid: { type: String, required: true },
    state: { type: String, required: true, enum: [ 'tothink', 'todo', 'wip', 'block', 'done'] },
    description: { type: String }
  },
  { strict: true },
);

taskSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Task", taskSchema);
