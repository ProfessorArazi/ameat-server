const express = require("express");
const router = new express.Router();
const Meal = require("../Models/meal");

router.post("/meals", async (req, res) => {
  const meals = new Meal(req.body);
  try {
    await meals.save();
    console.log(meals);
  } catch (error) {
    console.log(error);
  }
});

router.get("/meals", async (req, res) => {
  try {
    const meals = await Meal.find({});
    res.send(meals);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
