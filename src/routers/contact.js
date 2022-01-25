const express = require("express");
const router = new express.Router();
const Contact = require("../Models/contact");
const emailSender = require("../helpers/emailSender");

router.post("/contact", async (req, res) => {
  const contact = new Contact(req.body);

  try {
    await contact.save();
    emailSender(req.body.email, "contact");
    res.send({
      success: "success",
    });
  } catch (error) {
    res.send({
      messageError: error.errors.message,
      emailError: error.errors.email,
    });
  }
});

module.exports = router;
