// controllers
const accountController = new AccountController();

const { Router } = require("express");
const AccountController = require("../controllers/AccountController");
const router = Router();

router.get(
  "/current",
  accountController.current.bind(accountController)
);

module.exports = router;
