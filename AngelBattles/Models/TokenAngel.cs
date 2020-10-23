using AngelBattles.Interfaces;

namespace AngelBattles.Models
{
    public class TokenAngel : IAngelToken
    {
        public int AngelId { get; set; }
        public int AngelCardSeriesId { get; set; }
        public int BattlePower { get; set; }
        public int Aura { get; set; }
        public int Experience { get; set; }
        public double Price { get; set; }
        public string CreatedTime { get; set; }
        public string Owner { get; set; }
        public string Rarity { get; set; }
        public string Description { get; set; }
        public string AuraDescription { get; set; }
        public string PngImageUri { get; set; }
    }
}
