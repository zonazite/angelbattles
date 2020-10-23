using System.Collections.Generic;

namespace AngelBattles.Models
{

    public class AngelCardRowsViewModel
    {
        public bool ShowComingSoonCards { get; set; } = false;

        public IEnumerable<Angel> Angels { get; set; }
        public IEnumerable<AngelNextBattleTimes> AngelsNextBattleTimes { get; set; }
    }
}
