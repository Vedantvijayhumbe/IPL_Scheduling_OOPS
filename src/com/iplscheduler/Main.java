package com.iplscheduler;

import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.println("Welcome to the IPL SCHEDULER.");
        System.out.print("Enter number of teams: ");
        int n = Integer.parseInt(sc.nextLine());

        List<String> teamNames = new ArrayList<>();
        for (int i = 1; i <= n; ++i) {
            System.out.printf("Enter name for team %d: ", i);
            teamNames.add(sc.nextLine());
        }

        System.out.print("Enter number of stadiums: ");
        int m = Integer.parseInt(sc.nextLine());
        List<String> venueNames = new ArrayList<>();
        for (int i = 1; i <= m; ++i) {
            System.out.printf("Enter name for stadium %d: ", i);
            venueNames.add(sc.nextLine());
        }

        System.out.print("Enter starting day (1=Monday...7=Sunday): ");
        int start = Integer.parseInt(sc.nextLine());

        IPLScheduler scheduler;
        if (n == 8) {
            scheduler = new EightTeamScheduler(n, start);
        } else {
            scheduler = new GeneralScheduler(n, start);
        }

        scheduler.setTeamNames(teamNames);
        scheduler.setVenueNames(venueNames);
        scheduler.generateMatches();

        int dayGap = (n < 8 ? 2 : 1);
        int timeChoice = (n < 8 ? 2 : 1);
        scheduler.scheduleDayTime(dayGap, timeChoice);

        System.out.println("\nTHE IPL SCHEDULE");
        scheduler.printSchedule();

        // use Singleton
        PlayoffManager.getInstance().run(n, teamNames);
    }
}
