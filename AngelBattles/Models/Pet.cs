using AngelBattles.Interfaces;

namespace AngelBattles.Models
{
    public class Pet : IPet, IPetBattleResults
    {
        public int PetId { get; set; }
        public int PetCardSeriesId { get; set; }
        public string Name { get; set; }
        public int Luck { get; set; }
        public int AuraRed { get; set; }
        public int AuraBlue { get; set; }
        public int AuraYellow { get; set; }
        public string LastTrainingTime { get; set; }
        public string LastBreedingTime { get; set; }
        public string Owner { get; set; }
    }
}
