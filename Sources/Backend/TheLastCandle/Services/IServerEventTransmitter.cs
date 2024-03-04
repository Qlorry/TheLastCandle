using System.Threading.Channels;
using TheLastCandle.Services.Presenters.Events;

namespace TheLastCandle.Services
{
    public struct TransmitterContext
    {
        public Guid sessionId { get; set; }
        public ChannelReader<IServerCommand> reader { get; set; }
    }

    public interface IServerEventTransmitter
    {
        public void SetContext(TransmitterContext ctx);
        public void Run();
    }
}
