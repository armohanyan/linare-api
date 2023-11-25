const { Router } = require("express");
const ContactsController = require("../controllers/ContactsController.js");
const contactsController = new ContactsController();

const router = Router();

router.get(
    "/",
    contactsController.show.bind(contactsController)
);
router.get(
    "/:id",
    contactsController.show.bind(contactsController)
);
router.post(
    "/",
    contactsController.create.bind(contactsController)
);
router.put(
    "/",
    contactsController.update.bind(contactsController)
);


module.exports = router;
