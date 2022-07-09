using AutoMapper;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;
using WebApi.DTOs;
using WebApi.Entities;
using WebApi.Extensions;
using WebApi.Interfaces;

namespace WebApi.SignalR
{
    public class MessageHub : Hub
    {
        private readonly IMessageRepository messageRepository;
        private readonly IMapper mapper;
        private readonly IUserRepository userRepository;

        public MessageHub(IMessageRepository messageRepository, IMapper mapper, IUserRepository userRepository)
        {
            this.messageRepository = messageRepository;
            this.mapper = mapper;
            this.userRepository = userRepository;
        }

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var otherUser = httpContext.Request.Query["user"].ToString();
            var groupName = GetGroupName(Context.User.GetUsername(), otherUser);
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            var messages = await messageRepository.GetMessageThread(Context.User.GetUsername(), otherUser);
            await Clients.Group(groupName).SendAsync("ReceiveMessageThread", messages);
        }

        public async Task OnDisconnected(Exception exception)
        {
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(CreateMessageDto createMessageDto)
        {
            var username = Context.User.GetUsername();

            if (username == createMessageDto.RecepientUsername.ToLower())
            {
                throw new HubException("You can't send messages to yourself");
            }

            var sender = await userRepository.GetUserByUsernameAsync(username);
            var recipient = await userRepository.GetUserByUsernameAsync(createMessageDto.RecepientUsername);

            if (recipient == null) throw new HubException("Message Recipient not found");
            var message = new Message
            {
                Sender = sender,
                Recepient = recipient,
                SenderUsername = sender.UserName,
                RecepientUsername = recipient.UserName,
                Content = createMessageDto.Content
            };
            messageRepository.AddMessage(message);

            if (await messageRepository.SaveAllAsync())
            {
                var group = GetGroupName(sender.UserName, recipient.UserName);
                await Clients.Group(group).SendAsync("NewMessage", mapper.Map<MessageDto>(message));
                //var groupName = GetGroupName(Context.User.GetUsername(), recipient.UserName);
                //var messages = await messageRepository.GetMessageThread(Context.User.GetUsername(), recipient.UserName);
                //await Clients.Group(groupName).SendAsync("ReceiveMessageThread", messages);
            }
        }

        private static string GetGroupName(string caller, string other)
        {
            var stringCompare = string.CompareOrdinal(caller, other) < 0;
            return stringCompare ? $"{caller}:{other}" : $"{other}:{caller}";
        }
    }
}
