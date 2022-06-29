using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.DTOs;
using WebApi.Entities;
using WebApi.Extensions;
using WebApi.Helpers;
using WebApi.Interfaces;

namespace WebApi.DataAccess
{
    public class LikesRepository : ILikesRepository
    {
        private readonly DataContext context;

        public LikesRepository(DataContext context)
        {
            this.context = context;
        }
        public async Task<UserLike> GetUserLike(int sourceUserId, int likedUserId)
        {
            return await context.Likes.FindAsync(sourceUserId, likedUserId);
        }

        public async Task<PagedList<LikeDto>> GetUserLikes(LikesParams likesParams)
        {
            var users = context.Users.OrderBy(u => u.UserName).AsQueryable();
            var likes = context.Likes.AsQueryable();
            if (likesParams.Predicate == "liked")
            {
                users = likes
                    .Where(like => like.SourceUserId == likesParams.UserId)
                    .Select(like => like.LikedUser);
            }
            if (likesParams.Predicate == "likedBy")
            {
                users = likes
                    .Where(like => like.LikedUserId == likesParams.UserId)
                    .Select(like => like.SourceUser);
            }
            var likedUsers = users.Select(user => new LikeDto
            {
                Username = user.UserName,
                KnownAs = user.KnownAs,
                Age = user.DateOfBirth.CalculateAge(),
                PhotoUrl = user.Photos.FirstOrDefault(p => p.IsMain).Url,
                Id = user.Id,
            });
            return await PagedList<LikeDto>
                .CreateAsync(likedUsers, likesParams.PageNumber, likesParams.PageSize);
        }

        public async Task<List<string>> GetUserLikesWithoutPagination(int userId)
        {
            var likes = context.Likes.AsQueryable();
            var users = likes.Where(like => like.SourceUserId == userId).Select(like => like.LikedUser);
            return await users.Select(user => user.KnownAs).ToListAsync();
        }

        public async Task<AppUser> GetUserWithLikes(int userId)
        {
            return await context.Users
                .Include(u => u.LikedUsers)
                .FirstOrDefaultAsync(x => x.Id == userId);
        }


    }
}
