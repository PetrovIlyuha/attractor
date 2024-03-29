﻿using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.DTOs;
using WebApi.Entities;
using WebApi.Helpers;
using WebApi.Interfaces;

namespace WebApi.DataAccess
{
    public class MessageRepository : IMessageRepository
    {
        private readonly DataContext context;
        private readonly IMapper mapper;

        public MessageRepository(DataContext context, IMapper mapper)
        {
            this.context = context;
            this.mapper = mapper;
        }

        public void AddGroup(Group group)
        {
            context.Groups.Add(group);
        }

        public void AddMessage(Message message)
        {
            context.Messages.Add(message);
        }

        public void DeleteMessage(Message message)
        {
            context.Messages.Remove(message);
        }

        public async Task<Connection> GetConnection(string connectionId)
        {
            return await context.Connections.FindAsync(connectionId);
        }

        public async Task<Group> GetGroupConnection(string connectionId)
        {
            return await context.Groups
                .Include(c => c.Connections)
                .Where(c => c.Connections.Any(c => c.ConnectionId == connectionId))
                .FirstOrDefaultAsync();
        }

        public async Task<Message> GetMessage(int id)
        {
            return await context.Messages
                .Include(m => m.Sender)
                .Include(m => m.Recepient)
                .SingleOrDefaultAsync(message => message.Id == id);
        }

        public async Task<Group> GetMessageGroup(string groupName)
        {
            return await context.Groups.Include(g => g.Connections).FirstOrDefaultAsync(g => g.Name == groupName);
        }

        public async Task<PagedList<MessageDto>> GetMessagesForUserPaginated(MessageParams messageParams)
        {
            var query = context.Messages.OrderByDescending(m => m.MessageSent).AsQueryable();
            query = messageParams.Container switch
            {
                "Inbox" => query.Where(u => u.Recepient.UserName == messageParams.Username && u.RecepientDeleted == false),
                "Outbox" => query.Where(u => u.Sender.UserName == messageParams.Username && u.SenderDeleted == false),
                _ => query.Where(u => u.Recepient.UserName == messageParams.Username && u.RecepientDeleted == false && u.DateRead == null)
            };
            var messages = query.ProjectTo<MessageDto>(mapper.ConfigurationProvider);
            return await PagedList<MessageDto>.CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);
        }

        public async Task<IEnumerable<MessageDto>> GetMessageThread(string currentUsername, string recipientUsername)
        {
            var messages = await context.Messages
                .Include(u => u.Sender).ThenInclude(u => u.Photos)
                .Include(u => u.Recepient).ThenInclude(u => u.Photos)
                .Where(
                m => m.Recepient.UserName == currentUsername && m.RecepientDeleted == false && m.Sender.UserName == recipientUsername
                || m.Recepient.UserName == recipientUsername && m.SenderDeleted == false && m.Sender.UserName == currentUsername)
                .OrderBy(m => m.MessageSent)
                .ToListAsync();
            var unreadMessages = messages.Where(m => m.DateRead == null && m.Recepient.UserName == currentUsername).ToList();
            if (unreadMessages.Any())
            {
                foreach (var message in unreadMessages)
                {
                    message.DateRead = DateTime.UtcNow;
                }
            }

            return mapper.Map<IEnumerable<MessageDto>>(messages);

        }
        public async Task<IEnumerable<MessageDto>> GetUnreadMessages(string username)
        {
            var messages = await context.Messages
                .Where(m => m.Recepient.UserName == username && m.DateRead == null)
                .ToListAsync();
            return mapper.Map<IEnumerable<MessageDto>>(messages);
        }

        public void RemoveConnection(Connection connection)
        {
            context.Connections.Remove(connection);
        }     

    }
}
