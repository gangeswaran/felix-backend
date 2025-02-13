require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL, // Your email
    pass: process.env.PASSWORD, // App password (not your actual password)
  },
});

app.post("/send-email", async (req, res) => {
  const { name, organization, email, phone } = req.body;

  if (!name || !organization || !email || !phone) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  // Email to the recipient (confirmation email)
  const recipientMailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Thank You for Contacting Us",
    text: `Dear ${name},\n\nThank you for reaching out! We have received your inquiry.\n\nWe will get back to you shortly.\n\nBest Regards,\nFelix`,
  };

  // Email to yourself (notification)
  const adminMailOptions = {
    from: process.env.EMAIL,
    to: process.env.RECEIVER_EMAIL, // Your email for receiving notifications
    subject: `New Contact Form Submission from ${name}`,
    text: `Name: ${name}\nOrganization: ${organization}\nEmail: ${email}\nPhone: ${phone}\n\nHe wants to send a new contact form submission.`,
  };

  try {
    // Send both emails
    await transporter.sendMail(recipientMailOptions);
    await transporter.sendMail(adminMailOptions);

    res.status(200).json({ message: "Emails sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending email", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
