"use client"

import { useState } from "react"
import PackageList from "@/app/components/package-list"
import UserForm from "@/app/components/user-form"
import PaymentModal from "@/app/components/payment-modal"
import SuccessMessage from "@/app/components/success-message"
import type { Package } from "@/app/lib/types"

export default function HomePage() {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [showPayment, setShowPayment] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)

  const handlePackageSelect = (pkg: Package) => {
    setSelectedPackage(pkg)
    setShowForm(true)
  }

  const handleFormSubmit = (formData: any) => {
    setUserData(formData)
    setShowForm(false)
    setShowPayment(true)
  }

  const handlePaymentSuccess = (response: any) => {
    setShowPayment(false)
    setPaymentSuccess(true)
    setOrderId(response.orderId)
  }

  const handleCloseSuccess = () => {
    setPaymentSuccess(false)
    setSelectedPackage(null)
    setUserData(null)
    setOrderId(null)
  }

  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-10">Choose Your Package</h1>

      <PackageList onSelectPackage={handlePackageSelect} />

      {showForm && selectedPackage && (
        <UserForm packageDetails={selectedPackage} onSubmit={handleFormSubmit} onCancel={() => setShowForm(false)} />
      )}

      {showPayment && selectedPackage && userData && (
        <PaymentModal
          packageDetails={selectedPackage}
          userData={userData}
          onSuccess={handlePaymentSuccess}
          onCancel={() => {
            setShowPayment(false)
            setShowForm(true)
          }}
        />
      )}

      {paymentSuccess && orderId && <SuccessMessage orderId={orderId} onClose={handleCloseSuccess} />}
    </main>
  )
}
