const Inquiry = require("../model/inquiry");
const ChemicalCategory = require("../model/chemicalCategory");
const PetrochemProduct = require("../model/petrochemProduct");
const Brand = require("../model/brands");

const getDataCount = async (req, res) => {
  try {
    // Count the number of documents in each collection
    const inquiryCount = await Inquiry.countDocuments({});
    const categoryCount = await ChemicalCategory.countDocuments({});
    const productCount = await PetrochemProduct.countDocuments({});
    const brandCount = await Brand.countDocuments({});

    // Return the counts in a structured response
    return res.status(200).json({
      inquiryCount,
      categoryCount,
      productCount,
      brandCount
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error counting data", error: error.message });
  }
};

module.exports = {
  getDataCount,
};
