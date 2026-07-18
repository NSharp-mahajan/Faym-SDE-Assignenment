const express = require("express");
const router = express.Router();

const {
    createSale,
    getSales,
    getSale,
    reconcileSale
} = require("../controllers/saleController");

const { createSaleValidator, reconcileSaleValidator } = require('../validators/saleValidator');
const validate = require('../middleware/validate');

router.post("/", createSaleValidator, validate, createSale);
router.get("/", getSales);
router.get("/:id", getSale);
router.patch("/:id/reconcile", reconcileSaleValidator, validate, reconcileSale);

module.exports = router;
