const { Router } = require("express");
const CollaboratorsController = require("../controllers/CollaboratorsController");
const {adminPermission} = require("../middlwares/AuthMiddlware");
const upload = require("../middlwares/UploadFile");
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
    adminPermission,
    upload.single("logo"),
    collaboratorsController.create.bind(collaboratorsController)
);
router.put(
    "/",
    adminPermission,
    upload.single("logo"),
    collaboratorsController.update.bind(collaboratorsController)
);

router.delete(
    "/:id",
    adminPermission,
    collaboratorsController.delete.bind(collaboratorsController)
);

module.exports = router;
