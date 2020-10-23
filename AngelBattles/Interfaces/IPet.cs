namespace AngelBattles.Interfaces
{
    public interface IPet
    {
         int PetId { get; set; }
         int PetCardSeriesId { get; set; }
         string Name { get; set; }
         int Luck { get; set; }
         int AuraRed { get; set; }
         int AuraBlue { get; set; }
         int AuraYellow { get; set; }
         string Owner { get; set; }
    }
}
