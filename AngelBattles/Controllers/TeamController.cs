using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using AngelBattles.Models;

namespace AngelBattles.Controllers
{
    public class TeamController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public class Employee
        {
            public int Id { get; set; }
            public string Name { get; set; }
        }

        [HttpPost]
        public IActionResult GetAngelCardRows(List<Angel> AngelsList)
        {
            var model = new AngelCardRowsViewModel { Angels = AngelsList };
            return PartialView("_AngelCardRows", model);
        }

        [HttpPost]
        [DisableRequestSizeLimit]
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