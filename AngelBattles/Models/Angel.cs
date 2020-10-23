using AngelBattles.Interfaces;

namespace AngelBattles.Models
{
    public class Angel : IAngel, IAngelBattleResults
    {
        public int AngelId { get; set; }
        public int AngelCardSeriesId { get; set; }
        public int BattlePower { get; set; }
        public int Aura { get; set; }
        public int Experience { get; set; }
        public double Price { get; set; }
        public string CreatedTime { get; set; }
        public string LastBattleTime { get; set; }
        public string LastVsBattleTime { get; set; }
        public int LastBattleResult { get; set; }
        public string Owner { get; set; }
    }
}
