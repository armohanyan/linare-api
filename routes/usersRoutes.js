// controllers

const { Router } = require("express");
const UsersController = require("../controllers/UsersController");
const SignUpValidation = require("../common/validation/SignUpValidation");
const {adminPermission} = require("../middlwares/AuthMiddlware");
const usersController = new UsersController();


const router = Router();

router.put(
    "/",
    SignUpValidation,
    usersController.update.bind(usersController)
)

router.post(
    "/",
    SignUpValidation,
    usersController.create.bind(usersController)
)

router.get(
    "/",
    usersController.getAll.bind(usersController)
)

router.get(
    "/:id",
    usersController.getSingle.bind(usersController)
)

router.delete(
    "/:id",
    usersController.delete.bind(usersController)
)

module.exports = router;
