const Sale = require('../models/Sale');
const SaleService = require('../services/SaleService');
const ReconciliationService = require('../services/ReconciliationService');

exports.createSale = async (req, res) => {
  try {
    const { userId, earnings } = req.body;
    
    const sale = await SaleService.createSale(userId, earnings);
    return res.status(201).json({ success: true, message: 'Sale created successfully', data: sale });
  } catch (error) {
    const status = error.message.includes('not found') ? 404 : 400;
    return res.status(status).json({ success: false, message: error.message });
  }
};

exports.getSales = async (req, res) => {
  try {
    const { status, userId } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (userId) filter.userId = userId;

    const sales = await Sale.find(filter);
    return res.status(200).json({ success: true, message: 'Sales retrieved successfully', data: sales });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ success: false, message: 'Sale not found' });
    }
    
    return res.status(200).json({ success: true, message: 'Sale retrieved successfully', data: sale });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.reconcileSale = async (req, res) => {
  try {
    const { status } = req.body;
    
    const sale = await ReconciliationService.reconcileSale(req.params.id, status);
    return res.status(200).json({ success: true, message: 'Sale reconciled successfully', data: sale });
  } catch (error) {
    let status = 400;
    if (error.message.includes('not found')) status = 404;
    else if (error.message.includes('already')) status = 409;
    
    return res.status(status).json({ success: false, message: error.message });
  }
};
