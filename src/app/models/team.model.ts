export interface TeamConfig {
    teamName: string;
    submittedBy: string;
    weekStartDate: string;
    weekEndDate: string;
    reportTitle?: string;
}

export interface AppConfig {
    currentTeam: TeamConfig;
    teams?: TeamConfig[];
}