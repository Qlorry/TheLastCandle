namespace TheLastCandle.ErrorHandlers
{
    internal class BadRequestException : Exception
    {
        internal BadRequestException(string message) : base(message) { }
    }
}
