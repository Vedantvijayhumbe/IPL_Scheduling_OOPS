export interface Team {
  id: number
  name: string
  city: string
  homeVenue: string
}

export interface GeneratedMatch {
  matchNumber: number
  homeTeam: Team
  awayTeam: Team
  date: Date
  venue: string
  stage: string
}

// Teams data
const allTeams: Team[] = [
  { id: 1, name: "Mumbai Indians", city: "Mumbai", homeVenue: "Wankhede Stadium" },
  { id: 2, name: "Chennai Super Kings", city: "Chennai", homeVenue: "M. A. Chidambaram Stadium" },
  { id: 3, name: "Royal Challengers Bangalore", city: "Bangalore", homeVenue: "M. Chinnaswamy Stadium" },
  { id: 4, name: "Kolkata Knight Riders", city: "Kolkata", homeVenue: "Eden Gardens" },
  { id: 5, name: "Delhi Capitals", city: "Delhi", homeVenue: "Arun Jaitley Stadium" },
  { id: 6, name: "Punjab Kings", city: "Mohali", homeVenue: "PCA Stadium" },
  { id: 7, name: "Rajasthan Royals", city: "Jaipur", homeVenue: "Sawai Mansingh Stadium" },
  { id: 8, name: "Sunrisers Hyderabad", city: "Hyderabad", homeVenue: "Rajiv Gandhi Stadium" },
  { id: 9, name: "Gujarat Titans", city: "Ahmedabad", homeVenue: "Narendra Modi Stadium" },
  { id: 10, name: "Lucknow Super Giants", city: "Lucknow", homeVenue: "BRSABV Ekana Stadium" },
]

// Function to shuffle an array (Fisher-Yates algorithm)
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

// Generate IPL schedule based on the 2025 format
export function generateIPLSchedule() {
  // Shuffle teams to create random groups
  const shuffledTeams = shuffleArray(allTeams)

  // Create two virtual groups
  const groupA = shuffledTeams.slice(0, 5)
  const groupB = shuffledTeams.slice(5, 10)

  const matches: GeneratedMatch[] = []
  let matchNumber = 1

  // Start date (today)
  const startDate = new Date()
  const currentDate = new Date(startDate)

  // Function to get next match date (two matches per day)
  const getNextMatchDate = (isFirstMatch: boolean): Date => {
    const date = new Date(currentDate)

    // Set time to either 3:30 PM or 7:30 PM
    date.setHours(isFirstMatch ? 15 : 19)
    date.setMinutes(isFirstMatch ? 30 : 30)
    date.setSeconds(0)
    date.setMilliseconds(0)

    // If it's the second match of the day, move to next day for the next iteration
    if (!isFirstMatch) {
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return date
  }

  // Generate league matches

  // 1. Teams in the same group play each other twice (home and away)
  for (const group of [groupA, groupB]) {
    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        // Home match
        matches.push({
          matchNumber: matchNumber++,
          homeTeam: group[i],
          awayTeam: group[j],
          date: getNextMatchDate(matches.length % 2 === 0),
          venue: group[i].homeVenue,
          stage: "League",
        })

        // Away match
        matches.push({
          matchNumber: matchNumber++,
          homeTeam: group[j],
          awayTeam: group[i],
          date: getNextMatchDate(matches.length % 2 === 0),
          venue: group[j].homeVenue,
          stage: "League",
        })
      }
    }
  }

  // 2. Each team plays one designated team from the other group twice
  for (let i = 0; i < groupA.length; i++) {
    // Match each team in Group A with a team in Group B
    const teamA = groupA[i]
    const teamB = groupB[i]

    // Home match
    matches.push({
      matchNumber: matchNumber++,
      homeTeam: teamA,
      awayTeam: teamB,
      date: getNextMatchDate(matches.length % 2 === 0),
      venue: teamA.homeVenue,
      stage: "League",
    })

    // Away match
    matches.push({
      matchNumber: matchNumber++,
      homeTeam: teamB,
      awayTeam: teamA,
      date: getNextMatchDate(matches.length % 2 === 0),
      venue: teamB.homeVenue,
      stage: "League",
    })
  }

  // 3. Each team plays the remaining teams from the other group once
  for (let i = 0; i < groupA.length; i++) {
    for (let j = 0; j < groupB.length; j++) {
      // Skip if this is the designated team that plays twice
      if (j === i) continue

      // Randomly decide home/away
      const isHome = Math.random() > 0.5
      const homeTeam = isHome ? groupA[i] : groupB[j]
      const awayTeam = isHome ? groupB[j] : groupA[i]

      matches.push({
        matchNumber: matchNumber++,
        homeTeam,
        awayTeam,
        date: getNextMatchDate(matches.length % 2 === 0),
        venue: homeTeam.homeVenue,
        stage: "League",
      })
    }
  }

  // Add playoff matches (assuming top 4 teams qualify)
  // For simplicity, we'll use the first 4 teams from the shuffled list
  const playoffTeams = shuffledTeams.slice(0, 4)

  // Qualifier 1: Team 1 vs Team 2
  matches.push({
    matchNumber: matchNumber++,
    homeTeam: playoffTeams[0],
    awayTeam: playoffTeams[1],
    date: getNextMatchDate(matches.length % 2 === 0),
    venue: "Narendra Modi Stadium, Ahmedabad",
    stage: "Qualifier 1",
  })

  // Eliminator: Team 3 vs Team 4
  matches.push({
    matchNumber: matchNumber++,
    homeTeam: playoffTeams[2],
    awayTeam: playoffTeams[3],
    date: getNextMatchDate(matches.length % 2 === 0),
    venue: "M. A. Chidambaram Stadium, Chennai",
    stage: "Eliminator",
  })

  // Qualifier 2: Loser of Qualifier 1 vs Winner of Eliminator
  matches.push({
    matchNumber: matchNumber++,
    homeTeam: playoffTeams[1], // Assuming team 1 won Qualifier 1
    awayTeam: playoffTeams[2], // Assuming team 3 won Eliminator
    date: getNextMatchDate(matches.length % 2 === 0),
    venue: "Wankhede Stadium, Mumbai",
    stage: "Qualifier 2",
  })

  // Final: Winner of Qualifier 1 vs Winner of Qualifier 2
  matches.push({
    matchNumber: matchNumber++,
    homeTeam: playoffTeams[0], // Winner of Qualifier 1
    awayTeam: playoffTeams[2], // Winner of Qualifier 2
    date: getNextMatchDate(matches.length % 2 === 0),
    venue: "Narendra Modi Stadium, Ahmedabad",
    stage: "Final",
  })

  return {
    matches,
    teams: allTeams,
    groupA,
    groupB,
  }
}
