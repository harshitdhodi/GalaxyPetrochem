const express = require("express");
const router = express.Router();
const productController = require("../controller/product");
const upload = require("../middleware/chemicalImage");

// Create a new product
router.post("/create", upload, productController.createProduct);

// Get all products
router.get("/", productController.getAllProducts);
router.get("/getRecentProducts/:categorySlug", productController.getRecentProductsByCategorySlug);
router.get("/getRecentProduct", productController.getRecentProducts);
router.get("/filterProduct", productController.filterProducts);
router.get("/advanceSearch", productController.AdvanceSearch);
// Get a single product by ID
router.get("/:id", productController.getProductById);

// Update a product by ID
router.put("/:id", upload, productController.updateProduct);

// Delete a product by ID
router.delete("/:id", productController.deleteProduct);

// Get product by categorySlug
router.get("/getByCategorySlug/:categorySlug",productController.getProductsByCategorySlug )

router.get("/getbySlug/:productSlug", productController.getProductBySlug);
module.exports = router;