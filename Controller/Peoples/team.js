const TeamMembers = require("../../Model/Peoples/team");

class Team {
  async addTeamMember(req, res) {
    try {
      const {
        name,
        phoneNumber,
        email,
        website,
        banner,
        chat,
        coupon,
        team,
        user,
        freeMaterial,
        campaign,
        course,
        selfService,
      } = req.body;
      const newTeamMember = new TeamMembers({
        name,
        phoneNumber,
        email,
        website,
        banner,
        chat,
        coupon,
        team,
        user,
        freeMaterial,
        campaign,
        course,
        selfService,
      });
      await newTeamMember.save();
      res.status(200).json({
        status: true,
        success: "Team Member Added",
        data: newTeamMember,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async getTeammember(req, res) {
    try {
      const teamMembers = await TeamMembers.findOne({ _id: req.params.id });
      if (teamMembers) {
        return res.status(200).json({
          status: true,
          data: teamMembers,
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Internal Server Error",
        error,
      });
    }
  }
  async getAllTeammember(req, res) {
    try {
      const allmembers = (await TeamMembers.find()).reverse(true);
      if (allmembers.length > 0) {
        return res.status(200).json({
          status: true,
          data: allmembers,
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Internal Server Error",
        error,
      });
    }
  }

  async updateMember(req, res) {
    try {
      const teamMemberId = req.params.id;
      const {
        name,
        phoneNumber,
        email,
        website,
        banner,
        chat,
        coupon,
        team,
        user,
        freeMaterial,
        campaign,
        course,
        selfService,
      } = req.body;

      let teamMember = await TeamMembers.findOne({ _id: teamMemberId });
      if (!teamMember) {
        return res.status(404).json({
          status: 404,
          error: "Id not found",
        });
      }

      await TeamMembers.findOneAndUpdate(
        { _id: teamMemberId },
        {
          name,
          phoneNumber,
          email,
          website,
          banner,
          chat,
          coupon,
          team,
          user,
          freeMaterial,
          campaign,
          course,
          selfService,
        },
        {
          new: true,
        }
      );
      console.log("teamMember", teamMember);
      res.status(200).json({
        status: true,
        success: "Updated",
        data: teamMember,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteTeammember(req, res) {
    try {
      const _id = req.params.id;
      const member = await TeamMembers.findByIdAndDelete(_id);
      if (!member) {
        return res
          .status(404)
          .json({ status: false, message: "Member not found" });
      }
      return res
        .status(200)
        .send({ status: true, success: "Member deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

const TeamController = new Team();
module.exports = TeamController;
