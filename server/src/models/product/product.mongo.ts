import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: String,
  handle: String,
  price: Number,
  type: String,
  gender: String,
  material: String,
  silhouette: String,
  bestFor: [String],
  sizes: [String],
  free_shipping: Boolean,
  highlights: [String],
  dropdown: [
    {
      title: String,
      content: String,
    },
  ],
  recommendations: [
    {
      name: String,
      image: String,
    },
  ],
  material_features: [
    {
      image: String,
      text: {
        h4: String,
        h2: String,
        p: String,
      },
    },
  ],
  editions: [
    {
      edition: String,
      products: [
        {
          id: Number,
          handle: String,
          colorName: String,
          colors: [String],
          hues: [String],
          images: [String],
          salePrice: Number,
          sizesSoldOut: [String],
        },
      ],
    },
  ],
  reviews: {
    count: Number,
    rating: Number,
    reviews: [
      {
        score: Number,
        title: String,
        content: String,
        username: String,
        verifiedBuyer: Boolean,
        createdAt: String,
        custom_fields: [
          {
            title: String,
            value: String,
          },
        ],
      },
    ],
  },
});

const Product = mongoose.model('Product', productSchema);

export default Product;
