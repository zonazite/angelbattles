namespace AngelBattles.Models
{
    public class Battleboard
    {
        public int BattleboardId { get; set; }
        public int Turn { get; set; }
        public string IsLive { get; set; }
        public string Prize { get; set; }
        public int NumTeams { get; set; }
        public int NumTiles { get; set; }
        public int CreatedBarriers { get; set; }
        public int Restrictions { get; set; }
        public string LastMoveTime { get; set; }
        public int NumTeams1 { get; set; }
        public int NumTeams2 { get; set; }
        public int Monster1 { get; set; }
        public int Monster2 { get; set; }
    }
}
