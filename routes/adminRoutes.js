// controllers

const { Router } = require("express");
const AdminController = require("../controllers/AdminController");
const {adminPermission} = require("../middlwares/AuthMiddlware");
const adminController = new AdminController();


const router = Router();

router.get(
    "/statics",
    adminPermission,
    adminController.statics.bind(adminController)
)

module.exports = router;
