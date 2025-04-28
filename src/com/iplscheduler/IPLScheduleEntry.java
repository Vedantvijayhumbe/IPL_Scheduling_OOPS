package com.iplscheduler;

public class IPLScheduleEntry {
    private String day;    // e.g., "Monday"
    private String time;   // e.g., "7:30 pm"
    private String teamA;  // e.g., "MI"
    private String teamB;  // e.g., "RCB"
    private String venue;  // e.g., "Chennai"

    public IPLScheduleEntry() { }

    // Getters & setters
    public String getDay() { return day; }
    public void setDay(String day) { this.day = day; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public String getTeamA() { return teamA; }
    public void setTeamA(String teamA) { this.teamA = teamA; }

    public String getTeamB() { return teamB; }
    public void setTeamB(String teamB) { this.teamB = teamB; }

    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }

    @Override
    public String toString() {
        return String.format("%s | %s | (%s vs %s) | %s",
            day, time, teamA, teamB, venue);
    }
}
