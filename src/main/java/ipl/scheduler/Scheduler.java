package ipl.scheduler;

import ipl.model.Match;
import ipl.model.Team;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class Scheduler {
    private List<Team> teams;
    private List<Match> matches;

    public Scheduler(List<Team> teams) {
        this.teams = teams;
        this.matches = new ArrayList<>();
    }

    public void createSchedule(LocalDate startDate) {
        int numTeams = teams.size();
        LocalDate currentDate = startDate;

        // Simple round robin (each team plays every other team once)
        for (int i = 0; i < numTeams; i++) {
            for (int j = i + 1; j < numTeams; j++) {
                matches.add(new Match(teams.get(i), teams.get(j), currentDate));
                currentDate = currentDate.plusDays(1); // Next match on next day
            }
        }
    }

    public void displaySchedule() {
        for (Match match : matches) {
            System.out.println(match.getDetails());
        }
    }
}
