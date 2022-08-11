using AutoMapper;
using System.Threading.Tasks;
using WebApi.DataAccess;

namespace WebApi.Interfaces
{
    public interface IUnitOfWork
    {
        IUserRepository UserRepository { get; }
        IMessageRepository MessageRepository { get; }
        ILikesRepository LikesRepository { get; }
        Task<bool> Complete();
        bool HasChanges();       
    }
}
