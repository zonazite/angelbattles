namespace AngelBattles.Interfaces
{
    public interface IAngel
    {
        int AngelId { get; set; }
        int AngelCardSeriesId { get; set; }
        int BattlePower { get; set; }
        int Aura { get; set; }
        int Experience { get; set; }
        double Price { get; set; }
        string CreatedTime { get; set; }
        string Owner { get; set; }
    }
}
