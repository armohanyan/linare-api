const { Router } = require("express");
const TestimonialsController = require("../controllers/TestimonialsController");
const testimonialsController = new TestimonialsController();

const router = Router();

router.get(
    "/",
    testimonialsController.show.bind(testimonialsController)
);

router.get(
  "/:id",
    testimonialsController.show.bind(testimonialsController)
);
router.post(
    "/",
    testimonialsController.create.bind(testimonialsController)
);
router.put(
    "/",
    testimonialsController.update.bind(testimonialsController)
);

router.delete(
    "/",
    testimonialsController.delete.bind(testimonialsController)
);


module.exports = router;
