class MessagingService
{
    public void CreateMsgRec(int msgId, int senderId, int recieverId, String msg, Time date)
    {
        this.msgId = msgId;
        this.senderId = senderId;
        this.RecieverId = recieverId;
        this.msgTxt = msgTxt;
        this.date = date;//when message was sent
    }

    public String[] GetConversation(int senderId, int recieverId)//grabs all messages between senderId and recieverId and returns them in an array
    {
        
    }

    public String GetMessage(int senderId)//grabs message with senderId and returns it
    {

    }

    public void DeleteMsgRec(int msgId)
    {

    }




}