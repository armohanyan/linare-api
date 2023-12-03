// controllers

const { Router } = require("express");
const AdminController = require("../controllers/AdminController");
const adminController = new AdminController();

const router = Router();

router.get(
    "/statics",
    adminController.statics.bind(adminController)
)


module.exports = router;
