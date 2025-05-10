// app/api/payment/webhook/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { verifyPayment } from "@/app/lib/actions"

// Tell Next.js this route is dynamic and should not be statically analyzed
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const result = await verifyPayment({
      orderId: data.payload.order.entity.id,
      paymentId: data.payload.payment.entity.id,
      signature: data.payload.payment.entity.signature,
    })

    return NextResponse.json({ success: true, data: result })
  } catch (error: any) {
    console.error("Webhook error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 400 })
  }
}
