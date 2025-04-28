"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BirdIcon as Cricket, MapPin, Users, Calendar, TrendingUp } from "lucide-react"
import { teams, venues, createInitialMatches } from "@/lib/data"
import { useEffect, useState } from "react"
import type { Match } from "@/lib/data"
import { PriorityScheduling, RoundRobinScheduling } from "@/lib/scheduling"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

export default function DashboardPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [scheduledCount, setScheduledCount] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    // Initialize matches
    const initialMatches = createInitialMatches()
    setMatches(initialMatches)

    // Count scheduled matches
    const scheduled = initialMatches.filter((match) => match.isScheduled).length
    setScheduledCount(scheduled)
  }, [])

  const applyScheduling = (strategyType: "roundRobin" | "priority") => {
    const strategy = strategyType === "roundRobin" ? new RoundRobinScheduling() : new PriorityScheduling()

    const scheduledMatches = strategy.scheduleMatches(matches)
    setMatches(scheduledMatches)

    const newScheduledCount = scheduledMatches.filter((match) => match.isScheduled).length
    setScheduledCount(newScheduledCount)

    toast({
      title: "Scheduling Applied",
      description: `${strategy.getStrategyName()} scheduling completed successfully.`,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the IPL Scheduling Management System</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teams.length}</div>
            <p className="text-xs text-muted-foreground">Participating in the tournament</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Venues</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{venues.length}</div>
            <p className="text-xs text-muted-foreground">Available for matches</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Matches</CardTitle>
            <Cricket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{matches.length}</div>
            <p className="text-xs text-muted-foreground">To be scheduled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scheduledCount}</div>
            <p className="text-xs text-muted-foreground">Out of {matches.length} matches</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tournament Overview</CardTitle>
              <CardDescription>Indian Premier League 2025</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Recent Teams</h3>
                  <div className="space-y-2">
                    {teams.slice(0, 3).map((team) => (
                      <div key={team.id} className="flex items-center gap-2 p-2 border rounded-md">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{team.name}</div>
                          <div className="text-xs text-muted-foreground">{team.city}</div>
                        </div>
                      </div>
                    ))}
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link href="/dashboard/teams">View All Teams</Link>
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Recent Venues</h3>
                  <div className="space-y-2">
                    {venues.slice(0, 3).map((venue) => (
                      <div key={venue.id} className="flex items-center gap-2 p-2 border rounded-md">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <MapPin className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{venue.name}</div>
                          <div className="text-xs text-muted-foreground">{venue.city}</div>
                        </div>
                      </div>
                    ))}
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <Link href="/dashboard/venues">View All Venues</Link>
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Upcoming Matches</h3>
                <div className="space-y-2">
                  {matches.slice(0, 3).map((match) => (
                    <div key={match.matchId} className="flex items-center gap-2 p-2 border rounded-md">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Cricket className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">
                          {match.homeTeam.name} vs {match.awayTeam.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {match.venue.name} | {match.dateTime.toLocaleDateString()} | {match.stage}
                        </div>
                      </div>
                      <div
                        className={`text-xs px-2 py-1 rounded-full ${
                          match.isScheduled
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        }`}
                      >
                        {match.isScheduled ? "Scheduled" : "Pending"}
                      </div>
                    </div>
                  ))}
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/dashboard/schedule">View Full Schedule</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduling" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduling Algorithms</CardTitle>
              <CardDescription>Choose a scheduling algorithm to apply to the matches</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Round Robin</CardTitle>
                    <CardDescription>Each team plays against every other team once</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      This algorithm schedules matches in a round-robin format, ensuring each team plays against every
                      other team. It checks for venue and team conflicts.
                    </p>
                    <Button onClick={() => applyScheduling("roundRobin")} className="w-full">
                      Apply Round Robin
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Priority Based</CardTitle>
                    <CardDescription>Schedules matches based on their importance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      This algorithm prioritizes matches based on their stage (Finals first, then Qualifiers, then Group
                      matches) while checking for venue conflicts.
                    </p>
                    <Button onClick={() => applyScheduling("priority")} className="w-full">
                      Apply Priority Scheduling
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Scheduling Results</h3>
                <div className="flex items-center gap-4 p-4 border rounded-md">
                  <TrendingUp className="h-8 w-8 text-primary" />
                  <div>
                    <div className="font-medium">Scheduled Matches</div>
                    <div className="text-2xl font-bold">
                      {scheduledCount} / {matches.length}
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm" className="ml-auto">
                    <Link href="/dashboard/schedule">View Schedule</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
