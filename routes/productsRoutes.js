const upload = require("../middlwares/UploadFile");
const { Router } = require("express");
const {adminPermission} = require("../middlwares/AuthMiddlware");
const ProductsController = require("../controllers/ProductsController");
const productsController = new ProductsController();
const router = Router();

router.get("/", productsController.get.bind(productsController))
router.post("/", adminPermission, upload.array("images"), productsController.create.bind(productsController));
router.delete('/:id', adminPermission, productsController.delete.bind(productsController))
router.put('/:id', adminPermission, upload.array("images"), productsController.update.bind(productsController)) //adminPermission
router.get('/:id', productsController.getSingle.bind(productsController))
module.exports = router;
