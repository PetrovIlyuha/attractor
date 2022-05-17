using AutoMapper;
using System.Linq;
using WebApi.DTOs;
using WebApi.Entities;

namespace WebApi.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<AppUser, MemberDto>().ForMember(
                dest => dest.PhotoUrl,
                opts => opts.MapFrom(src => src.Photos.FirstOrDefault(photo => photo.IsMain).Url)
            );
            CreateMap<Photo, PhotoDto>();
        }
    }
}
