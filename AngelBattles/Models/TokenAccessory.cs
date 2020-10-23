using AngelBattles.Interfaces;
using System;

namespace AngelBattles.Models
{
    public class TokenAccessory : IAccessory, IAccessoryToken
    {
        public int AccessoryId { get; set; }
        public int AccessorySeriesId { get; set; }
        public string Owner { get; set; }
        public string PngImageUri { get; set; }
    }
}
