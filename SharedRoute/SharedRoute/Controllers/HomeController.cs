using System.Web.Mvc;

namespace SharedRoute.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}