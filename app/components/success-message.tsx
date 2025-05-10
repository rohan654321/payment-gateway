"use client"

import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface SuccessMessageProps {
  orderId: string
  onClose: () => void
}

export default function SuccessMessage({ orderId, onClose }: SuccessMessageProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-center">Payment Successful!</DialogTitle>
          <DialogDescription className="text-center">Your order has been placed successfully</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-6">
          <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
          <p className="text-center mb-2">
            Thank you for your purchase. We've sent a confirmation email with all the details.
          </p>
          <p className="text-sm text-muted-foreground">Order ID: {orderId}</p>
        </div>

        <DialogFooter>
          <Button className="w-full" onClick={onClose}>
            Return to Packages
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
