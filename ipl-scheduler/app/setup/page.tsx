"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, ArrowLeft, ArrowRight, Plus, Trash2, Calendar, Users, StickerIcon as Stadium } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function SetupPage() {
  const router = useRouter()
  const { toast } = useToast()

  // State for teams
  const [numTeams, setNumTeams] = useState<number | "">(8)
  const [teams, setTeams] = useState<string[]>([])
  const [currentTeam, setCurrentTeam] = useState("")

  // State for stadiums
  const [numStadiums, setNumStadiums] = useState<number | "">(4)
  const [stadiums, setStadiums] = useState<string[]>([])
  const [currentStadium, setCurrentStadium] = useState("")

  // State for schedule settings
  const [startDay, setStartDay] = useState<string>("1")

  // Handle team input
  const handleAddTeam = () => {
    if (!currentTeam.trim()) {
      toast({
        title: "Team name required",
        description: "Please enter a team name",
        variant: "destructive",
      })
      return
    }

    if (teams.includes(currentTeam.trim())) {
      toast({
        title: "Duplicate team",
        description: "This team name already exists",
        variant: "destructive",
      })
      return
    }

    setTeams([...teams, currentTeam.trim()])
    setCurrentTeam("")
  }

  const handleRemoveTeam = (index: number) => {
    setTeams(teams.filter((_, i) => i !== index))
  }

  // Handle stadium input
  const handleAddStadium = () => {
    if (!currentStadium.trim()) {
      toast({
        title: "Stadium name required",
        description: "Please enter a stadium name",
        variant: "destructive",
      })
      return
    }

    if (stadiums.includes(currentStadium.trim())) {
      toast({
        title: "Duplicate stadium",
        description: "This stadium name already exists",
        variant: "destructive",
      })
      return
    }

    setStadiums([...stadiums, currentStadium.trim()])
    setCurrentStadium("")
  }

  const handleRemoveStadium = (index: number) => {
    setStadiums(stadiums.filter((_, i) => i !== index))
  }

  // Handle form submission
  const handleGenerateSchedule = () => {
    if (typeof numTeams !== "number" || numTeams < 4) {
      toast({
        title: "Invalid number of teams",
        description: "Please enter at least 4 teams",
        variant: "destructive",
      })
      return
    }

    if (teams.length !== numTeams) {
      toast({
        title: "Team count mismatch",
        description: `You specified ${numTeams} teams but added ${teams.length}`,
        variant: "destructive",
      })
      return
    }

    if (typeof numStadiums !== "number" || numStadiums < 1) {
      toast({
        title: "Invalid number of stadiums",
        description: "Please enter at least 1 stadium",
        variant: "destructive",
      })
      return
    }

    if (stadiums.length !== numStadiums) {
      toast({
        title: "Stadium count mismatch",
        description: `You specified ${numStadiums} stadiums but added ${stadiums.length}`,
        variant: "destructive",
      })
      return
    }

    // Store data in localStorage for the next page
    localStorage.setItem("iplTeams", JSON.stringify(teams))
    localStorage.setItem("iplStadiums", JSON.stringify(stadiums))
    localStorage.setItem("iplStartDay", startDay)

    // Navigate to schedule page
    router.push("/schedule")
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-30 border-b bg-background">
        <div className="container mx-auto flex h-16 items-center px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
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
          <h1 className="text-3xl font-bold mb-6">Tournament Setup</h1>

          <Tabs defaultValue="teams" className="space-y-6">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="teams" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Teams
              </TabsTrigger>
              <TabsTrigger value="stadiums" className="flex items-center gap-2">
                <Stadium className="h-4 w-4" />
                Stadiums
              </TabsTrigger>
              <TabsTrigger value="schedule" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Schedule Settings
              </TabsTrigger>
            </TabsList>

            {/* Teams Tab */}
            <TabsContent value="teams">
              <Card>
                <CardHeader>
                  <CardTitle>Team Setup</CardTitle>
                  <CardDescription>Enter the number of teams and their names</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="numTeams">Number of Teams</Label>
                    <Input
                      id="numTeams"
                      type="number"
                      min="4"
                      max="20"
                      value={numTeams}
                      onChange={(e) => setNumTeams(e.target.value ? Number.parseInt(e.target.value) : "")}
                      placeholder="Enter number of teams"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="teamName">Team Names</Label>
                    <div className="flex gap-2">
                      <Input
                        id="teamName"
                        value={currentTeam}
                        onChange={(e) => setCurrentTeam(e.target.value)}
                        placeholder="Enter team name"
                        onKeyDown={(e) => e.key === "Enter" && handleAddTeam()}
                      />
                      <Button onClick={handleAddTeam} type="button">
                        <Plus className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Added Teams ({teams.length}/{numTeams || 0})
                    </Label>
                    <ScrollArea className="h-[200px] border rounded-md p-2">
                      {teams.length > 0 ? (
                        <div className="space-y-2">
                          {teams.map((team, index) => (
                            <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  <span className="font-semibold">{team.charAt(0)}</span>
                                </div>
                                <span>{team}</span>
                              </div>
                              <Button variant="ghost" size="sm" onClick={() => handleRemoveTeam(index)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          No teams added yet
                        </div>
                      )}
                    </ScrollArea>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={() => document.querySelector('[data-value="stadiums"]')?.click()}>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Stadiums Tab */}
            <TabsContent value="stadiums">
              <Card>
                <CardHeader>
                  <CardTitle>Stadium Setup</CardTitle>
                  <CardDescription>Enter the number of stadiums and their names</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="numStadiums">Number of Stadiums</Label>
                    <Input
                      id="numStadiums"
                      type="number"
                      min="1"
                      max="20"
                      value={numStadiums}
                      onChange={(e) => setNumStadiums(e.target.value ? Number.parseInt(e.target.value) : "")}
                      placeholder="Enter number of stadiums"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stadiumName">Stadium Names</Label>
                    <div className="flex gap-2">
                      <Input
                        id="stadiumName"
                        value={currentStadium}
                        onChange={(e) => setCurrentStadium(e.target.value)}
                        placeholder="Enter stadium name"
                        onKeyDown={(e) => e.key === "Enter" && handleAddStadium()}
                      />
                      <Button onClick={handleAddStadium} type="button">
                        <Plus className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Added Stadiums ({stadiums.length}/{numStadiums || 0})
                    </Label>
                    <ScrollArea className="h-[200px] border rounded-md p-2">
                      {stadiums.length > 0 ? (
                        <div className="space-y-2">
                          {stadiums.map((stadium, index) => (
                            <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  <Stadium className="h-4 w-4" />
                                </div>
                                <span>{stadium}</span>
                              </div>
                              <Button variant="ghost" size="sm" onClick={() => handleRemoveStadium(index)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          No stadiums added yet
                        </div>
                      )}
                    </ScrollArea>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => document.querySelector('[data-value="teams"]')?.click()}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button onClick={() => document.querySelector('[data-value="schedule"]')?.click()}>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Schedule Settings Tab */}
            <TabsContent value="schedule">
              <Card>
                <CardHeader>
                  <CardTitle>Schedule Settings</CardTitle>
                  <CardDescription>Configure your tournament schedule</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDay">Starting Day</Label>
                    <Select value={startDay} onValueChange={setStartDay}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select starting day" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Monday</SelectItem>
                        <SelectItem value="2">Tuesday</SelectItem>
                        <SelectItem value="3">Wednesday</SelectItem>
                        <SelectItem value="4">Thursday</SelectItem>
                        <SelectItem value="5">Friday</SelectItem>
                        <SelectItem value="6">Saturday</SelectItem>
                        <SelectItem value="7">Sunday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4 space-y-2">
                    <h3 className="font-medium">Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between p-2 border rounded-md">
                        <span>Teams:</span>
                        <span className="font-medium">{teams.length}</span>
                      </div>
                      <div className="flex justify-between p-2 border rounded-md">
                        <span>Stadiums:</span>
                        <span className="font-medium">{stadiums.length}</span>
                      </div>
                      <div className="flex justify-between p-2 border rounded-md">
                        <span>Starting Day:</span>
                        <span className="font-medium">
                          {
                            ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][
                              Number.parseInt(startDay) - 1
                            ]
                          }
                        </span>
                      </div>
                      <div className="flex justify-between p-2 border rounded-md">
                        <span>Total Matches:</span>
                        <span className="font-medium">{teams.length > 0 ? teams.length * (teams.length - 1) : 0}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => document.querySelector('[data-value="stadiums"]')?.click()}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button onClick={handleGenerateSchedule}>
                    Generate Schedule
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
