package com.iplscheduler;

import java.util.*;

public class GeneralScheduler extends IPLScheduler {
    public GeneralScheduler(int teams, int startDay) {
        super(teams, startDay);
    }

    @Override
    public void generateMatches() {
        List<Integer> arr = new ArrayList<>();
        for (int i = 1; i <= n; ++i) arr.add(i);

        int half = n / 2;
        int idxA = 0, idxB = 0;

        // First round
        for (int i = 0; i < half; ++i) a.set(idxA++, arr.get(i));
        for (int i = n - 1; i >= half; --i) b.set(idxB++, arr.get(i));

        // Rotate for subsequent rounds
        for (int r = 0; r < n - 2; ++r) {
            Utils.rotate(arr);
            for (int i = 0; i < half; ++i) a.set(idxA++, arr.get(i));
            for (int i = n - 1; i >= half; --i) b.set(idxB++, arr.get(i));
        }

        // Reverse fixtures
        int base = idxA;
        for (int i = 0; i < base; ++i) {
            a.set(idxA, b.get(i));
            b.set(idxB, a.get(i));
            idxA++;
            idxB++;
        }
    }
}
