﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace AngelBattles.Controllers
{
    public class RealmController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}