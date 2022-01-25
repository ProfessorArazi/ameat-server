const nodemailer = require("nodemailer");

const emailSender = (client, sub = "", details = {}) => {
  const ameatEmail = "ameatrest@gmail.com";
  let subject;
  let html;
  let str;
  if (details.user) {
    str = `היי ${details.user.name} , הזמנתך התקבלה ואלו פרטי הההזמנה: 
    `;
  }
  switch (sub) {
    case "contact":
      subject = "פנייתך התקבלה";
      html = `שלום ותודה שפנית אלינו, נציג ייצור איתך קשר תוך מספר שעות\n <h3>Ameat Resturant</h3>`;
      break;
    case "order":
      str += `<br/>כתובת : ${details.user.city} , רחוב ${
        details.user.street + " " + details.user.home
      } \n`;
      details.orderedItems.forEach(
        (x) =>
          (str += `<li>${JSON.parse(
            JSON.stringify(x.amount + " " + x.name)
          )}</li>`)
      );
      subject = "הזמנתך התקבלה";
      html = `<ul>${str}האוכל יגיע אליכם בעוד שעה</ul>`;
      break;
    default:
      subject = "תודה שהצטרפת למועדון החברים";
      html = `ברוך הבא למועדון שלנו, תתכונן להטבות מטורפות!\n<h3>Ameat Resturant</h3>`;
  }
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: ameatEmail,
      pass: "Amit1122",
    },
  });

  const mailOptions = {
    from: ameatEmail,
    to: client,
    subject,
    html,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    }
  });
};

module.exports = emailSender;
