package ipl.model;

import java.time.LocalDate;

public class Match {
    private Team team1;
    private Team team2;
    private LocalDate matchDate;

    public Match(Team team1, Team team2, LocalDate matchDate) {
        this.team1 = team1;
        this.team2 = team2;
        this.matchDate = matchDate;
    }

    public String getDetails() {
        return matchDate + " : " + team1.getName() + " vs " + team2.getName();
    }
}
