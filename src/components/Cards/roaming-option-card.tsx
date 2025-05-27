import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, MessageSquare, Phone, Receipt } from "lucide-react"

interface RoamingOption {
  id: number
  title: string
  badge: {
    text: string
    color: string
  }
  price: string
  data: string
  texts: string
  minutes: string
}

interface RoamingOptionsCardProps {
  title: string
  options: RoamingOption[]
  className?: string
}

export default function RoamingOptionsCard({
  title = "Roaming options 'For You'",
  options,
  className = "",
}: RoamingOptionsCardProps) {
  return (
    <Card className={`w-full max-w-md rounded-xl shadow-sm ${className}`}>
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>

        <div className="space-y-8">
          {options.map((option) => (
            <div key={option.id} className="space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold">Option {option.id}</h3>
                <Badge
                  className={`font-medium border-0 ${
                    option.badge.text === "Most Flexible" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                  }`}
                >
                  {option.badge.text}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Receipt className="h-5 w-5 text-teal-600" />
                  <span>{option.price}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-teal-600" />
                  <span>{option.data}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-teal-600" />
                  <span>{option.texts}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-teal-600" />
                  <span>{option.minutes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
