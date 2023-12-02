const upload = require("../middlwares/UploadFile");
const { Router } = require("express");
const {adminPermission} = require("../middlwares/AuthMiddlware");
const ProductsController = require("../controllers/ProductsController");
const productsController = new ProductsController();
const router = Router();

router.get("/", productsController.get.bind(productsController))
router.post("/", upload.single("image"), productsController.create.bind(productsController));
router.delete('/:id', productsController.delete.bind(productsController))
router.put('/:id', upload.single("image"), productsController.update.bind(productsController)) //adminPermission
router.get('/:id', productsController.getSingle.bind(productsController))
// router.get("/news-feed", newsController.getNewsFeed.bind(newsController));
// router.get('/filter/search', newsController.searchNews.bind(newsController))
// router.get('/filter/more-readable', newsController.moreReadableNews.bind(newsController))
module.exports = router;
