"use server"

import nodemailer from "nodemailer"

interface EmailData {
  to: string
  name: string
  packageName: string
  amount: number
  orderId: string
}

export async function sendConfirmationEmail(data: EmailData) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: data.to,
      subject: "Your Purchase Confirmation",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #333; text-align: center;">Thank You for Your Purchase!</h2>
          
          <p>Hello ${data.name},</p>
          
          <p>We're excited to confirm your purchase of the <strong>${data.packageName}</strong> package.</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Order Summary</h3>
            <p><strong>Order ID:</strong> ${data.orderId}</p>
            <p><strong>Package:</strong> ${data.packageName}</p>
            <p><strong>Amount Paid:</strong> ₹${data.amount.toFixed(2)}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          
          <p>If you have any questions about your purchase, please don't hesitate to contact our support team.</p>
          
          <p>Best regards,<br>Your Company Name</p>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error("Email sending failed:", error)
    throw error
  }
}
