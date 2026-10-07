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
      default: [],
      validate: {
        validator: function(v) {
          return !v || v.length <= 10;
        },
        message: "A product can have a maximum of 10 images."
      }
    },
    imageUrl: {
      type: String,
      default: "",
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
      index: true,
    },
  },
  { timestamps: true }
);

// Pre-save hook to sync imageUrl with the first element of images array
productSchema.pre("save", function() {
  if (this.images && this.images.length > 0 && !this.imageUrl) {
    this.imageUrl = this.images[0];
  } else if ((!this.images || this.images.length === 0) && this.imageUrl) {
    this.images = [this.imageUrl];
  }
});

// Pre-findOneAndUpdate hook to sync imageUrl
productSchema.pre("findOneAndUpdate", function() {
  const update = this.getUpdate();
  if (update) {
    if (update.images && update.images.length > 0 && !update.imageUrl) {
      update.imageUrl = update.images[0];
    } else if ((!update.images || update.images.length === 0) && update.imageUrl) {
      update.images = [update.imageUrl];
    }
  }
});

module.exports = mongoose.model("Product", productSchema);
