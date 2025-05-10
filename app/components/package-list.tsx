"use client"

import type { Package } from "@/app/lib/types"
import PackageCard from "@/app/components/package-card"

interface PackageListProps {
  onSelectPackage: (pkg: Package) => void
}

export default function PackageList({ onSelectPackage }: PackageListProps) {
  const packages: Package[] = [
    {
      id: 1,
      name: "Basic Package",
      price: 99,
      description: "Essential features for small businesses",
      features: ["5 Users", "10GB Storage", "Email Support", "Basic Analytics"],
    },
    {
      id: 2,
      name: "Professional Package",
      price: 199,
      description: "Advanced features for growing businesses",
      features: ["15 Users", "50GB Storage", "Priority Support", "Advanced Analytics", "API Access"],
    },
    {
      id: 3,
      name: "Enterprise Package",
      price: 399,
      description: "Complete solution for large organizations",
      features: [
        "Unlimited Users",
        "500GB Storage",
        "24/7 Support",
        "Custom Analytics",
        "API Access",
        "Dedicated Account Manager",
      ],
    },
  ]

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {packages.map((pkg) => (
        <PackageCard key={pkg.id} packageData={pkg} onSelect={() => onSelectPackage(pkg)} />
      ))}
    </div>
  )
}
