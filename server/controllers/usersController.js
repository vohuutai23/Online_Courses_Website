import User from "../models/UserModel.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config.js";
import nodemailer from "nodemailer";
import cloudinary from "../utils/cloudinary.js";
import { createCartForUser } from "./cartsController.js";
import Cart from "../models/CartModel.js";
import Role from "../models/RoleEnum.js";
import OTP from "otp-generator";

//***********************************************CREATE TOKEN************************** */
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "10d" });
};

//***********************************************GET USER************************** */
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      return res.status(200).json({ user });
    } else {
      return res.status(400).json({ error: "User not found!" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//***********************************************REGISTER USER************************** */
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    res
      .status(400)
      .json({ error: "Email already exists, please select another email!" });
  } else {
    try {
      const salt = await bcrypt.genSalt();
      const hashed = await bcrypt.hash(password, salt);

      //generate otp
      const otp = OTP.generate(6, {
        digit: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      var mailOptions = {
        from: `COOKIEDU 🍪​" <${process.env.EMAIL_USER}>`,
        to: `${email}`,
        subject: "Your OTP to verify your email",
        html: `
        <h1>Hello ${name}!</h1>
        <p>Thank you for registering with COOKIEDU! To verify your email address, please use the OTP code below:</p>
        <h2>OTP: ${otp}</h2>
        <p>This OTP is valid for 5 minutes. If you did not request this verification, please ignore this email.</p>
        <p>Best regards,<br>COOKIEDU Team</p>
      `,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return res.status(500).json({ error: error.message });
        } else {
          return res.status(200).json({ success: "Email sent!" });
        }
      });
      const user = await User.create({ email, password: hashed, name, otp });
      const cart = await createCartForUser(user._id);
      res.status(200).json({ success: "Register successful!" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

//***********************************************CHECK EMAIL AND OTP USER************************** */

const checkEmailOTPUser = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (otp == user.otp) {
    await user.updateOne({ status: true });
    return res.status(200).json({ success: "Email is verified!" });
  } else {
    return res
      .status(400)
      .json({ error: "OTP is incorrect! Please try again!" });
  }
};

//***********************************************REGISTER INSTRUCTOR************************** */
const registerInstructor = async (req, res) => {
  const { name, email, password } = req.body;
  const userAuth = await User.findById(req.user._id);
  if (userAuth.role != "ADMIN") {
    return res.status(401).json({ error: "Not authorized" });
  }

  if (!email || !password || !name) {
    res.status(400).json({ error: "All fields are required!" });
  }

  const user = await User.findOne({ email });

  if (user) {
    res.status(400).json({ error: "Email already existed!" });
  } else {
    try {
      //hash password
      const salt = await bcrypt.genSalt();
      const hashed = await bcrypt.hash(password, salt);

      const user = await User.create({
        email,
        password: hashed,
        name,
        role: Role.INSTRUCTOR,
      });
      const cart = await createCartForUser(user._id);
      const token = await createToken(user._id);
      res.status(200).json({ success: "Register successful!", user, token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

//***********************************************LOGIN USER SOCIAL************************** */

const loginUserSocial = async (req, res) => {
  if (req.user) {
    const user = await User.findById(req.user._id);
    const token = createToken(user._id);
    res.status(200).json({
      success: true,
      message: "successfull",
      user: user,
      token,
      role: user.role,
      //   cookies: req.cookies
    });
  }
};

//***********************************************LOGIN USER************************** */
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  //check email, password fields
  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  //check email exist in DB
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ error: "Incorrect email!" });
  } else {
    if (user.status == false) {
      return res.status(400).json({ error: "Account is blocked!" });
    } else {
      const token = createToken(user._id);
      //encrypt hash password
      // check password
      const match = await bcrypt.compare(password, user.password);
      let cart = await Cart.findOne({ userId: user._id });

      // const passwordCheck = await User.findOne({compare})
      if (!match) {
        return res.status(400).json({ error: "Password is incorrect!" });
      }

      try {
        return res
          .status(200)
          .json({ email, token, role: user.role, cartId: cart._id });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }
  }
};

//***********************************************FORGOT PASSWORD************************** */
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  //check email, password fields
  if (!email) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  //check email exist in DB
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(500).json({ error: "Incorrect email!" });
  } else {
    try {
      const token = jwt.sign({ _id: user._id }, `${process.env.SECRET}`, {
        expiresIn: "1d",
      });

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      var mailOptions = {
        from: `COOKIEDU 🍪​" <${process.env.EMAIL_USER}>`, // email that send
        to: `${email}`,
        subject: "Reset Your Password",
        html: `
          <p>Hello,</p>
          <p>You have requested to reset your password. Please click on the button below to reset your password:</p>
          <button style="background-color: #4CAF50; border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; border-radius: 4px;">
            <a href="http://localhost:3000/reset-password/${user._id}/${token}" style="color: white; text-decoration: none;">Reset Password</a>
          </button>
          <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
          <p>Best regards,<br>COOKIEDU Team</p>
        `,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return res.status(500).json({ error: error.message });
        } else {
          return res.status(200).json({ success: "Email sent!" });
        }
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
};

//***********************************************RESET PASSWORD************************** */

const resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  jwt.verify(token, `${process.env.SECRET}`, async (err, decoded) => {
    if (err || decoded._id !== id) {
      return res.json({ error: "Invalid token!" });
    } else {
      bcrypt
        .hash(password, 10)
        .then((hash) => {
          User.findByIdAndUpdate({ _id: id }, { password: hash })
            .then((result) =>
              res.send({ Status: "Password reset successfully!" })
            )
            .catch((error) => res.json({ Status: error }));
        })
        .catch((error) => res.json({ Status: error }));
    }
  });
};

//***********************************************UPLOAD PROFILE IMAGE************************** */

const updateProfileInformation = async (req, res) => {
  const { name, picture, phone } = req.body;
  console.log(name, req.file, phone);
  const userId = req.user._id;
  const user = await User.findById(userId);

  try {
    if (req.file && user.cloudinary) {
      await cloudinary.uploader.destroy(user.cloudinary);
      const uploadResponse = await new Promise((resolve, reject) => {
        const bufferData = req.file.buffer;
        cloudinary.uploader
          .upload_stream({ resource_type: "image" }, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          })
          .end(bufferData);
      });
      await user.updateOne({
        picture: uploadResponse.secure_url,
        cloudinary: uploadResponse.public_id,
      });
    } else if (req.file && !user.cloudinary) {
      const uploadResponse = await new Promise((resolve, reject) => {
        const bufferData = req.file.buffer;
        cloudinary.uploader
          .upload_stream({ resource_type: "image" }, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          })
          .end(bufferData);
      });
      await user.updateOne({
        picture: uploadResponse.secure_url,
        cloudinary: uploadResponse.public_id,
      });
    }
    await user.updateOne({
      name: name,
      phone: phone,
    });
    console.log("Success: Profile updated successfully");
    return res.status(200).json({ success: "Profile updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// //***********************************************UPLOAD PROFILE IMAGE************************** */

const changePassword = async (req, res) => {
  const { password, new_password } = req.body;
  const userId = req.user._id;
  const user = await User.findById(userId);
  try {
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: "Current password is incorrect!" });
    } else {
      try {
        const salt = await bcrypt.genSalt();
        const hashed = await bcrypt.hash(new_password, salt);
        await user.updateOne({ password: hashed });
        return res
          .status(200)
          .json({ success: "Password updated successfully" });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// //***********************************************UPLOAD PROFILE IMAGE************************** */

// const upLoadProfileImage = async (req, res) => {
//   const { base64 } = req.body;
//   const userId = req.user._id;
//   console.log(userId);
//   console.log("Link:", base64);
//   try {
//     await User.findByIdAndUpdate({ _id: userId }, { picture: base64 });
//     return res.status(200).json({ success: "Successful" });
//   } catch (error) {
//     return res.status(500).json({ error: "Error" });
//   }
// };

//***********************************************GET ALL USER BY ROLE************************** */
const getUserListByRole = async (req, res) => {
  try {
    const role = req.params.role;

    const users = await User.find({ role });

    if (users.length == 0) {
      return res.status(400).json({ error: "Don't have any user!" });
    }

    const userAuth = await User.findById(req.user._id);
    if (!(userAuth.role == "ADMIN") || role == "ADMIN") {
      return res.status(401).json({ error: "Not authorized" });
    }

    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//***********************************************Change status USER************************* */
const changeUserStatus = async (req, res) => {
 
  const user = await User.findById(req.params.id);
  const userAuth = await User.findById(req.user._id);
  if (!(userAuth.role == "ADMIN") || user.role == "ADMIN") {
    return res.status(401).json({ error: "Not authorized" });
  }

  try {
    await user.updateOne({ status: !user.status });
    return res.status(200).json({
      success: "User status Was Updated",
      status: user.status,
      user,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//***********************************************Get USER by Another one************************* */
const getUserByOther = async (req, res) => {
  const user = await User.findById(req.params.id);
  try {
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export {
  registerUser,
  registerInstructor,
  checkEmailOTPUser,
  loginUserSocial,
  loginUser,
  forgotPassword,
  resetPassword,
  updateProfileInformation,
  changePassword,
  getUser,
  getUserListByRole,
  changeUserStatus,
  getUserByOther,
};
