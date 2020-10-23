using AngelBattles.Interfaces;

namespace AngelBattles.Models
{
    public class TokenPet : IPet, IPetToken
    {
        public int PetId { get; set; }
        public int PetCardSeriesId { get; set; }
        public string CardName { get; set; }
        public string Name { get; set; }
        public int Luck { get; set; }
        public int AuraRed { get; set; }
        public int AuraBlue { get; set; }
        public int AuraYellow { get; set; }
        public string Owner { get; set; }
        public string Description { get; set; }
        public string PngImageUri { get; set; }
    }
}
