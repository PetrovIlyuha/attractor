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
        private readonly IUnitOfWork unitOfWork;
        private readonly IMapper mapper;

        public MessagesController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            this.unitOfWork = unitOfWork;
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

            var sender = await unitOfWork.UserRepository.GetUserByUsernameAsync(username);
            var recepient = await unitOfWork.UserRepository.GetUserByUsernameAsync(createMessageDto.RecepientUsername);

            if (recepient == null) return NotFound();

            var message = new Message
            {
                Sender = sender,
                Recepient = recepient,
                SenderUsername = sender.UserName,
                RecepientUsername = recepient.UserName,
                Content = createMessageDto.Content
            };
            unitOfWork.MessageRepository.AddMessage(message);

            if (await unitOfWork.Complete())
            {
                return Ok(mapper.Map<MessageDto>(message));
            }

            return BadRequest("Failed to send your message!");
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessagesForUser([FromQuery] MessageParams messageParams)
        {
            messageParams.Username = User.GetUsername();
            var messages = await unitOfWork.MessageRepository.GetMessagesForUserPaginated(messageParams);
            Response.AddPaginationHeader(messages.CurrentPage, messages.PageSize, messages.TotalCount, messages.TotalPages);
            return Ok(messages);
        }


        [HttpGet("unread/{username}")]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetAllUnreadMessages(string username)
        {
            var currentUsername = User.GetUsername();
            return Ok(await unitOfWork.MessageRepository.GetUnreadMessages(currentUsername));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMessage(int id)
        {
            var username = User.GetUsername();
            var message = await unitOfWork.MessageRepository.GetMessage(id);
            if (message.Sender.UserName != username && message.Recepient.UserName != username)
            {
                return Unauthorized("You can't touch this message, you, hacker!");
            }

            if (message.Sender.UserName == username) message.SenderDeleted = true;
            if (message.Recepient.UserName == username) message.RecepientDeleted = true;
            if (message.SenderDeleted && message.RecepientDeleted) unitOfWork.MessageRepository.DeleteMessage(message);
            if (await unitOfWork.Complete()) return Ok();
            return BadRequest("Problem with message deletion!");
        }
    }
}
