export interface Package {
    id: number
    name: string
    price: number
    description: string
    features: string[]
  }
  
  export interface OrderData {
    id: string
    amount: number
    currency: string
    receipt: string
    userData: any
    packageDetails: Package
  }
  
  export interface PaymentVerification {
    orderId: string
    paymentId: string
    signature: string
  }
  