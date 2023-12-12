const { Router } = require("express");
const TestimonialsController = require("../controllers/TestimonialsController");
const {adminPermission} = require("../middlwares/AuthMiddlware");
const upload = require("../middlwares/UploadFile");
const testimonialsController = new TestimonialsController();

const router = Router();

router.get(
    "/",
    testimonialsController.showAll.bind(testimonialsController)
);

router.get(
  "/:id",
    testimonialsController.show.bind(testimonialsController)
);
router.post(
    "/",
    adminPermission,
    upload.single("avatar"),
    testimonialsController.create.bind(testimonialsController)
);
router.put(
    "/",
    adminPermission,
    upload.single("avatar"),
    testimonialsController.update.bind(testimonialsController)
);

router.delete(
    "/:id",
    adminPermission,
    testimonialsController.delete.bind(testimonialsController)
);


module.exports = router;
