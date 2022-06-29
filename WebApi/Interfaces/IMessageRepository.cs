

using System.Collections.Generic;
using System.Threading.Tasks;
using WebApi.DTOs;
using WebApi.Entities;
using WebApi.Helpers;

namespace WebApi.Interfaces
{
    public interface IMessageRepository
    {
        void AddMessage(Message message);
        void DeleteMessage(Message message);
        Task<Message> GetMessage(int id);
        Task<PagedList<MessageDto>> GetMessagesForUserPaginated();
        Task<IEnumerable<MessageDto>> GetMessageThread(int currentUserId, int recepientId);
        Task<bool> SaveAllAsync();
    }
}
