const MenuListing = require('../model/menuListing');

// Create a new menu listing
exports.createMenuListing = async (req, res) => {
  try {
    const { parent, children } = req.body;

    // ✅ CASE 1: Children exist → Check ONLY child uniqueness
    if (children && children.length > 0) {
      
      // Check duplicates within current request
      const childNames = children.map(c => c.name.trim().toLowerCase());
      if (childNames.length !== new Set(childNames).size) {
        return res.status(400).json({
          success: false,
          message: 'Duplicate child names in current request'
        });
      }

      // If parent._id exists, check child under THAT parent
      if (parent._id) {
        const existingParent = await MenuListing.findOne({
          'parent._id': parent._id,
          'children.name': { 
            $in: children.map(c => c.name.trim()) 
          }
        });

        if (existingParent) {
          return res.status(400).json({
            success: false,
            message: 'Child menu already exists under this parent'
          });
        }
      } 
      // 🆕 NEW PARENT with children - check by parent name/path + child name
      else {
        const existingMenu = await MenuListing.findOne({
          $or: [
            { 'parent.name': parent.name.trim() },
            { 'parent.path': parent.path.trim() }
          ],
          'children.name': { 
            $in: children.map(c => c.name.trim()) 
          }
        });

        if (existingMenu) {
          return res.status(400).json({
            success: false,
            message: 'Child menu already exists under this parent'
          });
        }
      }
    } 
    // ✅ CASE 2: Only parent (no children) → Check parent uniqueness
    else if (!children || children.length === 0) {
      const existingMenu = await MenuListing.findOne({
        $or: [
          { 'parent.name': parent.name.trim() },
          { 'parent.path': parent.path.trim() }
        ]
      });

      if (existingMenu) {
        return res.status(400).json({
          success: false,
          message: 'Parent menu already exists'
        });
      }
    }

    const newMenuListing = new MenuListing({ parent, children });
    await newMenuListing.save();

    res.status(201).json({ success: true, data: newMenuListing });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all menu listings
exports.getAllMenuListings = async (req, res) => {
    try {
        const menuListings = await MenuListing.find();
        res.status(200).json({ success: true, data: menuListings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get a single menu listing by ID
exports.getMenuListingById = async (req, res) => {
    try {
        const { id } = req.params;

        // Search for the menu listing where the _id matches the requested id
        let menuListing = await MenuListing.findById(id);
        if (menuListing) {
            return res.status(200).json({ success: true, data: menuListing });
        }

        // Search for the child or subchild inside all menu listings
        menuListing = await MenuListing.findOne({
            $or: [
                { "children._id": id },  // Search in children array
                { "children.subChildren._id": id }  // Search in subChildren array
            ]
        });

        if (!menuListing) {
            return res.status(404).json({ success: false, message: "Menu listing not found" });
        }

        // Find the specific child or subchild within the menu listing
        let foundItem = null;
        menuListing.children.forEach((child) => {
            if (child._id.toString() === id) {
                foundItem = child;
            }
            child.subChildren.forEach((subChild) => {
                if (subChild._id.toString() === id) {
                    foundItem = subChild;
                }
            });
        });

        if (!foundItem) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }

        res.status(200).json({ success: true, data: foundItem });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// Update a menu listing by ID
exports.updateMenuListing = async (req, res) => {
  try {
    const { id } = req.params;
    const { parent, children } = req.body;

    // ✅ CASE 1: Children exist → Check ONLY child uniqueness
    if (children && children.length > 0) {
      
      // Check duplicates within current request
      const childNames = children.map(c => c.name.trim().toLowerCase());
      if (childNames.length !== new Set(childNames).size) {
        return res.status(400).json({
          success: false,
          message: 'Duplicate child names in current request'
        });
      }

      // If parent._id exists, check child under THAT parent (excluding current document)
      if (parent._id) {
        const existingParent = await MenuListing.findOne({
          _id: { $ne: id }, // Exclude current document being updated
          'parent._id': parent._id,
          'children.name': { 
            $in: children.map(c => c.name.trim()) 
          }
        });

        if (existingParent) {
          return res.status(400).json({
            success: false,
            message: 'Child menu already exists under this parent'
          });
        }
      } 
      // Check by parent name/path + child name (excluding current document)
      else {
        const existingMenu = await MenuListing.findOne({
          _id: { $ne: id }, // Exclude current document being updated
          $or: [
            { 'parent.name': parent.name.trim() },
            { 'parent.path': parent.path.trim() }
          ],
          'children.name': { 
            $in: children.map(c => c.name.trim()) 
          }
        });

        if (existingMenu) {
          return res.status(400).json({
            success: false,
            message: 'Child menu already exists under this parent'
          });
        }
      }
    } 
    // ✅ CASE 2: Only parent (no children) → Check parent uniqueness
    else if (!children || children.length === 0) {
      const existingMenu = await MenuListing.findOne({
        _id: { $ne: id }, // Exclude current document being updated
        $or: [
          { 'parent.name': parent.name.trim() },
          { 'parent.path': parent.path.trim() }
        ]
      });

      if (existingMenu) {
        return res.status(400).json({
          success: false,
          message: 'Parent menu already exists'
        });
      }
    }

    const updatedMenu = await MenuListing.findByIdAndUpdate(
      id,
      { parent, children },
      { new: true, runValidators: true }
    );

    if (!updatedMenu) {
      return res.status(404).json({
        success: false,
        message: 'Menu listing not found'
      });
    }

    res.status(200).json({ success: true, data: updatedMenu });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a menu listing by ID
exports.deleteMenuListing = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the document exists
        const menu = await MenuListing.findOne({
            $or: [
                { _id: id }, // Check if it's a parent
                { "children._id": id }, // Check if it's a child
                { "children.subChildren._id": id }, // Check if it's a sub-child
            ],
        });

        if (!menu) {
            return res.status(404).json({ success: false, message: "Menu listing not found" });
        }

        // If the ID matches the parent, delete the entire menu
        if (menu._id.toString() === id) {
            await MenuListing.findByIdAndDelete(id);
            return res.status(200).json({ success: true, message: "Parent menu deleted successfully" });
        }

        // If the ID matches a child, remove it from the children array
        menu.children = menu.children.filter(child => child._id.toString() !== id);

        // If the ID matches a sub-child, remove it from the subChildren array
        menu.children.forEach(child => {
            child.subChildren = child.subChildren.filter(subChild => subChild._id.toString() !== id);
        });

        // Save the updated menu
        await menu.save();

        res.status(200).json({ success: true, message: "Menu item deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};