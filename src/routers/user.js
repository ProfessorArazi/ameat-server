const express = require("express");
const router = new express.Router();
const User = require("../Models/user");
const Meal = require("../Models/meal");
const emailSender = require("../helpers/emailSender");

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    emailSender(user.email);
    const token = await user.generateAuthToken();
    res.status(201).send({
      user: {
        id: user._id,
        email: user.email,
        birthday: user.birthday.getMonth(),
        points: user.points,
        redeemed: user.redeemed,
      },
      token,
    });
  } catch (error) {
    const { email, password, birthday, fullName } = error.errors;
    res.send({
      emailError: email,
      passwordError: password,
      dateError: birthday,
      fullNameError: fullName,
    });
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.generateAuthToken();
    res.send({
      user: {
        id: user._id,
        email: user.email,
        birthday: user.birthday.getMonth(),
        points: user.points,
        redeemed: user.redeemed,
      },
      token,
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/users/gifts/:id", async (req, res) => {
  const currentMonth = new Date().getMonth();
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (!user.redeemed && user.birthday.getMonth() === currentMonth) {
      const meals = await Meal.find({});
      return res.status(200).send(meals);
    }

    throw new Error("not birthday");
  } catch (error) {
    res.status(500).send({ error: "error" });
  }
});

router.get("/users/redeemed/:id", async (req, res) => {
  const currentMonth = new Date().getMonth();
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (user.redeemed && user.birthday.getMonth() !== currentMonth) {
      user.redeemed = false;
      await user.save();
    }
    res.status(200).send();
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
