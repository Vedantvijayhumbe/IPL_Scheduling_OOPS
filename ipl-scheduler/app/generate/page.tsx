"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BirdIcon as Cricket, Calendar, ArrowLeft, Download, Share2, Loader2 } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { useState, useEffect } from "react"
import { generateIPLSchedule } from "@/lib/schedule-generator"
import type { GeneratedMatch, Team } from "@/lib/schedule-generator"
import { useToast } from "@/components/ui/use-toast"

export default function GeneratePage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [schedule, setSchedule] = useState<GeneratedMatch[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [groupA, setGroupA] = useState<Team[]>([])
  const [groupB, setGroupB] = useState<Team[]>([])
  const { toast } = useToast()

  useEffect(() => {
    // Set initial state
    if (schedule.length === 0) {
      handleGenerate()
    }
  }, [])

  const handleGenerate = () => {
    setIsGenerating(true)

    // Simulate processing time
    setTimeout(() => {
      const result = generateIPLSchedule()
      setSchedule(result.matches)
      setTeams(result.teams)
      setGroupA(result.groupA)
      setGroupB(result.groupB)
      setIsGenerating(false)

      toast({
        title: "Schedule Generated",
        description: `Successfully created IPL 2025 schedule with ${result.matches.length} matches`,
      })
    }, 1500)
  }

  const handleDownload = () => {
    toast({
      title: "Schedule Downloaded",
      description: "The IPL 2025 schedule has been downloaded successfully.",
    })
  }

  const handleShare = () => {
    toast({
      title: "Share Link Copied",
      description: "Schedule share link has been copied to clipboard.",
    })
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date)
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-30 border-b bg-background">
        <div className="container mx-auto flex h-16 items-center px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <ArrowLeft className="h-5 w-5" />
            <Cricket className="h-6 w-6" />
            <span>IPL Scheduler 2025</span>
          </Link>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">IPL 2025 Schedule</h1>
            <p className="text-muted-foreground">Generated schedule based on the new IPL format with virtual groups</p>
          </div>

          <Button onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Calendar className="h-4 w-4 mr-2" />
                Regenerate
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Group A</CardTitle>
              <CardDescription>5 teams in virtual group A</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {groupA.map((team) => (
                  <div key={team.id} className="flex items-center gap-2 p-2 border rounded-md">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-semibold">{team.name.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="font-medium">{team.name}</div>
                      <div className="text-xs text-muted-foreground">{team.city}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Group B</CardTitle>
              <CardDescription>5 teams in virtual group B</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {groupB.map((team) => (
                  <div key={team.id} className="flex items-center gap-2 p-2 border rounded-md">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-semibold">{team.name.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="font-medium">{team.name}</div>
                      <div className="text-xs text-muted-foreground">{team.city}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Schedule Summary</CardTitle>
              <CardDescription>Overview of the generated schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-2 border rounded-md">
                  <div className="font-medium">Total Matches</div>
                  <div className="text-xl font-bold">{schedule.length}</div>
                </div>
                <div className="flex justify-between items-center p-2 border rounded-md">
                  <div className="font-medium">League Matches</div>
                  <div className="text-xl font-bold">{schedule.filter((m) => m.stage === "League").length}</div>
                </div>
                <div className="flex justify-between items-center p-2 border rounded-md">
                  <div className="font-medium">Playoff Matches</div>
                  <div className="text-xl font-bold">{schedule.filter((m) => m.stage !== "League").length}</div>
                </div>
                <div className="flex justify-between items-center p-2 border rounded-md">
                  <div className="font-medium">Duration</div>
                  <div className="text-xl font-bold">
                    {schedule.length > 0 ? `${Math.ceil(schedule.length / 2)} days` : "N/A"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Matches</TabsTrigger>
            <TabsTrigger value="league">League Stage</TabsTrigger>
            <TabsTrigger value="playoffs">Playoffs</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {isGenerating ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-4">
                {schedule.map((match, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                match.stage !== "League" ? "bg-orange-500" : "bg-green-500"
                              }`}
                            />
                            <span className="font-semibold text-lg">
                              {match.homeTeam.name} vs {match.awayTeam.name}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              {formatDate(match.date)} | {formatTime(match.date)}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">{match.venue}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div
                            className={`px-2 py-1 text-xs rounded-full ${
                              match.stage === "League"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                : match.stage === "Qualifier 1" || match.stage === "Qualifier 2"
                                  ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                                  : match.stage === "Eliminator"
                                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            }`}
                          >
                            {match.stage}
                          </div>
                          <div
                            className={`px-2 py-1 text-xs rounded-full ${
                              match.matchNumber <= 70
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
                            }`}
                          >
                            Match {match.matchNumber}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="league" className="space-y-4">
            {isGenerating ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-4">
                {schedule
                  .filter((match) => match.stage === "League")
                  .map((match, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-green-500" />
                              <span className="font-semibold text-lg">
                                {match.homeTeam.name} vs {match.awayTeam.name}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                {formatDate(match.date)} | {formatTime(match.date)}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">{match.venue}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                              League
                            </div>
                            <div className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                              Match {match.matchNumber}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="playoffs" className="space-y-4">
            {isGenerating ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-4">
                {schedule
                  .filter((match) => match.stage !== "League")
                  .map((match, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-orange-500" />
                              <span className="font-semibold text-lg">
                                {match.homeTeam.name} vs {match.awayTeam.name}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                {formatDate(match.date)} | {formatTime(match.date)}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">{match.venue}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div
                              className={`px-2 py-1 text-xs rounded-full ${
                                match.stage === "Qualifier 1" || match.stage === "Qualifier 2"
                                  ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                                  : match.stage === "Eliminator"
                                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                              }`}
                            >
                              {match.stage}
                            </div>
                            <div className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                              Match {match.matchNumber}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t py-4 px-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} IPL Scheduler 2025. All rights reserved.
      </footer>
    </div>
  )
}
