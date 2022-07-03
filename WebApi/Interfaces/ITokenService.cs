using System.Threading.Tasks;
using WebApi.Entities;

namespace WebApi.Interfaces
{
    public interface ITokenService
    {
        Task<string> CreateToken(AppUser user);
    }
}
