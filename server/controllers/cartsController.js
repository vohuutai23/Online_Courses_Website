import Cart from "../models/CartModel.js";
import mongoose from "mongoose";
import CartItem from "../models/CartItemModel.js";
import Course from "../models/CourseModel.js";

const createCartForUser = async (userId) => {
  try {
    const cart = await Cart.create({ userId });
    return cart;
  } catch (error) {
    throw new Error("Unable to create cart");
  }
};
const addToCart = async (req, res) => {
  const { cartId, courseId } = req.body;
  if (!cartId || !courseId) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const cartExists = await Cart.findById(cartId);
    console.log("Cart exists:", cartExists);

    const courseExists = await Course.findById(courseId);

    if (!cartExists || !courseExists) {
      return res.status(404).json({ error: "Cart or Course not found" });
    }

    const cartItem = await CartItem.create({
      cartId: cartId,
      courseId: courseId,
    });
    res
      .status(200)
      .json({ success: "Course added to cart successfully", cartItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeFromCart = async (req, res) => {
  const { cartId, courseId } = req.params;

  try {
    const result = await CartItem.findOneAndDelete({
      cartId: cartId,
      courseId: courseId,
    });

    if (result) {
      return res
        .status(200)
        .json({ message: "Course remove from cart successfully" });
    } else {
      return res.status(404).json({ error: "Cart Item not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {

      return res.status(404).json({ error: "Cart not found" });
    }
    const cartItems = await CartItem.find({ cartId: cart._id });
    return res.status(200).json({ cartItems });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const clearCart = async (req, res) => {
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ userId: userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    // Xóa tất cả các CartItems liên kết với cartId này
    const result = await CartItem.deleteMany({ cartId: cart._id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No items found in cart" });
    }

    res.status(200).json({ message: "All items removed from cart successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export { createCartForUser, addToCart, removeFromCart, getCart ,clearCart};
