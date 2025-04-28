// Types based on the C++ classes
export interface Team {
  id: number
  name: string
  city: string
  homeVenue: string
  coach: string
  captain: string
}

export interface Venue {
  id: number
  name: string
  city: string
  capacity: number
  pitchType: string
  floodlights: boolean
}

export interface Match {
  matchId: number
  homeTeam: Team
  awayTeam: Team
  venue: Venue
  dateTime: Date
  stage: string
  isScheduled: boolean
  umpires: [string, string]
  broadcasters: string
  ticketPrice: number
}

// Sample data
export const teams: Team[] = [
  {
    id: 1,
    name: "Mumbai Indians",
    city: "Mumbai",
    homeVenue: "Wankhede Stadium",
    coach: "Mark Boucher",
    captain: "Hardik Pandya",
  },
  {
    id: 2,
    name: "Chennai Super Kings",
    city: "Chennai",
    homeVenue: "M. A. Chidambaram Stadium",
    coach: "Stephen Fleming",
    captain: "Ruturaj Gaikwad",
  },
  {
    id: 3,
    name: "Royal Challengers Bangalore",
    city: "Bangalore",
    homeVenue: "M. Chinnaswamy Stadium",
    coach: "Sanjay Bangar",
    captain: "Faf du Plessis",
  },
  {
    id: 4,
    name: "Kolkata Knight Riders",
    city: "Kolkata",
    homeVenue: "Eden Gardens",
    coach: "Chandrakant Pandit",
    captain: "Shreyas Iyer",
  },
  {
    id: 5,
    name: "Delhi Capitals",
    city: "Delhi",
    homeVenue: "Arun Jaitley Stadium",
    coach: "Ricky Ponting",
    captain: "Rishabh Pant",
  },
  {
    id: 6,
    name: "Punjab Kings",
    city: "Mohali",
    homeVenue: "PCA Stadium",
    coach: "Trevor Bayliss",
    captain: "Shikhar Dhawan",
  },
]

export const venues: Venue[] = [
  {
    id: 1,
    name: "Wankhede Stadium",
    city: "Mumbai",
    capacity: 33000,
    pitchType: "Batting",
    floodlights: true,
  },
  {
    id: 2,
    name: "M. A. Chidambaram Stadium",
    city: "Chennai",
    capacity: 38000,
    pitchType: "Spin",
    floodlights: true,
  },
  {
    id: 3,
    name: "M. Chinnaswamy Stadium",
    city: "Bangalore",
    capacity: 40000,
    pitchType: "Batting",
    floodlights: true,
  },
  {
    id: 4,
    name: "Eden Gardens",
    city: "Kolkata",
    capacity: 68000,
    pitchType: "Mixed",
    floodlights: true,
  },
  {
    id: 5,
    name: "Arun Jaitley Stadium",
    city: "Delhi",
    capacity: 48000,
    pitchType: "Pace",
    floodlights: true,
  },
  {
    id: 6,
    name: "PCA Stadium",
    city: "Mohali",
    capacity: 27000,
    pitchType: "Pace",
    floodlights: true,
  },
]

// Create sample matches
export const createInitialMatches = (): Match[] => {
  const date1 = new Date(2025, 3, 1, 14, 0) // 1-Apr-2025 14:00
  const date2 = new Date(2025, 3, 1, 20, 0) // 1-Apr-2025 20:00
  const date3 = new Date(2025, 3, 2, 14, 0) // 2-Apr-2025 14:00
  const date4 = new Date(2025, 3, 2, 20, 0) // 2-Apr-2025 20:00
  const date5 = new Date(2025, 3, 3, 14, 0) // 3-Apr-2025 14:00

  return [
    {
      matchId: 1,
      homeTeam: teams[0], // Mumbai Indians
      awayTeam: teams[1], // Chennai Super Kings
      venue: venues[0], // Wankhede Stadium
      dateTime: date1,
      stage: "Group",
      isScheduled: false,
      umpires: ["Nitin Menon", "Richard Illingworth"],
      broadcasters: "Star Sports",
      ticketPrice: 1500,
    },
    {
      matchId: 2,
      homeTeam: teams[2], // Royal Challengers Bangalore
      awayTeam: teams[3], // Kolkata Knight Riders
      venue: venues[2], // M. Chinnaswamy Stadium
      dateTime: date1,
      stage: "Group",
      isScheduled: false,
      umpires: ["Anil Chaudhary", "Kumar Dharmasena"],
      broadcasters: "Jio Cinema",
      ticketPrice: 1200,
    },
    {
      matchId: 3,
      homeTeam: teams[4], // Delhi Capitals
      awayTeam: teams[5], // Punjab Kings
      venue: venues[4], // Arun Jaitley Stadium
      dateTime: date2,
      stage: "Group",
      isScheduled: false,
      umpires: ["Chris Gaffaney", "Paul Reiffel"],
      broadcasters: "Star Sports",
      ticketPrice: 1000,
    },
    {
      matchId: 4,
      homeTeam: teams[0], // Mumbai Indians
      awayTeam: teams[2], // Royal Challengers Bangalore
      venue: venues[0], // Wankhede Stadium
      dateTime: date3,
      stage: "Group",
      isScheduled: false,
      umpires: ["Marais Erasmus", "Richard Kettleborough"],
      broadcasters: "Jio Cinema",
      ticketPrice: 1800,
    },
    {
      matchId: 5,
      homeTeam: teams[1], // Chennai Super Kings
      awayTeam: teams[3], // Kolkata Knight Riders
      venue: venues[1], // M. A. Chidambaram Stadium
      dateTime: date3,
      stage: "Group",
      isScheduled: false,
      umpires: ["Rod Tucker", "Bruce Oxenford"],
      broadcasters: "Star Sports",
      ticketPrice: 1300,
    },
    {
      matchId: 6,
      homeTeam: teams[4], // Delhi Capitals
      awayTeam: teams[0], // Mumbai Indians
      venue: venues[4], // Arun Jaitley Stadium
      dateTime: date4,
      stage: "Qualifier",
      isScheduled: false,
      umpires: ["Nitin Menon", "Richard Illingworth"],
      broadcasters: "Star Sports/Jio",
      ticketPrice: 2500,
    },
    {
      matchId: 7,
      homeTeam: teams[2], // Royal Challengers Bangalore
      awayTeam: teams[5], // Punjab Kings
      venue: venues[2], // M. Chinnaswamy Stadium
      dateTime: date5,
      stage: "Eliminator",
      isScheduled: false,
      umpires: ["Anil Chaudhary", "Kumar Dharmasena"],
      broadcasters: "Star Sports/Jio",
      ticketPrice: 2200,
    },
  ]
}
