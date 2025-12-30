import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendVerificationEmail = async (email: string, code: string) => {
    try {
        // If credentials are missing, log to console for development
        if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
            console.log("==================================================");
            console.log(`[DEV MODE] Email to ${email}`);
            console.log(`[DEV MODE] Verification Code: ${code}`);
            console.log("==================================================");
            return true;
        }

        const info = await transporter.sendMail({
            from: '"PassRoute" <no-reply@pass-route.com>', // sender address
            to: email, // list of receivers
            subject: "Verify your email address", // Subject line
            text: `Your verification code is: ${code}`, // plain text body
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Verify your email</h2>
          <p>Thank you for signing up for PassRoute!</p>
          <p>Your verification code is:</p>
          <h1 style="letter-spacing: 5px; color: #2563eb;">${code}</h1>
          <p>This code will expire in 15 minutes.</p>
        </div>
      `, // html body
        });

        console.log("Message sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
};
