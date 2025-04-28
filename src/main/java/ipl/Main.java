package ipl;

import ipl.model.Team;
import ipl.scheduler.Scheduler;
import ipl.utils.TeamData;

import java.time.LocalDate;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<Team> teams = TeamData.getTeams();
        Scheduler scheduler = new Scheduler(teams);

        LocalDate startDate = LocalDate.of(2025, 5, 1); // example start date
        scheduler.createSchedule(startDate);

        System.out.println("===== IPL 2025 Schedule =====");
        scheduler.displaySchedule();
    }
}
