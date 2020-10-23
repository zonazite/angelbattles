using System.Collections.Generic;

namespace AngelBattles.Models
{
    public class SponsoredLeaderboardRowsViewModel
    {
        public IEnumerable<int> UniqueLeaderboardIds { get; set; }
        public IEnumerable<SponsoredLeaderboard> SponsoredLeaderboard { get; set; }
        public IEnumerable<SponsoredLeaderboardTeams> SponsoredLeaderboardTeams { get; set; }
    }
}
