using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApi.DTOs;
using WebApi.Entities;
using WebApi.Extensions;
using WebApi.Helpers;
using WebApi.Interfaces;

namespace WebApi.Controllers
{
    [Authorize]
    public class AppUsersController : BaseApiController
    {
        private readonly IUserRepository userRepository;
        private readonly IMapper mapper;
        private readonly IPhotoService photoService;

        public AppUsersController(IUserRepository userRepository, IMapper mapper, IPhotoService photoService)
        {
            this.userRepository = userRepository;
            this.mapper = mapper;
            this.photoService = photoService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers([FromQuery] UserParams userParams)
        {
            var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
            userParams.CurrentUsername = User.GetUsername();

            if (string.IsNullOrEmpty(userParams.Gender))
            {
                userParams.Gender = user.Gender == "male" ? "female" : "male";
            }
            var users = await userRepository.GetMembersAsync(userParams);
            Response.AddPaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);
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

        [HttpGet("username/{username}", Name = "GetUser")]
        public async Task<ActionResult<MemberDto>> GetAppUserByUsername(string username)
        {
            return Ok(await userRepository.GetMemberAsync(username));
        }

        [HttpPut]
        public async Task<IActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
        {
            var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());

            mapper.Map(memberUpdateDto, user);
            userRepository.Update(user);
            if (await userRepository.SaveAllAsync())
            {
                return NoContent();
            }
            return BadRequest("Profile updates has failed!");
        }


        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {
            var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
            var result = await photoService.AddPhotoAsync(file);
            if (result.Error != null)
            {
                return BadRequest(result.Error.Message);
            }
            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId,
            };
            if (user.Photos.Count == 0)
            {
                photo.IsMain = true;
            }
            user.Photos.Add(photo);
            if (await userRepository.SaveAllAsync())
            {
                return CreatedAtRoute("GetUser", new { username = user.UserName }, mapper.Map<PhotoDto>(photo));
            }
            return BadRequest("Problem with photo storage");
        }

        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
            var photo = user.Photos.FirstOrDefault(p => p.Id == photoId);
            if (photo.IsMain)
            {
                return BadRequest("This is already a main photo!");
            }
            var currentMainPhoto = user.Photos.FirstOrDefault(p => p.IsMain);
            if (currentMainPhoto != null) currentMainPhoto.IsMain = false;
            photo.IsMain = true;
            if (await userRepository.SaveAllAsync()) return NoContent();
            return BadRequest("Failed to change your main photo. Please, try again a while later!");
        }

        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var user = await userRepository.GetUserByUsernameAsync(User.GetUsername());
            var photo = user.Photos.FirstOrDefault(p => p.Id == photoId);
            if (photo == null)
            {
                return NotFound();
            }
            if (photo.IsMain)
            {
                return BadRequest("You are not allowed to remove your main photo!");
            }
            if (photo.PublicId != null)
            {
                var result = await photoService.DeletePhotoAsync(photo.PublicId);
                if (result.Error != null) return BadRequest(result.Error.Message);
            }
            user.Photos.Remove(photo);
            if (await userRepository.SaveAllAsync()) return Ok();

            return BadRequest("Attempt to delete photo has failed.");
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
