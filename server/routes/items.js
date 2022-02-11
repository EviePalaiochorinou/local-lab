const express = require("express")
const router = express.Router()
const Item = require("../models/item")

// ITEM ROUTES
router.get("/items", async (req, res) => {
  const items = await Item.find({});
  res.json(items);
});

router.post("/items", async (req, res) => {
  const item = new Item(req.body.item);
  await item.save();
  res.json(item);
});

router.get("/items/:id", async (req, res) => {
  const { id } = req.params;
  const item = await Item.findById(id);
  res.json(item);
});

router.put("/items/:id", async (req, res) => {
  const { id } = req.params;
  const item = await Item.findByIdAndUpdate(
    id,
    { ...req.body.item },
    { new: true }
  );
  res.json(item);
});

router.delete("/items/:id", async (req, res) => {
  const { id } = req.params;
  const item = await Item.findByIdAndDelete(id, { new: true });
  res.json(item);
});

// now use multer
const uploadMulter = require('../middleware/upload.js')
// validation
const validation = require('../middleware/validation.js');
const { ItemMeta } = require("semantic-ui-react");

router.post("/items/:id/images", uploadMulter, validation, async (req, res) => {
  const { id } = req.params;
  const item = await Item.findById(id)

  const { title } = req.body
  const { path } = req.file
  
  item.images.push({
    title,
    path
  })
  await item.save()
  res.json(item)
 
})

module.exports = router