const express = require("express");
const router = new express.Router();
const Order = require("../Models/order");
const User = require("../Models/user");
const orderHelper = require("../helpers/orderHelper");
const emailSender = require("../helpers/emailSender");

router.post("/order/:id", async (req, res) => {
  const id = req.params.id;
  const items = req.body.orderedItems;
  const { user, totalPrice, points } = req.body;

  const userData = await User.findById(id);

  if (userData.points >= points) {
    const orderedItems = orderHelper(items);
    const order = new Order({
      orderedItems,
      user,
      totalPrice: totalPrice + 10,
    });

    try {
      await order.save();
      emailSender(user.email, "order", {
        orderedItems,
        totalPrice: totalPrice + 10,
        user,
      });
    } catch (error) {
      res.send({ error: error });
    }

    const updatedPoints = Math.floor(
      userData.points - points + totalPrice / 10
    );

    if (orderedItems.find((item) => item.name === "המבורגר יום הולדת")) {
      await User.findByIdAndUpdate(
        { _id: id },
        { points: updatedPoints, redeemed: true },
        function (err, result) {
          if (err) {
            return console.log(err);
          }
          res.send({ points: updatedPoints, redeemed: true });
        }
      );
    } else {
      await User.findByIdAndUpdate(
        { _id: id },
        { points: updatedPoints },
        function (err, result) {
          if (err) {
            return console.log(err);
          }
          res.send({ points: updatedPoints });
        }
      );
    }
  }
  res.send({ error: "You dont have enough points" });
});

router.post("/order", async (req, res) => {
  const { items, user, totalPrice } = req.body;
  const orderedItems = orderHelper(items);

  try {
    const order = new Order({
      orderedItems,
      user,
      totalPrice: totalPrice + 10,
    });
    await order.save();
    emailSender(user.email, "order", {
      orderedItems,
      totalPrice: totalPrice + 10,
      user,
    });
    res.status(200).send({
      success: "success",
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
