import type { Match } from "./data"

// Interface for scheduling strategies
export interface ISchedulingStrategy {
  scheduleMatches: (matches: Match[]) => Match[]
  getStrategyName: () => string
}

// Round Robin Scheduling Strategy
export class RoundRobinScheduling implements ISchedulingStrategy {
  scheduleMatches(matches: Match[]): Match[] {
    console.log("Applying Round Robin Scheduling...")

    const scheduledMatches = [...matches]

    for (let i = 0; i < scheduledMatches.length; i++) {
      if (!this.isConflict(scheduledMatches[i], scheduledMatches.slice(0, i))) {
        scheduledMatches[i].isScheduled = true
        console.log(`Scheduled Match ${scheduledMatches[i].matchId}`)
      }
    }

    return scheduledMatches
  }

  getStrategyName(): string {
    return "Round Robin"
  }

  private isConflict(newMatch: Match, scheduledMatches: Match[]): boolean {
    for (const match of scheduledMatches) {
      if (match.isScheduled) {
        // Check venue conflict
        if (match.venue.id === newMatch.venue.id && this.isSameDay(match.dateTime, newMatch.dateTime)) {
          console.log(`Venue conflict detected for Match ${newMatch.matchId} at ${newMatch.venue.name}`)
          return true
        }

        // Check team conflict
        if (
          (match.homeTeam.id === newMatch.homeTeam.id ||
            match.awayTeam.id === newMatch.awayTeam.id ||
            match.homeTeam.id === newMatch.awayTeam.id ||
            match.awayTeam.id === newMatch.homeTeam.id) &&
          this.isSameDay(match.dateTime, newMatch.dateTime)
        ) {
          console.log(`Team conflict detected for Match ${newMatch.matchId}`)
          return true
        }
      }
    }
    return false
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    )
  }
}

// Priority Scheduling Strategy
export class PriorityScheduling implements ISchedulingStrategy {
  scheduleMatches(matches: Match[]): Match[] {
    console.log("Applying Priority Scheduling...")

    // Sort matches by priority (Finals first, then qualifiers, then group)
    const sortedMatches = [...matches].sort((a, b) => this.getStagePriority(b.stage) - this.getStagePriority(a.stage))

    for (let i = 0; i < sortedMatches.length; i++) {
      if (!this.isConflict(sortedMatches[i], sortedMatches.slice(0, i))) {
        sortedMatches[i].isScheduled = true
        console.log(`Scheduled Match ${sortedMatches[i].matchId} (${sortedMatches[i].stage})`)
      }
    }

    return sortedMatches
  }

  getStrategyName(): string {
    return "Priority"
  }

  private getStagePriority(stage: string): number {
    if (stage === "Final") return 3
    if (stage === "Qualifier" || stage === "Eliminator") return 2
    return 1 // Group matches
  }

  private isConflict(newMatch: Match, scheduledMatches: Match[]): boolean {
    for (const match of scheduledMatches) {
      if (match.isScheduled) {
        if (match.venue.id === newMatch.venue.id && this.isSameDay(match.dateTime, newMatch.dateTime)) {
          return true
        }
      }
    }
    return false
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    )
  }
}
