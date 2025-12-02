const express = require("express");
const router = express.Router();
const schedulesController = require("../controllers/schedulesController");

router.get("/", schedulesController.getAllSchedules);
router.get("/:id", schedulesController.getSchedule);
router.post("/", schedulesController.createSchedule);
router.put("/:id", schedulesController.updateSchedule);
router.delete("/:id", schedulesController.deleteSchedule);

module.exports = router;