const { Router } = require("express");
const CollaboratorsController = require("../controllers/CollaboratorsController");
const collaboratorsController = new CollaboratorsController();

const router = Router();


router.get(
    "/",
    collaboratorsController.showAll.bind(collaboratorsController)
);

router.get(
    "/:id",
    collaboratorsController.show.bind(collaboratorsController)
);
router.post(
    "/",
    collaboratorsController.create.bind(collaboratorsController)
);
router.put(
    "/",
    collaboratorsController.update.bind(collaboratorsController)
);

router.delete(
    "/:id",
    collaboratorsController.delete.bind(collaboratorsController)
);

module.exports = router;
