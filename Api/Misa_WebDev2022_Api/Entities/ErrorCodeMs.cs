namespace Misa_WebDev2022_Api.Entities
{
    public class ErrorCodeMs
    {  
        public ErrorCodeMs(string messageCode)
        {
            this.MessageCode = messageCode;
        }
        public string MessageCode{ get; set; }
    }
}
