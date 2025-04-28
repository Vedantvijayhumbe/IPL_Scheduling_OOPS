"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, ArrowLeft, Calendar, StickerIcon as Stadium, Clock, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { useToast } from "@/components/ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { IPLScheduler } from "@/lib/scheduler"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Match type definition
interface Match {
  id: number
  day: string
  time: string
  teamA: string
  teamB: string
  venue: string
}

// Playoff match type
interface PlayoffMatch {
  id: number
  name: string
  teamA: string
  teamB: string
  venue: string
  winner: string
}

export default function SchedulePage() {
  const router = useRouter()
  const { toast } = useToast()

  // State for teams, stadiums, and schedule
  const [teams, setTeams] = useState<string[]>([])
  const [stadiums, setStadiums] = useState<string[]>([])
  const [startDay, setStartDay] = useState<number>(1)
  const [matches, setMatches] = useState<Match[]>([])

  // State for playoffs
  const [showPlayoffs, setShowPlayoffs] = useState(false)
  const [playoffStadiums, setPlayoffStadiums] = useState<string[]>(["", "", "", ""])
  const [topTeams, setTopTeams] = useState<string[]>(["", "", "", ""])
  const [playoffMatches, setPlayoffMatches] = useState<PlayoffMatch[]>([])
  const [champion, setChampion] = useState<string>("")

  // Load data on component mount
  useEffect(() => {
    const loadedTeams = localStorage.getItem("iplTeams")
    const loadedStadiums = localStorage.getItem("iplStadiums")
    const loadedStartDay = localStorage.getItem("iplStartDay")

    if (loadedTeams && loadedStadiums && loadedStartDay) {
      const parsedTeams = JSON.parse(loadedTeams)
      const parsedStadiums = JSON.parse(loadedStadiums)
      const parsedStartDay = Number.parseInt(loadedStartDay)

      setTeams(parsedTeams)
      setStadiums(parsedStadiums)
      setStartDay(parsedStartDay)

      // Generate schedule
      generateSchedule(parsedTeams, parsedStadiums, parsedStartDay)
    } else {
      // Redirect back to setup if data is missing
      toast({
        title: "Missing data",
        description: "Please complete the setup first",
        variant: "destructive",
      })
      router.push("/setup")
    }
  }, [router, toast])

  // Generate schedule using the scheduler
  const generateSchedule = (teamList: string[], stadiumList: string[], day: number) => {
    const scheduler = new IPLScheduler(teamList.length, day)
    scheduler.setTeamNames(teamList)
    scheduler.setVenueNames(stadiumList)
    scheduler.generateMatches()

    // Choose appropriate day gap and time choice based on number of teams
    const dayGap = teamList.length < 8 ? 2 : 1
    const timeChoice = teamList.length < 8 ? 2 : 1
    scheduler.scheduleDayTime(dayGap, timeChoice)

    // Get the schedule
    const generatedMatches = scheduler.getSchedule()
    setMatches(generatedMatches)
  }

  // Handle playoff stadium input
  const handlePlayoffStadiumChange = (index: number, value: string) => {
    const newStadiums = [...playoffStadiums]
    newStadiums[index] = value
    setPlayoffStadiums(newStadiums)
  }

  // Handle top team input
  const handleTopTeamChange = (index: number, value: string) => {
    const newTeams = [...topTeams]
    newTeams[index] = value
    setTopTeams(newTeams)
  }

  // Start playoffs
  const handleStartPlayoffs = () => {
    // Validate all playoff stadiums are selected
    if (playoffStadiums.some((stadium) => !stadium)) {
      toast({
        title: "Missing stadiums",
        description: "Please select all playoff stadiums",
        variant: "destructive",
      })
      return
    }

    // Validate all top teams are selected
    if (topTeams.some((team) => !team)) {
      toast({
        title: "Missing teams",
        description: "Please select all top 4 teams",
        variant: "destructive",
      })
      return
    }

    // Validate no duplicate teams
    const uniqueTeams = new Set(topTeams)
    if (uniqueTeams.size !== 4) {
      toast({
        title: "Duplicate teams",
        description: "Please select 4 different teams",
        variant: "destructive",
      })
      return
    }

    // Create playoff matches
    const playoffs: PlayoffMatch[] = [
      {
        id: 1,
        name: "Qualifier 1",
        teamA: topTeams[0],
        teamB: topTeams[1],
        venue: playoffStadiums[0],
        winner: "",
      },
      {
        id: 2,
        name: "Eliminator",
        teamA: topTeams[2],
        teamB: topTeams[3],
        venue: playoffStadiums[1],
        winner: "",
      },
    ]

    setPlayoffMatches(playoffs)
    setShowPlayoffs(true)
  }

  // Handle winner selection for playoff matches
  const handleWinnerSelect = (matchId: number, winner: string) => {
    const updatedMatches = [...playoffMatches]
    const matchIndex = updatedMatches.findIndex((m) => m.id === matchId)

    if (matchIndex !== -1) {
      updatedMatches[matchIndex].winner = winner

      // If Qualifier 1 and Eliminator are complete, create Qualifier 2
      if (matchId <= 2 && updatedMatches.filter((m) => m.winner).length === 2) {
        const qualifier1 = updatedMatches.find((m) => m.id === 1)!
        const eliminator = updatedMatches.find((m) => m.id === 2)!

        // Loser of Qualifier 1 vs Winner of Eliminator
        const loserQ1 = qualifier1.teamA === qualifier1.winner ? qualifier1.teamB : qualifier1.teamA

        updatedMatches.push({
          id: 3,
          name: "Qualifier 2",
          teamA: loserQ1,
          teamB: eliminator.winner,
          venue: playoffStadiums[2],
          winner: "",
        })
      }

      // If Qualifier 2 is complete, create Final
      if (matchId === 3) {
        const qualifier1 = updatedMatches.find((m) => m.id === 1)!
        const qualifier2 = updatedMatches.find((m) => m.id === 3)!

        updatedMatches.push({
          id: 4,
          name: "Final",
          teamA: qualifier1.winner,
          teamB: qualifier2.winner,
          venue: playoffStadiums[3],
          winner: "",
        })
      }

      // If Final is complete, set champion
      if (matchId === 4) {
        setChampion(winner)
      }

      setPlayoffMatches(updatedMatches)
    }
  }

  // Format day number to day name
  const getDayName = (day: number): string => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    return days[(day - 1) % 7]
  }

  // Format time code to readable time
  const getTimeString = (timeCode: string): string => {
    return timeCode === "A" ? "3:30 PM" : "7:30 PM"
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-30 border-b bg-background">
        <div className="container mx-auto flex h-16 items-center px-4 sm:px-6">
          <Link href="/setup" className="flex items-center gap-2 font-semibold">
            <ArrowLeft className="h-5 w-5" />
            <Trophy className="h-6 w-6" />
            <span>IPL Scheduler</span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {!showPlayoffs ? (
            <>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <h1 className="text-3xl font-bold">League Schedule</h1>
                  <p className="text-muted-foreground">
                    {teams.length} teams, {matches.length} matches
                  </p>
                </div>
                <Button onClick={() => setShowPlayoffs(true)}>
                  Start Playoffs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Match Schedule</CardTitle>
                  <CardDescription>Complete league phase schedule</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-4">
                      {matches.map((match, index) => (
                        <div key={index} className="p-4 border rounded-md">
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Calendar className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <div className="font-medium">{match.day}</div>
                                <div className="text-sm text-muted-foreground flex items-center gap-1">
                                  <Clock className="h-3 w-3" /> {match.time}
                                </div>
                              </div>
                            </div>

                            <div className="flex-1 flex items-center justify-center">
                              <div className="text-right flex-1">{match.teamA}</div>
                              <div className="mx-2 font-bold">vs</div>
                              <div className="text-left flex-1">{match.teamB}</div>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <Stadium className="h-4 w-4 text-primary" />
                              </div>
                              <div className="text-sm">{match.venue}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <h1 className="text-3xl font-bold">Playoffs</h1>
                  <p className="text-muted-foreground">Top 4 teams compete for the championship</p>
                </div>
                {!playoffMatches.length && (
                  <Button variant="outline" onClick={() => setShowPlayoffs(false)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Schedule
                  </Button>
                )}
              </div>

              {!playoffMatches.length ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Playoff Setup</CardTitle>
                    <CardDescription>Configure playoff venues and teams</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Playoff Venues</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {["Qualifier 1", "Eliminator", "Qualifier 2", "Final"].map((match, index) => (
                          <div key={index} className="space-y-2">
                            <Label htmlFor={`venue-${index}`}>{match} Venue</Label>
                            <Select
                              value={playoffStadiums[index]}
                              onValueChange={(value) => handlePlayoffStadiumChange(index, value)}
                            >
                              <SelectTrigger id={`venue-${index}`}>
                                <SelectValue placeholder={`Select venue for ${match}`} />
                              </SelectTrigger>
                              <SelectContent>
                                {stadiums.map((stadium, idx) => (
                                  <SelectItem key={idx} value={stadium}>
                                    {stadium}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-medium">Top 4 Teams</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((position, index) => (
                          <div key={index} className="space-y-2">
                            <Label htmlFor={`team-${index}`}>Position {position}</Label>
                            <Select
                              value={topTeams[index]}
                              onValueChange={(value) => handleTopTeamChange(index, value)}
                            >
                              <SelectTrigger id={`team-${index}`}>
                                <SelectValue placeholder={`Select team for position ${position}`} />
                              </SelectTrigger>
                              <SelectContent>
                                {teams.map((team, idx) => (
                                  <SelectItem key={idx} value={team}>
                                    {team}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button onClick={handleStartPlayoffs}>
                      Start Playoffs
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <div className="space-y-6">
                  {champion ? (
                    <Card className="border-2 border-yellow-500 dark:border-yellow-600">
                      <CardHeader className="text-center">
                        <CardTitle className="text-2xl">🏆 IPL Champion 🏆</CardTitle>
                        <CardDescription>Congratulations to the winner!</CardDescription>
                      </CardHeader>
                      <CardContent className="flex flex-col items-center justify-center py-8">
                        <div className="w-24 h-24 rounded-full bg-yellow-500/20 flex items-center justify-center mb-4">
                          <Trophy className="h-12 w-12 text-yellow-500" />
                        </div>
                        <h2 className="text-4xl font-bold text-center">{champion}</h2>
                        <p className="text-muted-foreground mt-2">IPL Champion {new Date().getFullYear()}</p>
                      </CardContent>
                      <CardFooter className="flex justify-center">
                        <Button onClick={() => router.push("/")}>Back to Home</Button>
                      </CardFooter>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {playoffMatches.map((match) => (
                        <Card key={match.id} className={match.winner ? "border-green-500 dark:border-green-700" : ""}>
                          <CardHeader>
                            <CardTitle>{match.name}</CardTitle>
                            <CardDescription>Venue: {match.venue}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4">
                              <div className="flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                  <span className="text-xl font-bold">{match.teamA.substring(0, 2)}</span>
                                </div>
                                <div className="mt-2 font-medium">{match.teamA}</div>
                                {match.winner === match.teamA && (
                                  <div className="mt-1 text-xs px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full">
                                    Winner
                                  </div>
                                )}
                              </div>

                              <div className="text-2xl font-bold">VS</div>

                              <div className="flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                  <span className="text-xl font-bold">{match.teamB.substring(0, 2)}</span>
                                </div>
                                <div className="mt-2 font-medium">{match.teamB}</div>
                                {match.winner === match.teamB && (
                                  <div className="mt-1 text-xs px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full">
                                    Winner
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                          {!match.winner && (
                            <CardFooter className="flex justify-center gap-4">
                              <Button
                                onClick={() => handleWinnerSelect(match.id, match.teamA)}
                                variant="outline"
                                className="flex-1"
                              >
                                {match.teamA} Wins
                              </Button>
                              <Button
                                onClick={() => handleWinnerSelect(match.id, match.teamB)}
                                variant="outline"
                                className="flex-1"
                              >
                                {match.teamB} Wins
                              </Button>
                            </CardFooter>
                          )}
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
