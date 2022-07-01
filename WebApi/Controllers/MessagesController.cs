using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using WebApi.DTOs;
using WebApi.Entities;
using WebApi.Extensions;
using WebApi.Helpers;
using WebApi.Interfaces;

namespace WebApi.Controllers
{
    [Authorize]
    public class MessagesController : BaseApiController
    {
        private readonly IUserRepository userRepository;
        private readonly IMessageRepository messageRepository;
        private readonly IMapper mapper;

        public MessagesController(IUserRepository userRepository, IMessageRepository messageRepository, IMapper mapper)
        {
            this.userRepository = userRepository;
            this.messageRepository = messageRepository;
            this.mapper = mapper;
        }

        [HttpPost]
        public async Task<ActionResult<MessageDto>> CreateMessage([FromBody] CreateMessageDto createMessageDto)
        {
            var username = User.GetUsername();
            if (username == createMessageDto.RecepientUsername.ToLower())
            {
                return BadRequest("You tried to send yourself a message!");
            }

            var sender = await userRepository.GetUserByUsernameAsync(username);
            var recepient = await userRepository.GetUserByUsernameAsync(createMessageDto.RecepientUsername);

            if (recepient == null) return NotFound();

            var message = new Message
            {
                Sender = sender,
                Recepient = recepient,
                SenderUsername = sender.UserName,
                RecepientUsername = recepient.UserName,
                Content = createMessageDto.Content
            };
            messageRepository.AddMessage(message);

            if (await messageRepository.SaveAllAsync())
            {
                return Ok(mapper.Map<MessageDto>(message));
            }

            return BadRequest("Failed to send your message!");
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessagesForUser([FromQuery] MessageParams messageParams)
        {
            messageParams.Username = User.GetUsername();
            var messages = await messageRepository.GetMessagesForUserPaginated(messageParams);
            Response.AddPaginationHeader(messages.CurrentPage, messages.PageSize, messages.TotalCount, messages.TotalPages);
            return Ok(messages);
        }

        [HttpGet("thread/{username}")]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessageThread(string username)
        {
            var currentUsername = User.GetUsername();

            return Ok(await messageRepository.GetMessageThread(currentUsername, username));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMessage(int id)
        {
            var username = User.GetUsername();
            var message = await messageRepository.GetMessage(id);
            if (message.Sender.UserName != username && message.Recepient.UserName != username)
            {
                return Unauthorized("You can't touch this message, you, hacker!");
            }

            if (message.Sender.UserName == username) message.SenderDeleted = true;
            if (message.Recepient.UserName == username) message.RecepientDeleted = true;
            if (message.SenderDeleted && message.RecepientDeleted) messageRepository.DeleteMessage(message);
            if (await messageRepository.SaveAllAsync()) return Ok();
            return BadRequest("Problem with message deletion!");
        }
    }
}
