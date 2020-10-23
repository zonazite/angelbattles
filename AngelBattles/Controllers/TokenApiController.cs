using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using AngelBattles.Models;
using Newtonsoft.Json;
using AngelBattles.Utilities;
using Microsoft.AspNetCore.Hosting;

namespace AngelBattles.Controllers
{
    [Produces("application/json")]
    [Route("api/TokenApi")]
    public class TokenApiController : Controller
    {
        private readonly IHostingEnvironment _hostingEnvironment;

        public TokenApiController(IHostingEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
        }

        // GET: api/TokenApi/{json string}
        [HttpGet("byType")]
        public JsonResult Get(string type, string value)
        {
            var pngInfoList = Helpers.GetPngImageUrlList(_hostingEnvironment);

            if (type == "angel")
            {
                var angelList = JsonConvert.DeserializeObject<List<Angel>>(value);
                var tokenAngelList = new List<TokenAngel>();
                foreach (var angel in angelList)
                {
                    var pngInfo = pngInfoList.FirstOrDefault(x => x.CardSeriesId == angel.AngelCardSeriesId.ToString() && x.CardSeriesType == "Angel");
                    var angelCardInfo = Helpers.GetAngelCardInfo(angel.AngelCardSeriesId, angel.Aura);
                    tokenAngelList.Add(new TokenAngel
                    {
                        AngelId = angel.AngelId,
                        AngelCardSeriesId = angel.AngelCardSeriesId,
                        BattlePower = angel.BattlePower,
                        Aura = angel.Aura,
                        Experience = angel.Experience,
                        Price = angel.Price,
                        CreatedTime = angel.CreatedTime,
                        Owner = angel.Owner,
                        Rarity = angelCardInfo.RarityDescription,
                        Description = angelCardInfo.CardDescription,
                        AuraDescription = angelCardInfo.GemAltText,
                        PngImageUri = pngInfo.ImageUri
                    });
                }

                return new JsonResult(tokenAngelList);
            } else if (type == "pet")
            {
                var petList = JsonConvert.DeserializeObject<List<Pet>>(value);
                var tokenPetList = new List<TokenPet>();
                foreach (var pet in petList)
                {
                    var pngInfo = pngInfoList.FirstOrDefault(x => x.CardSeriesId == pet.PetCardSeriesId.ToString() && x.CardSeriesType == "Pet");
                    tokenPetList.Add(new TokenPet
                    {
                        PetId = pet.PetId,
                        PetCardSeriesId = pet.PetCardSeriesId,
                        CardName = pngInfo.CardName,
                        Name = pet.Name,
                        Luck = pet.Luck,
                        AuraRed = pet.AuraRed,
                        AuraBlue = pet.AuraBlue,
                        AuraYellow = pet.AuraYellow,
                        Owner = pet.Owner,
                        Description = "",
                        PngImageUri = pngInfo.ImageUri
                    });
                }

                return new JsonResult(tokenPetList);
            } else if (type == "acc")
            {
                var accList = JsonConvert.DeserializeObject<List<Accessory>>(value);
                var tokenAccList = new List<TokenAccessory>();
                foreach (var acc in accList)
                {
                    var pngInfo = pngInfoList.FirstOrDefault(x => x.CardSeriesId == acc.AccessorySeriesId.ToString() && x.CardSeriesType == "Accessory");
                    tokenAccList.Add(new TokenAccessory
                    {
                        AccessoryId = acc.AccessoryId,
                        AccessorySeriesId = acc.AccessorySeriesId,
                        Owner = acc.Owner,
                        PngImageUri = pngInfo.ImageUri
                    });
                }

                return new JsonResult(tokenAccList);
            }

            return new JsonResult("");
        }
    }
}
