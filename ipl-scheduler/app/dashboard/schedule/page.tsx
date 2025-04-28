"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createInitialMatches } from "@/lib/data"
import { PriorityScheduling, RoundRobinScheduling } from "@/lib/scheduling"
import { Calendar, BirdIcon as Cricket, MapPin } from "lucide-react"
import { useEffect, useState } from "react"
import type { Match } from "@/lib/data"
import { useToast } from "@/components/ui/use-toast"

export default function SchedulePage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([])
  const [filter, setFilter] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    // Initialize matches
    const initialMatches = createInitialMatches()
    setMatches(initialMatches)
    setFilteredMatches(initialMatches)
  }, [])

  const applyScheduling = (strategyType: "roundRobin" | "priority") => {
    const strategy = strategyType === "roundRobin" ? new RoundRobinScheduling() : new PriorityScheduling()

    const scheduledMatches = strategy.scheduleMatches(matches)
    setMatches(scheduledMatches)

    // Apply current filter to updated matches
    filterMatches(filter, scheduledMatches)

    toast({
      title: "Scheduling Applied",
      description: `${strategy.getStrategyName()} scheduling completed successfully.`,
    })
  }

  const filterMatches = (filterValue: string, matchesToFilter = matches) => {
    setFilter(filterValue)

    if (filterValue === "all") {
      setFilteredMatches(matchesToFilter)
    } else if (filterValue === "scheduled") {
      setFilteredMatches(matchesToFilter.filter((match) => match.isScheduled))
    } else if (filterValue === "pending") {
      setFilteredMatches(matchesToFilter.filter((match) => !match.isScheduled))
    } else if (filterValue === "group") {
      setFilteredMatches(matchesToFilter.filter((match) => match.stage === "Group"))
    } else if (filterValue === "qualifier") {
      setFilteredMatches(matchesToFilter.filter((match) => match.stage === "Qualifier" || match.stage === "Eliminator"))
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Match Schedule</h1>
        <p className="text-muted-foreground">View and manage the IPL match schedule</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>IPL 2025 Schedule</CardTitle>
              <CardDescription>
                Total: {matches.length} matches | Scheduled: {matches.filter((m) => m.isScheduled).length}
              </CardDescription>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={filter} onValueChange={filterMatches}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter matches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Matches</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="group">Group Stage</SelectItem>
                  <SelectItem value="qualifier">Qualifiers</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => applyScheduling(value as "roundRobin" | "priority")}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Apply Scheduling" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="roundRobin">Round Robin</SelectItem>
                  <SelectItem value="priority">Priority Based</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="list" className="space-y-4">
            <TabsList>
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-4">
              <div className="space-y-4">
                {filteredMatches.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No matches found with the selected filter.
                  </div>
                ) : (
                  filteredMatches.map((match) => (
                    <Card key={match.matchId}>
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  match.isScheduled ? "bg-green-500" : "bg-yellow-500"
                                }`}
                              />
                              <span className="font-semibold text-lg">
                                {match.homeTeam.name} vs {match.awayTeam.name}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                {formatDate(match.dateTime)}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                {match.venue.name}, {match.venue.city}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div
                              className={`px-2 py-1 text-xs rounded-full ${
                                match.stage === "Group"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                  : match.stage === "Qualifier"
                                    ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                                    : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                              }`}
                            >
                              {match.stage}
                            </div>
                            <div
                              className={`px-2 py-1 text-xs rounded-full ${
                                match.isScheduled
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                  : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                              }`}
                            >
                              {match.isScheduled ? "Scheduled" : "Pending"}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="calendar" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Group matches by date */}
                {Array.from(new Set(filteredMatches.map((match) => match.dateTime.toDateString()))).map((dateStr) => {
                  const matchesOnDate = filteredMatches.filter((match) => match.dateTime.toDateString() === dateStr)

                  return (
                    <Card key={dateStr}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">
                          {new Date(dateStr).toLocaleDateString("en-US", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </CardTitle>
                        <CardDescription>
                          {matchesOnDate.length} match{matchesOnDate.length !== 1 ? "es" : ""}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {matchesOnDate.map((match) => (
                          <div
                            key={match.matchId}
                            className={`p-2 rounded-md border ${
                              match.isScheduled
                                ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
                                : "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950"
                            }`}
                          >
                            <div className="font-medium">
                              {match.homeTeam.name} vs {match.awayTeam.name}
                            </div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                              <div className="flex items-center gap-1">
                                <Cricket className="h-3 w-3" />
                                {match.stage}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {match.venue.name}
                              </div>
                              <div>
                                {match.dateTime.toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
