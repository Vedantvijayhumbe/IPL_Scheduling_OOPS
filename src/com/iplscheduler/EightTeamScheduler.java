package com.iplscheduler;

import java.util.*;

public class EightTeamScheduler extends IPLScheduler {
    public EightTeamScheduler(int teams, int startDay) {
        super(teams, startDay);
    }

    @Override
    public void generateMatches() {
        List<Integer> srcA = new ArrayList<>(), srcB = new ArrayList<>();
        for (int i = 1; i <= n; ++i) {
            for (int j = 1; j <= n; ++j) {
                if (i != j) {
                    srcA.add(i);
                    srcB.add(j);
                }
            }
        }

        initFirstFour(srcA, srcB);
        for (int k = 0; k < 4; ++k) {
            markScheduled(a.get(k), b.get(k), srcA, srcB);
        }

        while (!Utils.allZero(srcA) && a.get(total - 1) == 0) {
            for (int i = 0; i < srcA.size(); ++i) {
                if (srcA.get(i) != 0 && srcB.get(i) != 0) {
                    for (int j = n / 2; j < total; ++j) {
                        if (a.get(j) == 0 && canAssign(i, j, srcA, srcB)) {
                            a.set(j, srcA.get(i));
                            b.set(j, srcB.get(i));
                            markScheduled(srcA.get(i), srcB.get(i), srcA, srcB);
                            break;
                        }
                    }
                }
            }
        }
    }

    private void initFirstFour(List<Integer> srcA, List<Integer> srcB) {
        // exactly same mapping as C++
        switch (dayOne) {
            case 1:
                a.set(0, 1); b.set(0, 2);
                a.set(1, 3); b.set(1, 4);
                a.set(2, 5); b.set(2, 6);
                a.set(3, 7); b.set(3, 8);
                break;
            case 2:
                a.set(0, 1); b.set(0, 2);
                a.set(1, 3); b.set(1, 4);
                a.set(2, 1); b.set(2, 5);
                a.set(3, 2); b.set(3, 3);
                break;
            case 3:
                a.set(0, 1); b.set(0, 6);
                a.set(1, 2); b.set(1, 4);
                a.set(2, 1); b.set(2, 5);
                a.set(3, 2); b.set(3, 3);
                break;
            case 4:
                a.set(0, 1); b.set(0, 2);
                a.set(1, 3); b.set(1, 4);
                a.set(2, 1); b.set(2, 5);
                a.set(3, 2); b.set(3, 3);
                break;
            case 5:
                a.set(0, 1); b.set(0, 2);
                a.set(1, 8); b.set(1, 7);
                a.set(2, 3); b.set(2, 4);
                a.set(3, 2); b.set(3, 1);
                break;
            case 6:
                a.set(0, 1); b.set(0, 7);
                a.set(1, 5); b.set(1, 6);
                a.set(2, 8); b.set(2, 3);
                a.set(3, 2); b.set(3, 1);
                break;
            case 7:
                a.set(0, 1); b.set(0, 8);
                a.set(1, 2); b.set(1, 4);
                a.set(2, 1); b.set(2, 5);
                a.set(3, 3); b.set(3, 4);
                break;
        }
    }

    private void markScheduled(int ta, int tb, List<Integer> srcA, List<Integer> srcB) {
        for (int i = 0; i < srcA.size(); ++i) {
            if (srcA.get(i) == ta && srcB.get(i) == tb) {
                srcA.set(i, 0);
                srcB.set(i, 0);
            }
        }
    }

    private boolean canAssign(int i, int j, List<Integer> srcA, List<Integer> srcB) {
        int gap = (days.get(j) == 1 ? 2 : 1);
        return Utils.noRecent(a, srcA.get(i), j, gap)
            && Utils.noRecent(b, srcB.get(i), j, gap)
            && Utils.prevScheduled(a, j, gap)
            && Utils.prevScheduled(b, j, gap);
    }
}
