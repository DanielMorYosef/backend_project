import mongoose, { Schema } from "mongoose";

const schema = new Schema({
  firstName: String,
  lastName: String,
  phone: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  isBusiness: {
    type: Boolean,
    default: false,
  },
  address: {
    state: String,
    country: String,
    city: String,
    street: String,
    houseNumber: String,
  },
  isBusiness: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
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

export const User = mongoose.model("users", schema);
