using System.Collections.Generic;

namespace AngelBattles.Models
{
    public class BattleboardRowsViewModel
    {
        public IEnumerable<Battleboard> Battleboards { get; set; }
        public IEnumerable<BattleboardTurns> BattleboardTurns { get; set; }
    }
}
