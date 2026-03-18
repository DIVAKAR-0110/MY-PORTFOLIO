import nodemailer from "nodemailer";

export const handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const { name, email, message } = JSON.parse(event.body);

    if (!name || !email || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "All fields are required." }),
      };
    }

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.error("Missing Environment Variables on Netlify Dashboard!");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Server Configuration Error: Missing Credentials" }),
      };
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `Portfolio Contact <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER, // Send it to yourself
      replyTo: email,
      subject: `New Portfolio Message from ${name}`,
      text: `You have received a new message from your portfolio website.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #0f172a; padding: 20px; text-align: center;">
            <h2 style="color: #22d3ee; margin: 0;">New Portfolio Transmission</h2>
          </div>
          <div style="padding: 20px;">
            <h3 style="color: #0f172a; margin-top: 0;">Sender Details</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #14b8a6;">${email}</a></p>
            
            <h3 style="color: #0f172a; border-top: 1px solid #e2e8f0; padding-top: 15px; margin-top: 20px;">Message payload:</h3>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; border-left: 4px solid #14b8a6;">
              <p style="margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
          <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 0.85rem; color: #64748b;">
            <p style="margin: 0;">This transmission was sent securely from your AI Portfolio Interface.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Message sent successfully." }),
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to send", details: error.message }),
    };
  }
};
