import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { teams } from "@/lib/data"
import { Users } from "lucide-react"

export default function TeamsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
        <p className="text-muted-foreground">View all teams participating in the IPL tournament</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => (
          <Card key={team.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>{team.name}</CardTitle>
                  <CardDescription>{team.city}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-3 gap-1">
                  <div className="font-medium">Home Venue:</div>
                  <div className="col-span-2">{team.homeVenue}</div>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <div className="font-medium">Coach:</div>
                  <div className="col-span-2">{team.coach}</div>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <div className="font-medium">Captain:</div>
                  <div className="col-span-2">{team.captain}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
