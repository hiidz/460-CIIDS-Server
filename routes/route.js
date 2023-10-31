const express = require("express");
const router = express.Router();
const controller = require("../controllers/controller");

router.get("/lock/:lockid/acl", controller.getACLByLockId);
router.patch("/lock/:lockid/acl/add", controller.addACLUserByLockId);
router.patch("/lock/:lockid/acl/delete/:name", controller.deleteACLUserByLockId);

// router.patch("/user/following/:username/add", userController.addFollowing);

router.get("/logs/:lockid", controller.getLogs)

module.exports = router;
