using AngelBattles.Interfaces;

namespace AngelBattles.Models
{
    public class Accessory : IAccessory
    {
        public int AccessoryId { get; set; }
        public int AccessorySeriesId { get; set; }
        public string Owner { get; set; }
    }
}
