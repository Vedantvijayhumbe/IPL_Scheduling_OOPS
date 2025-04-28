package ipl.utils;

import ipl.model.Team;
import java.util.ArrayList;
import java.util.List;

public class TeamData {
    public static List<Team> getTeams() {
        List<Team> teams = new ArrayList<>();
        teams.add(new Team("Mumbai Indians"));
        teams.add(new Team("Chennai Super Kings"));
        teams.add(new Team("Royal Challengers Bangalore"));
        teams.add(new Team("Kolkata Knight Riders"));
        teams.add(new Team("Delhi Capitals"));
        teams.add(new Team("Sunrisers Hyderabad"));
        teams.add(new Team("Punjab Kings"));
        teams.add(new Team("Rajasthan Royals"));
        return teams;
    }
}
