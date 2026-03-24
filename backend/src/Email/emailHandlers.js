const emailTemplate = require("./email.template");
const { Resend } = require("resend");
const env = require("../lib/env");

const resend = new Resend(env.RESEND_API_KEY);

const sendVerificationEmail = async (email, fullName) => {
    
    if (!env.RESEND_API_KEY || !env.EMAIL_FROM || !env.CLIENT_URL) {
        throw new Error("Email service is not configured correctly");
    }
    if (!email) {
        throw new Error("Recipient email is required");
    }

  const { data, error } = await resend.emails.send({
    from: `${env.EMAIL_FROM_NAME} <${env.EMAIL_FROM}>`,
    to: email,
    subject: 'Chatify - Email Verification',
    html: emailTemplate(fullName, env.CLIENT_URL),
  });

  if (error) {
    console.error("Error sending verification email:", error);
    throw new Error(error.message);
  }

  return data;
};

module.exports = sendVerificationEmail;