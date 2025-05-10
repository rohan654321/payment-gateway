"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { Package } from "@/app/lib/types"

interface PackageCardProps {
  packageData: Package
  onSelect: () => void
}

export default function PackageCard({ packageData, onSelect }: PackageCardProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>{packageData.name}</CardTitle>
        <CardDescription>{packageData.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-3xl font-bold mb-4">₹{packageData.price}</p>
        <ul className="space-y-2">
          {packageData.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <Check className="h-4 w-4 mr-2 text-green-500" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={onSelect}>
          Select Package
        </Button>
      </CardFooter>
    </Card>
  )
}
