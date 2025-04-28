/**
 * IPL Scheduler - JavaScript implementation of the C++ scheduling algorithm
 *
 * This class implements the scheduling algorithm for IPL matches
 * using the Singleton design pattern and encapsulation principles.
 */

// Singleton pattern: Only one instance of IPLScheduler should exist
let instance: IPLScheduler | null = null

// Match interface - encapsulates match data
interface Match {
  id: number
  day: string
  time: string
  teamA: string
  teamB: string
  venue: string
}

// Utility class with static helper functions
class Utils {
  // Check if all elements in array are zero
  static allZero(arr: number[]): boolean {
    return arr.every((v) => v === 0)
  }

  // Check if a team has not played recently
  static noRecent(sched: number[], team: number, pos: number, gap: number): boolean {
    for (let k = 1; k <= gap; k++) {
      if (pos - k < 0) break
      if (sched[pos - k] === team) return false
    }
    return true
  }

  // Check if previous slots are scheduled
  static prevScheduled(sched: number[], pos: number, gap: number): boolean {
    for (let k = 1; k <= gap; k++) {
      if (pos - k < 0) break
      if (sched[pos - k] === 0) return false
    }
    return true
  }

  // Rotate array for round-robin scheduling
  static rotate(arr: number[]): void {
    const n = arr.length
    const last = arr[n - 1]
    for (let i = n - 1; i > 1; i--) {
      arr[i] = arr[i - 1]
    }
    arr[1] = last
  }
}

// Static class for scheduling days and times
class DayTimeScheduler {
  // Schedule days based on starting day and gap choice
  static scheduleDays(days: number[], dayOne: number, gapChoice: number): void {
    const total = days.length

    if (gapChoice === 1) {
      let i = 0
      while (i < total) {
        if (i === 0) {
          days[i] = dayOne
          i++
        } else if (days[i - 1] < 5) {
          days[i] = days[i - 1] + 1
          i++
        } else {
          if (i === total - 1) {
            days[i] = (days[i - 1] % 7) + 1
            i++
          } else if (days[i - 1] < 7) {
            days[i] = days[i - 1] + 1
            days[i + 1] = days[i - 1] + 1
            i += 2
          } else {
            days[i] = 1
            i++
          }
        }
      }
    } else if (gapChoice === 2) {
      let i = 0
      while (i < total) {
        if (i === 0) {
          days[i] = dayOne
          i++
        } else {
          days[i] = ((days[i - 1] + 2 - 1) % 7) + 1
          i++
        }
      }
    } else {
      let i = 0
      while (i < total) {
        if (i === 0) {
          days[i] = dayOne
          i++
        } else {
          days[i] = (days[i - 1] % 7) + 1
          i++
        }
      }
    }
  }

  // Schedule match times (A = afternoon, E = evening)
  static scheduleTimes(times: string[], days: number[], timeChoice: number): void {
    const total = times.length

    if (timeChoice === 1) {
      for (let i = 0; i < total; i++) {
        if (i === total - 1 || days[i] <= 5) {
          times[i] = "E"
        } else if (times[i - 1] === "A") {
          times[i] = "E"
        } else {
          times[i] = "A"
        }
      }
    } else {
      for (let i = 0; i < total; i++) {
        times[i] = "E"
      }
    }
  }
}

// Main IPL Scheduler class - implements Singleton pattern
export class IPLScheduler {
  private n: number
  private dayOne: number
  private total: number
  private days: number[]
  private times: string[]
  private a: number[]
  private b: number[]
  private teamNames: string[]
  private venueNames: string[]

  constructor(teams: number, startDay: number) {
    // Singleton pattern implementation
    if (instance) {
      return instance
    }

    this.n = teams
    this.dayOne = startDay
    this.total = teams * (teams - 1)
    this.days = new Array(this.total).fill(0)
    this.times = new Array(this.total).fill("")
    this.a = new Array(this.total).fill(0)
    this.b = new Array(this.total).fill(0)
    this.teamNames = []
    this.venueNames = []

    instance = this
  }

  // Set team names - dependency injection
  setTeamNames(names: string[]): void {
    this.teamNames = names
  }

  // Set venue names - dependency injection
  setVenueNames(venues: string[]): void {
    this.venueNames = venues
  }

  // Generate matches based on number of teams
  generateMatches(): void {
    if (this.n === 8) {
      this.generateEightTeamSchedule()
    } else {
      this.generateGeneralSchedule()
    }
  }

  // General round-robin scheduling algorithm
  private generateGeneralSchedule(): void {
    const arr = Array.from({ length: this.n }, (_, i) => i + 1)
    const half = Math.floor(this.n / 2)
    let idxA = 0,
      idxB = 0

    for (let i = 0; i < half; i++) {
      this.a[idxA++] = arr[i]
    }

    for (let i = this.n - 1; i >= half; i--) {
      this.b[idxB++] = arr[i]
    }

    for (let r = 0; r < this.n - 2; r++) {
      Utils.rotate(arr)

      for (let i = 0; i < half; i++) {
        this.a[idxA++] = arr[i]
      }

      for (let i = this.n - 1; i >= half; i--) {
        this.b[idxB++] = arr[i]
      }
    }

    const base = idxA
    for (let i = 0; i < base; i++) {
      this.a[idxA] = this.b[i]
      this.b[idxB] = this.a[i]
      idxA++
      idxB++
    }
  }

