namespace AngelBattles.Interfaces
{
    public interface IAccessory
    {
        int AccessoryId { get; set; }
        int AccessorySeriesId { get; set; }
        string Owner { get; set; }
    }
}
