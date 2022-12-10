const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//UPDATE
exports.updateUser = async (req, res) => {
  if (req.params.id) {
    //hash new password
    if (req.body.user.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.user.password = await bcrypt.hash(req.body.user.password, salt);
    }
    try {
      //find a matching user and update their profile
      const updatedUser = await User.findOneAndUpdate( { "_id": req.params.id },
        {
          $set: req.body.user
        },
        { new: true }
      );
      return res
        .status(200)
        .json({ success: true, message: "updated", data: updatedUser });
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(401).json("You can update only your account!");
  }
};

//DELETE
exports.deleteUser = async (req, res) => {
  if (req.params.id) {
    try {
      //find a matching user
      const user = await User.findById(req.params.id);
      try {
        //delete their profile
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted...");
      } catch (err) {
        res.stautus(500).json(err);
      }
    } catch (err) {
      res.status(404).json("User not found!");
    }
  } else {
    res.status(401).json("You can delete only your account!");
  }
};

//GET USER
exports.getUser = async (req, res) => {
  try {
    //find a matching user
    const user = await User.findById(req.params.id);
    //render user profile except their password
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
};
