import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"

interface FeatureItem {
  icon: React.ReactNode
  text: string
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

interface RoamingOptionDetailCardProps {
  title: string
  features: FeatureItem[]
  zones?: {
    text: string
    link?: {
      text: string
      href: string
    }
  }
  cost?: {
    amount: string
    period: string
  }
  className?: string
}

export default function RoamingOptionDetailCard({
  title,
  features,
  zones,
  cost,
  className = "",
}: RoamingOptionDetailCardProps) {
  return (
    <Card className={`w-full max-w-md bg-gray-100 rounded-3xl shadow-sm ${className}`}>
      <CardContent className="p-6">
        <ScrollArea className="h-[400px] pr-4">
          <h2 className="text-2xl font-bold mb-8">{title}</h2>

          {features.length > 0 && (
            <Section title="Includes:">
              <div className="space-y-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    {feature.icon}
                    <span className="text-xl">{feature.text}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {zones && (
            <Section title="Zone:">
              <div>
                <p className="text-xl">{zones.text}</p>
                {zones.link && (
                  <Link href={zones.link.href} className="text-xl text-blue-600">
                    {zones.link.text} ›
                  </Link>
                )}
              </div>
            </Section>
          )}

          {cost && (
            <Section title="Cost:">
              <p className="text-xl">
                ${cost.amount} | {cost.period}
              </p>
            </Section>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

function Section({ title, children }: SectionProps) {
  return (
    <div className="mb-6">
      <h3 className="text-2xl font-bold mb-2">{title}</h3>
      {children}
    </div>
  );
}