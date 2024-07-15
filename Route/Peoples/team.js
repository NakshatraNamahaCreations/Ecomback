const express = require("express");
const router = express.Router();
const TeamController = require("../../Controller/Peoples/team");

router.post("/addteammember", TeamController.addTeamMember);
router.get("/getteammember/:id", TeamController.getTeammember);
router.get("/getallteammembers", TeamController.getAllTeammember);
router.put("/updateteammember/:id", TeamController.updateMember);
router.delete("/deleteteammember/:id", TeamController.deleteTeammember);

module.exports = router;
