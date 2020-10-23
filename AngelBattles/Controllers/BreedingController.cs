using AngelBattles.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace AngelBattles.Controllers
{
    public class BreedingController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public IActionResult GetPetCardRows(List<Pet> PetsList)
        {
            var model = new PetCardRowsViewModel { Pets = PetsList };
            return PartialView("_PetCardRows", model);
        }
    }
}