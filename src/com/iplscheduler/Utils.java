package com.iplscheduler;

import java.util.List;

public final class Utils {
    private Utils() { /* no instances */ }

    public static boolean allZero(List<Integer> arr) {
        for (int v : arr) if (v != 0) return false;
        return true;
    }

    public static boolean noRecent(List<Integer> sched, int team, int pos, int gap) {
        for (int k = 1; k <= gap; ++k) {
            if (pos - k < 0) break;
            if (sched.get(pos - k) == team) return false;
        }
        return true;
    }

    public static boolean prevScheduled(List<Integer> sched, int pos, int gap) {
        for (int k = 1; k <= gap; ++k) {
            if (pos - k < 0) break;
            if (sched.get(pos - k) == 0) return false;
        }
        return true;
    }

    public static void rotate(List<Integer> arr) {
        int n = arr.size();
        int last = arr.get(n - 1);
        for (int i = n - 1; i > 1; --i) {
            arr.set(i, arr.get(i - 1));
        }
        arr.set(1, last);
    }
}
