namespace AngelBattles.Models
{
    public class SponsoredLeaderboard
    {
        public int LeaderboardId { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public string IsLive { get; set; }
        public string Sponsor { get; set; }
        public string Prize { get; set; }
        public string Message { get; set; }
        public string MedalsClaimed { get; set; }
    }
}
