using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using AngelBattles.Models;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using AngelBattles.Utilities;

namespace AngelBattles.Controllers
{
    [Produces("application/json")]
    [Route("api/ImagesPng")]
    public class ImagesPngController : Controller
    {
        private readonly IHostingEnvironment _hostingEnvironment;

        public ImagesPngController(IHostingEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
        }

        // GET: api/Images
        [HttpGet]
        public IActionResult Get()
        {
            var imagesList = Helpers.GetPngImageUrlList(_hostingEnvironment);

            return Json(imagesList);
        }
    }
}
