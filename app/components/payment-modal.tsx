"use client"

import { useEffect, useState } from "react"
import type { Package } from "@/app/lib/types"
import { createOrder } from "@/app/lib/actions"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"

interface PaymentModalProps {
  packageDetails: Package
  userData: any
  onSuccess: (response: any) => void
  onCancel: () => void
}

export default function PaymentModal({ packageDetails, userData, onSuccess, onCancel }: PaymentModalProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    document.body.appendChild(script)
    initializePayment()

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const initializePayment = async () => {
    try {
      setLoading(true)
      const orderData = await createOrder({
        amount: packageDetails.price * 100,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        userData: userData,
        packageDetails: packageDetails,
      })

      if (!orderData || !orderData.id) {
        throw new Error("Failed to create order")
      }
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: packageDetails.price * 100,
        currency: "INR",
        name: "Your Company Name",
        description: `Payment for ${packageDetails.name}`,
        order_id: orderData.id,
        handler: (response: any) => {
          onSuccess({
            ...response,
            orderId: orderData.id,
          })
        },
        prefill: {
          name: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          contact: userData.phone,
        },
        theme: {
          color: "#3399cc",
        },
      }

      const razorpay = new (window as any).Razorpay(options)
      razorpay.open()
      setLoading(false)
    } catch (err: any) {
      setError(err.message || "Payment initialization failed")
      setLoading(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Payment Processing</DialogTitle>
          <DialogDescription>
            Preparing payment for {packageDetails.name} - ₹{packageDetails.price}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-6">
          {loading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p>Initializing payment gateway...</p>
            </>
          ) : error ? (
            <>
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={initializePayment}>Retry Payment</Button>
            </>
          ) : null}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
