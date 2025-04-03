const Customer = require("../model/customer");
const Supplier = require("../model/supplier");
const Chemical = require("../model/chemical");
const Inquiry = require("../model/inquiry")
const getDataCount = async (req, res) => {
  try {
    // Count the number of documents in each collection
    const customerCount = await Customer.countDocuments({});
    const supplierCount = await Supplier.countDocuments({});
    const chemicalCount = await Chemical.countDocuments({});
    const inquiryCount = await Inquiry.countDocuments({})
    // Return the counts in a structured response
    return res.status(200).json({
      customerCount,
      supplierCount,
      chemicalCount,
      inquiryCount
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error counting data", error: error.message });
  }
};

module.exports = {
  getDataCount,
};
