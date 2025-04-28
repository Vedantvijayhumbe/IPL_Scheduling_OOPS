package com.iplscheduler;

import java.util.*;

public abstract class IPLScheduler {
    protected final int n, dayOne, total;
    protected final List<Integer> days;
    protected final List<String> times;
    protected final List<Integer> a, b;
    protected List<String> teamNames;
    protected List<String> venueNames;

    public IPLScheduler(int teams, int startDay) {
        this.n = teams;
        this.dayOne = startDay;
        this.total = teams * (teams - 1);
        this.days = new ArrayList<>(Collections.nCopies(total, 0));
        this.times = new ArrayList<>(Collections.nCopies(total, ""));
        this.a = new ArrayList<>(Collections.nCopies(total, 0));
        this.b = new ArrayList<>(Collections.nCopies(total, 0));
    }

    public abstract void generateMatches();

    public void setTeamNames(List<String> names) {
        this.teamNames = names;
    }

    public void setVenueNames(List<String> venues) {
        this.venueNames = venues;
    }

    public void scheduleDayTime(int dayGapChoice, int timeChoice) {
        DayTimeScheduler.scheduleDays(days, dayOne, dayGapChoice);
        DayTimeScheduler.scheduleTimes(times, days, timeChoice);
    }

    public void printSchedule() {
        String[] dayNames = {
            "", "Monday", "Tuesday", "Wednesday",
            "Thursday", "Friday", "Saturday", "Sunday"
        };
        for (int i = 0; i < total; ++i) {
            String d = dayNames[days.get(i)];
            String t = "A".equals(times.get(i)) ? "3:30 pm" : "7:30 pm";
            String ta = teamNames.get(a.get(i) - 1);
            String tb = teamNames.get(b.get(i) - 1);
            String vn = venueNames.isEmpty()
                ? defaultVenue(i)
                : venueNames.get(i % venueNames.size());

            System.out.printf(
                "Match %d | Day: %s | Time: %s | Match: (%s vs %s) | Venue: %s%n",
                i + 1, d, t, ta, tb, vn
            );
        }
    }

    protected String defaultVenue(int idx) {
        return "Stadium " + ((idx % n) + 1);
    }
}
