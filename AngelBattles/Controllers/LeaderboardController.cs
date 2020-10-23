using AngelBattles.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace AngelBattles.Controllers
{
    public class LeaderboardController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult GetLeaderboardRows(List<Leaderboard> LeaderboardList)
        {
            var ordered = LeaderboardList.OrderBy(x => x.Position).ToList();

            var model = new LeaderboardRowsViewModel { Leaderboard = ordered };
            return PartialView("_LeaderboardRows", model);
        }

        [HttpPost]
        public IActionResult GetAngelCardRows(List<Angel> AngelsList)
        {
            var model = new AngelCardRowsViewModel { Angels = AngelsList };
            return PartialView("_AngelCardRows", model);
        }

        /// <summary>
        /// 0 - Barakiel only
        /// 1 - Azazel and below
        /// 2 - Gabriel and below
        /// 3 - Melchizedek and below
        /// </summary>
        /// <param name="AngelsList"></param>
        /// <param name="limitCardSeriesId"></param>
        /// <returns></returns>
        [HttpPost]
        public IActionResult GetAngelCardRowsLimitCardSeriesId(List<Angel> AngelsList, int limitCardSeriesId)
        {
            IEnumerable<Angel> limitedAngels = null;

            switch (limitCardSeriesId)
            {
                case 0:
                    limitedAngels = AngelsList.Where(x => x.AngelCardSeriesId == 0);
                    break;
                case 1:
                    // Azazel and below
                    limitedAngels = AngelsList.Where(x => x.AngelCardSeriesId <= 8 && x.AngelCardSeriesId != 2 && x.AngelCardSeriesId != 3);
                    break;
                case 2:
                    // Gabriel and belwo
                    limitedAngels = AngelsList.Where(x => x.AngelCardSeriesId <= 15 && x.AngelCardSeriesId != 2 && x.AngelCardSeriesId != 3);
                    break;
                case 3:
                    // Melchizedek and below
                    limitedAngels = AngelsList.Where(x => x.AngelCardSeriesId <= 18 && x.AngelCardSeriesId != 2 && x.AngelCardSeriesId != 3);
                    break;
                default:
                    limitedAngels = AngelsList;
                    break;
            }

            var model = new AngelCardRowsViewModel { Angels = limitedAngels };
            return PartialView("_AngelCardRows", model);
        }

        [HttpPost]
        public IActionResult GetPetCardRows(List<Pet> PetsList)
        {
            var model = new PetCardRowsViewModel { Pets = PetsList };
            return PartialView("_PetCardRows", model);
        }

        [HttpPost]
        public IActionResult GetAccessoryCardRows(List<Accessory> AccessoriesList)
        {
            var model = new AccessoryCardRowsViewModel { Accessories = AccessoriesList };
            return PartialView("_AccessoryCardRows", model);
        }
    }
}