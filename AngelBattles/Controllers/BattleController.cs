using AngelBattles.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace AngelBattles.Controllers
{
    public class BattleController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public IActionResult GetAngelCardRows(List<Angel> AngelsList, List<AngelNextBattleTimes> AngelsNextBattleTimeList)
        {
            var model = new AngelCardRowsViewModel { Angels = AngelsList, AngelsNextBattleTimes = AngelsNextBattleTimeList };
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