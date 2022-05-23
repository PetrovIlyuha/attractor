using AutoMapper;
using System.Linq;
using WebApi.DTOs;
using WebApi.Entities;
using WebApi.Extensions;

namespace WebApi.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<AppUser, MemberDto>().ForMember(
                dest => dest.PhotoUrl,
                opts => opts.MapFrom(src => src.Photos.FirstOrDefault(photo => photo.IsMain).Url)
            ).ForMember(
                dest => dest.Age,
                opts => opts.MapFrom(src => src.DateOfBirth.CalculateAge())
            );

            CreateMap<Photo, PhotoDto>();
            CreateMap<MemberUpdateDto, AppUser>();
        }
    }
}