  // Special 8-team scheduling algorithm
  private generateEightTeamSchedule(): void {
    const srcA: number[] = []
    const srcB: number[] = []

    // Generate all possible matches
    for (let i = 1; i <= this.n; i++) {
      for (let j = 1; j <= this.n; j++) {
        if (i !== j) {
          srcA.push(i)
          srcB.push(j)
        }
      }
    }

    // Initialize first four matches based on starting day
    this.initFirstFour(srcA, srcB)

    // Mark scheduled matches
    for (let k = 0; k < 4; k++) {
      this.markScheduled(this.a[k], this.b[k], srcA, srcB)
    }

    // Schedule remaining matches
    while (!Utils.allZero(srcA) && this.a[this.a.length - 1] === 0) {
      for (let i = 0; i < srcA.length; i++) {
        if (srcA[i] && srcB[i]) {
          for (let j = Math.floor(this.n / 2); j < this.total; j++) {
            if (this.a[j] === 0 && this.canAssign(i, j, srcA, srcB)) {
              this.a[j] = srcA[i]
              this.b[j] = srcB[i]
              this.markScheduled(srcA[i], srcB[i], srcA, srcB)
              break
            }
          }
        }
      }
    }
  }

  // Initialize first four matches for 8-team schedule
  private initFirstFour(srcA: number[], srcB: number[]): void {
    if (this.dayOne === 1) {
      this.a[0] = 1
      this.b[0] = 2
      this.a[1] = 3
      this.b[1] = 4
      this.a[2] = 5
      this.b[2] = 6
      this.a[3] = 7
      this.b[3] = 8
    } else if (this.dayOne === 2) {
      this.a[0] = 1
      this.b[0] = 2
      this.a[1] = 3
      this.b[1] = 4
      this.a[2] = 1
      this.b[2] = 5
      this.a[3] = 2
      this.b[3] = 3
    } else if (this.dayOne === 3) {
      this.a[0] = 1
      this.b[0] = 6
      this.a[1] = 2
      this.b[1] = 4
      this.a[2] = 1
      this.b[2] = 5
      this.a[3] = 2
      this.b[3] = 3
    } else if (this.dayOne === 4) {
      this.a[0] = 1
      this.b[0] = 2
      this.a[1] = 3
      this.b[1] = 4
      this.a[2] = 1
      this.b[2] = 5
      this.a[3] = 2
      this.b[3] = 3
    } else if (this.dayOne === 5) {
      this.a[0] = 1
      this.b[0] = 2
      this.a[1] = 8
      this.b[1] = 7
      this.a[2] = 3
      this.b[2] = 4
      this.a[3] = 2
      this.b[3] = 1
    } else if (this.dayOne === 6) {
      this.a[0] = 1
      this.b[0] = 7
      this.a[1] = 5
      this.b[1] = 6
      this.a[2] = 8
      this.b[2] = 3
      this.a[3] = 2
      this.b[3] = 1
    } else if (this.dayOne === 7) {
      this.a[0] = 1
      this.b[0] = 8
      this.a[1] = 2
      this.b[1] = 4
      this.a[2] = 1
      this.b[2] = 5
      this.a[3] = 3
      this.b[3] = 4
    }
  }

  // Mark a match as scheduled
  private markScheduled(ta: number, tb: number, srcA: number[], srcB: number[]): void {
    for (let i = 0; i < srcA.length; i++) {
      if (srcA[i] === ta && srcB[i] === tb) {
        srcA[i] = 0
        srcB[i] = 0
      }
    }
  }

  // Check if a match can be assigned to a slot
  private canAssign(i: number, j: number, srcA: number[], srcB: number[]): boolean {
    const gap = this.days[j] === 1 ? 2 : 1
    return (
      Utils.noRecent(this.a, srcA[i], j, gap) &&
      Utils.noRecent(this.b, srcB[i], j, gap) &&
      Utils.prevScheduled(this.a, j, gap) &&
      Utils.prevScheduled(this.b, j, gap)
    )
  }

  // Schedule days and times for matches
  scheduleDayTime(dayGapChoice: number, timeChoice: number): void {
    DayTimeScheduler.scheduleDays(this.days, this.dayOne, dayGapChoice)
    DayTimeScheduler.scheduleTimes(this.times, this.days, timeChoice)
  }

  // Get default venue name
  private defaultVenue(idx: number): string {
    return `Stadium ${(idx % this.n) + 1}`
  }

  // Get day name from day number
  private getDayName(day: number): string {
    const days = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    return days[day]
  }

  // Get time string from time code
  private getTimeString(timeCode: string): string {
    return timeCode === "A" ? "3:30 PM" : "7:30 PM"
  }

  // Get the complete schedule
  getSchedule(): Match[] {
    const schedule: Match[] = []

    for (let i = 0; i < this.total; i++) {
      if (this.a[i] === 0 || this.b[i] === 0) continue

      const day = this.getDayName(this.days[i])
      const time = this.getTimeString(this.times[i])
      const teamA = this.teamNames[this.a[i] - 1]
      const teamB = this.teamNames[this.b[i] - 1]
      const venue = this.venueNames.length > 0 ? this.venueNames[i % this.venueNames.length] : this.defaultVenue(i)

      schedule.push({
        id: i + 1,
        day,
        time,
        teamA,
        teamB,
        venue,
      })
    }

    return schedule
  }

  // Reset the singleton instance (for testing purposes)
  static resetInstance(): void {
    instance = null
  }
}
