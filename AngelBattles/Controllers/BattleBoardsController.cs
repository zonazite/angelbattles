using System.Collections.Generic;
using System.Linq;
using AngelBattles.Models;
using Microsoft.AspNetCore.Mvc;

namespace AngelBattles.Controllers
{
    public class BattleBoardsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult GetBattleBoardRows(List<Battleboard> BattleboardList, List<BattleboardTurns> BattleboardTurnList)
        {
            var battleboards = BattleboardList.Where(x => x.BattleboardId != 0).OrderByDescending(x => x.Prize).ThenByDescending(x => x.IsLive).ThenByDescending(x => x.BattleboardId).ToList();
            
            var model = new BattleboardRowsViewModel { Battleboards = battleboards, BattleboardTurns = BattleboardTurnList};
            return PartialView("_StatusBoardRows", model);
        }
    }
}