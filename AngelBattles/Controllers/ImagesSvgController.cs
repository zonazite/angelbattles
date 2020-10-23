using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using AngelBattles.Models;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using AngelBattles.Utilities;

namespace AngelBattles.Controllers
{
    [Produces("application/json")]
    [Route("api/ImagesSvg")]
    public class ImagesSvgController : Controller
    {
        private readonly IHostingEnvironment _hostingEnvironment;

        public ImagesSvgController(IHostingEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
        }

        // GET: api/Images
        [HttpGet]
        public IActionResult Get()
        {
            var imagesList = Helpers.GetSvgImageUrlList(_hostingEnvironment);

            return Json(imagesList);
        }
    }
}
