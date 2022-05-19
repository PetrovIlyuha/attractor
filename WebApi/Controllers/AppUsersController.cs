using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebApi.DataAccess;
using WebApi.DTOs;
using WebApi.Entities;
using WebApi.Interfaces;

namespace WebApi.Controllers
{
    [Authorize]
    public class AppUsersController : BaseApiController
    {
        private readonly IUserRepository userRepository;
        private readonly IMapper mapper;

        public AppUsersController(IUserRepository userRepository, IMapper mapper)
        {
            this.userRepository = userRepository;
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers()
        {
            var users = await userRepository.GetMembersAsync();
            //var usersToReturn = mapper.Map<IEnumerable<MemberDto>>(users);
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MemberDto>> GetAppUserById(int id)
        {
            var appUser = await userRepository.GetUserByIdAsync(id);

            if (appUser == null)
            {
                return NotFound();
            }

            return Ok(appUser);
        }
        
        [HttpGet("username/{username}")]
        public async Task<ActionResult<MemberDto>> GetAppUserByUsername(string username)
        {
            //var appUser = await userRepository.GetUserByUsernameAsync(username);

            //if (appUser == null)
            //{
            //    return NotFound();
            //}

            //return mapper.Map<MemberDto>(appUser);
            return await userRepository.GetMemberAsync(username);
        }

        // PUT: api/AppUsers/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, AppUser appUser)
        {
            if (id != appUser.Id)
            {
                return BadRequest();
            }

            userRepository.Update(appUser);
            await userRepository.SaveAllAsync();
            //try
            //{
            //    await _context.SaveChangesAsync();
            //}
            //catch (DbUpdateConcurrencyException)
            //{
            //    if (!AppUserExists(id))
            //    {
            //        return NotFound();
            //    }
            //    else
            //    {
            //        throw;
            //    }
            //}

            return NoContent();
        }

        // POST: api/AppUsers
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        //[HttpPost]
        //public async Task<ActionResult<AppUser>> CreateUser(AppUser appUser)
        //{
        //    _context.Users.Add(appUser);
        //    await _context.SaveChangesAsync();

        //    return CreatedAtAction("GetAppUser", new { id = appUser.Id }, appUser);
        //}

        // DELETE: api/AppUsers/5
        //[HttpDelete("{id}")]
        //public async Task<IActionResult> DeleteUser(int id)
        //{
        //    var appUser = await _context.Users.FindAsync(id);
        //    if (appUser == null)
        //    {
        //        return NotFound();
        //    }

        //    _context.Users.Remove(appUser);
        //    await _context.SaveChangesAsync();

        //    return NoContent();
        //}

        //private bool AppUserExists(int id)
        //{
        //    return _context.Users.Any(e => e.Id == id);
        //}
    }
}
