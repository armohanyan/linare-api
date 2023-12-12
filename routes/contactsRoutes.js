const { Router } = require("express");
const ContactsController = require("../controllers/ContactsController.js");
const {adminPermission} = require("../middlwares/AuthMiddlware");
const contactsController = new ContactsController();

const router = Router();

router.get(
    "/",
    contactsController.show.bind(contactsController)
);

router.post(
    "/",
    adminPermission,
    contactsController.create.bind(contactsController)
);

router.put(
    "/",
    adminPermission,
    contactsController.update.bind(contactsController)
);

router.post(
    "/send-email",
    contactsController.customerSendEmail.bind(contactsController)
);


module.exports = router;
