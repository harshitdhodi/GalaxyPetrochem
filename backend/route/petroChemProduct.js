const express = require("express");
const router = express.Router();
const productController = require("../controller/petroChemProduct");
const upload = require("../middleware/chemicalImage");
// --- Routes ---
router.post("/addProduct",upload,productController.createProduct
);

router.get("/", productController.getAllProducts);
router.get("/brandId", productController.getProductsByBrandId);
router.get("/getAllProductImages", productController.getAllProductImages);
router.get("/getBySlug",  productController.getProductBySlug);
router.get("/getRecentProductsByCategorySlug", productController.getRecentProductsByCategorySlug);
router.get("/getAllSlugs", productController.getAllSlugs);
router.get("/filterProduct", productController.filterProducts);
router.get("/:id", productController.getProductById);
router.put("/:id",upload, productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
