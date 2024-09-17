import mongoose, { Schema } from "mongoose";

const AddressSchema = new Schema({
  state: String,
  country: String,
  city: String,
  street: String,
  houseNumber: Number,
  zip: String,
});

const ImageSchema = new Schema({
  url: String,
  alt: String,
});

const CardSchema = new Schema({
  title: String,
  subtitle: String,
  description: String,
  phone: String,
  email: String,
  address: AddressSchema,
  image: ImageSchema,
  web: String,
  likes: {
    type: [Schema.Types.ObjectId],
    default: [],
  },
  user_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Card = mongoose.model("Card", CardSchema);
