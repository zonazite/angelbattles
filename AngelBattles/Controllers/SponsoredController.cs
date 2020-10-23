using AngelBattles.Interfaces;
using AngelBattles.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AngelBattles.Utilities;
using System;

namespace AngelBattles.Controllers
{
    public class SponsoredController : Controller
    {
        private readonly IHostingEnvironment hostingEnvironment;

        public SponsoredController(IHostingEnvironment hostingEnvironment)
        {
            this.hostingEnvironment = hostingEnvironment;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult GetSponsoredLeaderboardRows(List<SponsoredLeaderboard> SponsoredLeaderboardList, List<SponsoredLeaderboardTeams> SponsoredLeaderboardTeamsList)
        {
            var orderedSponsoredLeaderboardList = SponsoredLeaderboardList.OrderByDescending(x => x.IsLive).ThenByDescending(x => x.LeaderboardId).ToList();
            var uniqueLeaderboardIds = SponsoredLeaderboardList.Where(x => Helpers.UnixTimeStampToDateTime(x.EndTime).AddDays(4) > DateTime.Now ).GroupBy(x => x.LeaderboardId).Select(y => y.First()).OrderByDescending(x => x.IsLive).ThenByDescending(z => z.LeaderboardId).Select(a => a.LeaderboardId);
            var orderedSponsoredLeaderboardTeams = SponsoredLeaderboardTeamsList.OrderBy(x => x.Rank).ToList();

            var model = new SponsoredLeaderboardRowsViewModel { UniqueLeaderboardIds = uniqueLeaderboardIds, SponsoredLeaderboard = orderedSponsoredLeaderboardList, SponsoredLeaderboardTeams = orderedSponsoredLeaderboardTeams };
            return PartialView("_LeaderboardRows", model);
        }

        [HttpPost]
        public async Task<IActionResult> UploadFile(IFormFile file)
        {
            var isSuccess = false;

            try
            {
                if (file == null || file.Length == 0)
                    return Json(new { success = false, responseText = "File Uploaded Failed" });

                var path = Path.Combine(
                    Directory.GetCurrentDirectory(), "wwwroot\\public\\sponsors",
                    file.GetFilename());

                using (var stream = new FileStream(path, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                isSuccess = true;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }
            

            return Json(new { success = isSuccess, responseText = isSuccess ? "File Uploaded" : "File Upload Failed" });
        }
    }
}