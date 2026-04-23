using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BoraLaBackend.Feature.System
{
    [Route("health")]
    [ApiController]
    public class HealthController : ControllerBase
    {
        [HttpGet]
        public IActionResult Check()
        {
            return Ok(new
            {
                status = "online",
                timestamp = DateTime.UtcNow
            });
        }
    }
}
