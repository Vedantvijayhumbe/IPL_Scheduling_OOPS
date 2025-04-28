package com.iplscheduler;

import java.util.List;

public final class DayTimeScheduler {
    private DayTimeScheduler() { /* no instances */ }

    public static void scheduleDays(List<Integer> days, int dayOne, int gapChoice) {
        int total = days.size();
        if (gapChoice == 1) {
            int i = 0;
            while (i < total) {
                if (i == 0) {
                    days.set(i, dayOne);
                    i++;
                } else if (days.get(i - 1) < 5) {
                    days.set(i, days.get(i - 1) + 1);
                    i++;
                } else {
                    if (i == total - 1) {
                        days.set(i, (days.get(i - 1) % 7) + 1);
                        i++;
                    } else if (days.get(i - 1) < 7) {
                        days.set(i, days.get(i - 1) + 1);
                        days.set(i + 1, days.get(i - 1)); 
                        i += 2;
                    } else {
                        days.set(i, 1);
                        i++;
                    }
                }
            }
        } else if (gapChoice == 2) {
            int i = 0;
            while (i < total) {
                if (i == 0) {
                    days.set(i, dayOne);
                } else {
                    days.set(i, ((days.get(i - 1) + 1) % 7) + 1);
                }
                i++;
            }
        } else {
            int i = 0;
            while (i < total) {
                if (i == 0) {
                    days.set(i, dayOne);
                } else {
                    days.set(i, (days.get(i - 1) % 7) + 1);
                }
                i++;
            }
        }
    }

    public static void scheduleTimes(List<String> times, List<Integer> days, int timeChoice) {
        int total = times.size();
        if (timeChoice == 1) {
            for (int i = 0; i < total; ++i) {
                if (i == total - 1 || days.get(i) <= 5) {
                    times.set(i, "E");
                } else if ("A".equals(times.get(i - 1))) {
                    times.set(i, "E");
                } else {
                    times.set(i, "A");
                }
            }
        } else {
            for (int i = 0; i < total; ++i) {
                times.set(i, "E");
            }
        }
    }
}
