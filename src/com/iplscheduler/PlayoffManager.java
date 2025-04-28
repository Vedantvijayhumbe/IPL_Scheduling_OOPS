package com.iplscheduler;

import java.util.*;

public class PlayoffManager {
    // --- Singleton boilerplate ---
    private static PlayoffManager instance;
    private PlayoffManager() { }
    public static PlayoffManager getInstance() {
        if (instance == null) {
            instance = new PlayoffManager();
        }
        return instance;
    }
    // -----------------------------

    public void run(int nTeams, List<String> teamNames) {
        Scanner sc = new Scanner(System.in);
        System.out.println("\nPLAYOFFS");
        List<String> venues = new ArrayList<>(Arrays.asList(new String[4]));
        for (int i = 0; i < 4; ++i) {
            String prompt;
            switch (i) {
                case 0: prompt = "Enter stadium for Qualifier 1: "; break;
                case 1: prompt = "Enter stadium for Eliminator: "; break;
                case 2: prompt = "Enter stadium for Qualifier 2: "; break;
                default: prompt = "Enter stadium for Final: ";
            }
            System.out.print(prompt);
            venues.set(i, sc.nextLine());
        }

        List<String> winners = new ArrayList<>(Arrays.asList(new String[10]));
        System.out.println("\nEnter top 4 teams in order:");
        for (int i = 0; i < 4; ++i) {
            System.out.printf("Position %d: ", i + 1);
            winners.set(i, sc.nextLine());
        }

        // Functional interface for playing a match
        @FunctionalInterface
        interface MatchPlay {
            void play(int x, int y, int vIdx, int wIdx, int lIdx);
        }

        MatchPlay playMatch = (x, y, vIdx, wIdx, lIdx) -> {
            System.out.printf(
                "%s vs %s at %s 7:30 pm. Winner: ",
                winners.get(x), winners.get(y), venues.get(vIdx)
            );
            String win = sc.nextLine();
            winners.set(wIdx, win);
            if (lIdx >= 0) {
                String loser = win.equals(winners.get(x)) ? winners.get(y) : winners.get(x);
                winners.set(lIdx, loser);
            }
        };

        playMatch.play(0, 1, 0, 4, 5);
        playMatch.play(2, 3, 1, 6, 7);
        playMatch.play(5, 6, 2, 8, -1);
        System.out.printf(
            "%s vs %s at %s 7:30 pm. Winner: ",
            winners.get(4), winners.get(8), venues.get(3)
        );
        winners.set(9, sc.nextLine());

        System.out.println("\nThe winner of IPL is " + winners.get(9) + "!");
    }
}
