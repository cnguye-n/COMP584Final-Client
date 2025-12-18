export interface TeamLeader {
  teamName: string;
  leaderUserName: string;
}

export interface HomeSummaryData {
  numberOfTeams: number;
  numberOfUsers: number;
  numberOfLeaders: number;
  teams: string[];
  teamLeaders: TeamLeader[];
}
