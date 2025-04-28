import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Calendar, Users, StickerIcon as Stadium, ArrowRight } from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-700 dark:to-blue-950">
      <header className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-white">
          <Trophy className="h-6 w-6" />
          <span className="font-bold text-lg">IPL Scheduler</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12 flex flex-col items-center justify-center">
        <div className="max-w-3xl w-full text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white">IPL Scheduling System</h1>
          <p className="text-xl text-white/80">
            Create your own IPL tournament schedule with our advanced scheduling algorithm
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-white">
              <CardContent className="p-6 flex flex-col items-center">
                <Users className="h-12 w-12 mb-4 text-purple-300" />
                <h3 className="text-xl font-bold">Teams</h3>
                <p className="text-white/70 text-center mt-2">Add your teams and customize their details</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-white">
              <CardContent className="p-6 flex flex-col items-center">
                <Stadium className="h-12 w-12 mb-4 text-purple-300" />
                <h3 className="text-xl font-bold">Venues</h3>
                <p className="text-white/70 text-center mt-2">Set up stadiums where matches will be played</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-white">
              <CardContent className="p-6 flex flex-col items-center">
                <Calendar className="h-12 w-12 mb-4 text-purple-300" />
                <h3 className="text-xl font-bold">Schedule</h3>
                <p className="text-white/70 text-center mt-2">Generate a complete tournament schedule</p>
              </CardContent>
            </Card>
          </div>

          <Button asChild size="lg" className="mt-8 bg-white text-purple-700 hover:bg-white/90">
            <Link href="/setup">
              Create Schedule
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </main>

      <footer className="border-t border-white/20 py-6 text-center text-white text-sm">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} IPL Scheduler. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
