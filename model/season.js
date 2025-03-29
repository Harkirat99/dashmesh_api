const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugin");

const seasonSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
seasonSchema.plugin(toJSON);
seasonSchema.plugin(paginate);

/**
 * @typedef Season
 */
const Season = mongoose.model("Season", seasonSchema);

module.exports = Season;
