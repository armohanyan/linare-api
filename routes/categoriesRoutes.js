const upload = require("../middlwares/UploadFile");
const { Router } = require("express");
const {adminPermission} = require("../middlwares/AuthMiddlware");
const CategoriesController = require("../controllers/CategoriesController");
const categoriesController = new CategoriesController();
const router = Router();

router.get("/", categoriesController.get.bind(categoriesController))
router.post("/", adminPermission, categoriesController.create.bind(categoriesController));
router.delete('/:id', adminPermission, categoriesController.delete.bind(categoriesController))
router.put('/:id', adminPermission, categoriesController.update.bind(categoriesController)) //adminPermission
router.get('/:id', categoriesController.getSingle.bind(categoriesController))
// router.get("/news-feed", newsController.getNewsFeed.bind(newsController));
// router.get('/filter/search', newsController.searchNews.bind(newsController))
// router.get('/filter/more-readable', newsController.moreReadableNews.bind(newsController))
module.exports = router;
