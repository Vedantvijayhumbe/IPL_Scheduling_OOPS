import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { venues } from "@/lib/data"
import { MapPin, Lightbulb } from "lucide-react"

export default function VenuesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Venues</h1>
        <p className="text-muted-foreground">View all venues available for IPL matches</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {venues.map((venue) => (
          <Card key={venue.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>{venue.name}</CardTitle>
                  <CardDescription>{venue.city}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-3 gap-1">
                  <div className="font-medium">Capacity:</div>
                  <div className="col-span-2">{venue.capacity.toLocaleString()} seats</div>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <div className="font-medium">Pitch Type:</div>
                  <div className="col-span-2">{venue.pitchType}</div>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <div className="font-medium">Floodlights:</div>
                  <div className="col-span-2 flex items-center gap-1">
                    {venue.floodlights ? (
                      <>
                        <Lightbulb className="h-4 w-4 text-yellow-500" />
                        <span>Available</span>
                      </>
                    ) : (
                      "Not Available"
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
