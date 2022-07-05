using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;
using WebApi.Extensions;

namespace WebApi.SignalR
{
    public class PresenceHub : Hub
    {
        private readonly PresenceTracker tracker;

        public PresenceHub(PresenceTracker tracker)
        {
            this.tracker = tracker;
        }

        [Authorize]
        public override async Task OnConnectedAsync()
        {
            await tracker.UserConnected(Context.User.GetUsername(), Context.ConnectionId);
            await Clients.Others.SendAsync("UserIsOnline", Context.User.GetUsername());
            var onlineUsers = await tracker.GetOnlineUsers();
            await Clients.All.SendAsync("GetOnlineUsers", onlineUsers);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await tracker.UserDisconnected(Context.User.GetUsername(), Context.ConnectionId);
            await Clients.Others.SendAsync("UserIsOffline", Context.User.GetUsername());
            var onlineUsers = await tracker.GetOnlineUsers();
            await Clients.All.SendAsync("GetOnlineUsers", onlineUsers);
            await base.OnDisconnectedAsync(exception);
        }
    }
}
