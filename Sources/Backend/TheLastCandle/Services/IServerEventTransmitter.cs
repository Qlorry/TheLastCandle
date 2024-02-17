using System.Threading.Channels;
using TheLastCandle.Models.Events;

namespace TheLastCandle.Services
{
    public struct TransmitterContext
    {
        public Guid sessionId { get; set; }
        public ChannelReader<IServerEvent> reader { get; set; }
    }

    public interface IServerEventTransmitter
    {
        public void SetContext(TransmitterContext ctx);
        public void Run();
    }
}
