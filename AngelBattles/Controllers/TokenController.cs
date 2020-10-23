using Microsoft.AspNetCore.Mvc;
using AngelBattles.Models;
using System.Collections.Generic;

namespace AngelBattles.Controllers
{
    [Produces("application/json")]
    public class TokenController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public JsonResult GetAngel(List<Angel> AngelData)
        {
            return new JsonResult(AngelData);
        }

        public JsonResult GetPet(List<Pet> PetData)
        {
            return new JsonResult(PetData);
        }

        public JsonResult GetAccessory(List<Accessory> AccessoryData)
        {
            return new JsonResult(AccessoryData);
        }
    }
}