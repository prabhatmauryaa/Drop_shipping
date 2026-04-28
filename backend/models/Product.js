const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      default: 0,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    images: {
      type: [String],
      required: [true, "At least one image is required"],
      validate: {
        validator: function(v) {
          return v && v.length <= 5;
        },
        message: "A product can have a maximum of 5 images."
      }
    },
    imageUrl: {
      type: String,
      required: false,
    },
    sizes: {
      type: [String],
      default: [],
    },
    // Supplier who actually holds the inventory
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Seller who is listing the product
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Could be null if admin/supplier just creating base products
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "active", "draft", "out_of_stock"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Pre-save hook to sync imageUrl with the first element of images array
productSchema.pre("save", function() {
  if (this.images && this.images.length > 0) {
    this.imageUrl = this.images[0];
  }
});

// Pre-findOneAndUpdate hook to sync imageUrl
productSchema.pre("findOneAndUpdate", function() {
  const update = this.getUpdate();
  if (update && update.images && update.images.length > 0) {
    update.imageUrl = update.images[0];
  }
});

module.exports = mongoose.model("Product", productSchema);
