const upload = require("../middlwares/UploadFile");
const { Router } = require("express");
const {adminPermission} = require("../middlwares/AuthMiddlware");
const NewsController = require("../controllers/NewsController");
const newsController = new NewsController();
const router = Router();

router.post("/", adminPermission, upload.single("image"), newsController.createNews.bind(newsController));
router.get("/", newsController.getNews.bind(newsController));
router.get("/news-feed", newsController.getNewsFeed.bind(newsController));
router.delete('/:id', adminPermission, newsController.deleteNews.bind(newsController))
router.put('/:id', upload.single("image"), newsController.editNews.bind(newsController)) //adminPermission
router.get('/:id', newsController.getSingleNews.bind(newsController))
router.get('/filter/search', newsController.searchNews.bind(newsController))
router.get('/filter/more-readable', newsController.moreReadableNews.bind(newsController))
module.exports = router;
