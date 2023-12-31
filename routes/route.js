const express = require("express");
const router = express.Router();
const controller = require("../controllers/controller");
const notifService = require("../services/notif-service");

router.get("/lock/:lockid/acl", controller.getACLByLockId);
router.patch("/lock/:lockid/acl/add", controller.addACLUserByLockId);
router.patch(
  "/lock/:lockid/acl/delete/:name",
  controller.deleteACLUserByLockId
);
router.patch("/lock/:lockid/siren", controller.disableSiren);

router.get("/logs/:lockid", controller.getLogs);
router.get("/lock/:lockid/systemSecurity", controller.getSystemSecurity);
router.patch("/lock/:lockid/systemSecurity", controller.toggleSystemSecurity);

router.post("/registerPushToken", notifService.registerPushToken);

router.get("/health", controller.healthCheck);

module.exports = router;
