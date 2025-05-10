"use server"

import { revalidatePath } from "next/cache"
import prisma from "./db"
import crypto from "crypto"

// Create a new order in Razorpay and save to database
export async function createOrder(data: {
  amount: number
  currency: string
  receipt: string
  userData: any
  packageDetails: any
}) {
  try {
    // First create or find the user
    const user = await prisma.user.upsert({
      where: { email: data.userData.email },
      update: {
        firstName: data.userData.firstName,
        lastName: data.userData.lastName,
        phone: data.userData.phone,
        address: data.userData.address,
      },
      create: {
        firstName: data.userData.firstName,
        lastName: data.userData.lastName,
        email: data.userData.email,
        phone: data.userData.phone,
        address: data.userData.address,
      },
    })

    // Create order in Razorpay
    const razorpay = new (require("razorpay"))({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })

    const razorpayOrder = await razorpay.orders.create({
      amount: data.amount,
      currency: data.currency,
      receipt: data.receipt,
      notes: {
        packageId: data.packageDetails.id,
        userId: user.id,
      },
    })

    // Save order to database
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        packageId: data.packageDetails.id.toString(),
        razorpayOrderId: razorpayOrder.id,
        amount: data.amount / 100, // Convert from paise to rupees for DB
        currency: data.currency,
        receipt: data.receipt,
        status: "created",
        notes: {
          packageName: data.packageDetails.name,
          userEmail: user.email,
        },
      },
    })

    return razorpayOrder
  } catch (error) {
    console.error("Error creating order:", error)
    throw new Error("Failed to create order")
  }
}

// Verify payment signature and update database
export async function verifyPayment(data: {
  orderId: string
  paymentId: string
  signature: string
}) {
  try {
    // Verify signature
    const text = `${data.orderId}|${data.paymentId}`
    const generatedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!).update(text).digest("hex")

    if (generatedSignature !== data.signature) {
      throw new Error("Invalid payment signature")
    }

    // Get order details from Razorpay
    const razorpay = new (require("razorpay"))({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })

    const razorpayPayment = await razorpay.payments.fetch(data.paymentId)

    // Find the order in our database
    const order = await prisma.order.findUnique({
      where: { razorpayOrderId: data.orderId },
    })

    if (!order) {
      throw new Error("Order not found")
    }

    // Update order status
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "paid" },
    })

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        razorpayPaymentId: data.paymentId,
        razorpaySignature: data.signature,
        amount: razorpayPayment.amount / 100, // Convert from paise to rupees
        status: razorpayPayment.status,
        method: razorpayPayment.method,
        cardDetails: razorpayPayment.card
          ? {
              last4: razorpayPayment.card.last4,
              network: razorpayPayment.card.network,
              type: razorpayPayment.card.type,
            }
          : undefined,
        walletDetails: razorpayPayment.wallet
          ? {
              entity: razorpayPayment.wallet.entity,
            }
          : undefined,
        upiDetails: razorpayPayment.vpa
          ? {
              vpa: razorpayPayment.vpa,
            }
          : undefined,
      },
    })

    revalidatePath("/")
    return { success: true, payment }
  } catch (error) {
    console.error("Error verifying payment:", error)
    throw new Error("Failed to verify payment")
  }
}

// Get order details by ID
export async function getOrderById(orderId: string) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        package: true,
        payment: true,
      },
    })

    return order
  } catch (error) {
    console.error("Error fetching order:", error)
    throw new Error("Failed to fetch order details")
  }
}
