using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AngelBattles.Interfaces
{
    public interface IPetBattleResults
    {
        string LastTrainingTime { get; set; }
        string LastBreedingTime { get; set; }
    }
}
