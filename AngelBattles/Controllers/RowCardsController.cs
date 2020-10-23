using Microsoft.AspNetCore.Mvc;

namespace AngelBattles.Controllers
{
    public class RowCardsController : Controller
    {
        public IActionResult GetAngelRowCards()
        {
            return PartialView("_AngelRowCards");
        }

        public IActionResult GetPetRowCards()
        {
            return PartialView("_PetRowCards");
        }

        public IActionResult GetAccessoryRowCards()
        {
            return PartialView("_AccessoryRowCards");
        }
    }
}