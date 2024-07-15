const mongoose = require("mongoose");

const teamsSchema = new mongoose.Schema(
  {
    name: String,
    phoneNumber: String,
    email: String,
    website: Boolean,
    banner: Boolean,
    chat: Boolean,
    coupon: Boolean,
    team: Boolean,
    user: Boolean,
    freeMaterial: Boolean,
    campaign: Boolean,
    course: Boolean,
    selfService: Boolean,
  },
  {
    timestamps: true,
  }
);

const TeamMembers = mongoose.model("TeamMembers", teamsSchema);
module.exports = TeamMembers;
