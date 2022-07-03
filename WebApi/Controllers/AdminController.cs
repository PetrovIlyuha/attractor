using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Entities;

namespace WebApi.Controllers
{
    public class AdminController : BaseApiController
    {
        private readonly UserManager<AppUser> userManager;

        public AdminController(UserManager<AppUser> userManager)
        {
            this.userManager = userManager;
        }

        [Authorize(Policy = "RequiredAdminRole")]
        [HttpGet("users-with-roles")]
        public async Task<ActionResult> GetUsersWithRoles()
        {
            var users = await userManager.Users
                .Include(u => u.UserRoles)
                .ThenInclude(r => r.Role)
                .OrderBy(u => u.UserName)
                .Select(u => new
                {
                    u.Id,
                    Username = u.UserName,
                    Roles = u.UserRoles.Select(r => r.Role.Name).ToList()
                })
                .ToListAsync();
            return Ok(users);
        }

        [HttpPost("edit-roles/{username}")]
        public async Task<ActionResult> EditRoles(string username, [FromQuery] string roles)
        {
            var selectedRoles = roles.Split(",").ToArray(); //e.g. passing admin

            var user = await userManager.FindByNameAsync(username);

            if (user == null) return NotFound("Could not find user...");

            var userRoles = await userManager.GetRolesAsync(user); // admin, mod

            var result = await userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles)); // adding nothing

            if (!result.Succeeded) return BadRequest("Failed to edit roles (add to role/s)");

            result = await userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles)); // removes mod role

            if (!result.Succeeded) return BadRequest("Failed to edit roles (remove from role/s)");

            return Ok(await userManager.GetRolesAsync(user));  
        }

        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpGet("photos-to-moderate")]
        public ActionResult GetPbotosForModeration()
        {
            return Ok("Only Admins or Mods can see photes for moderation...");
        }
    }
}
