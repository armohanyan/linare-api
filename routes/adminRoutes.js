// controllers

const { Router } = require("express");
const AdminController = require("../controllers/AdminController");
const adminController = new AdminController();


const router = Router();

router.get(
    "/statics",
    adminController.statics.bind(adminController)
)

router.put(
    "/",
    adminController.update.bind(adminController)
)

router.get(
    "/",
    adminController.getAll.bind(adminController)
)

router.delete(
    "/:id",
    adminController.delete.bind(adminController)
)

module.exports = router;
