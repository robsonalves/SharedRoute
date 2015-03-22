using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;

namespace SharedRoute.Hubs
{
    [HubName("teste")]
    public class RotasHub : Hub
    {
        public void AtualizaRotas(dynamic direcoes)
        {
            Clients.All.AtualizaRotas(direcoes);
        }
    }
}