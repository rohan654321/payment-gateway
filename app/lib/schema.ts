// Database schema for the payment system

// This represents the packages available for purchase
export type PackageSchema = {
    id: string // Primary key
    name: string
    description: string
    price: number
    features: string[] // Stored as JSON
    active: boolean // To enable/disable packages
    createdAt: Date
    updatedAt: Date
  }
  
  // This represents the users/customers
  export type UserSchema = {
    id: string // Primary key
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    createdAt: Date
    updatedAt: Date
  }
  
  // This represents the orders placed
  export type OrderSchema = {
    id: string // Primary key
    userId: string // Foreign key to User
    packageId: string // Foreign key to Package
    razorpayOrderId: string // Razorpay order ID
    amount: number
    currency: string
    receipt: string
    status: "created" | "paid" | "failed" | "refunded"
    notes: Record<string, string> // Additional metadata as JSON
    createdAt: Date
    updatedAt: Date
  }
  
  // This represents the payments made
  export type PaymentSchema = {
    id: string // Primary key
    orderId: string // Foreign key to Order
    razorpayPaymentId: string
    razorpaySignature: string
    amount: number
    status: "authorized" | "captured" | "refunded" | "failed"
    method: string // Payment method used (card, wallet, etc.)
    cardDetails?: {
      last4: string
      network: string
      type: string
    } // If paid by card, stored as JSON
    walletDetails?: {
      entity: string
    } // If paid by wallet, stored as JSON
    upiDetails?: {
      vpa: string
    } // If paid by UPI, stored as JSON
    createdAt: Date
    updatedAt: Date
  }
  