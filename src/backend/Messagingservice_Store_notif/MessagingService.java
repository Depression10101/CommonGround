class MessagingService
{
    public static void main(String args[])
    {
        
    }

    private void SendMessage(String msg)//function called by send button, msg is sent to database and recieving client
    {
        System.out.println(msg);//placeholder code that represents message being sent to database
    }

    private void AcceptOrDecline_Conversation(boolean accept)//function that creates conversation based on if the message reciever wants to start a conversation with sender
    {
        if(accept)
        {
            System.out.println("Conversation started");
            return;
        }
        System.out.println("Conversation declined");
        return;
    }

    private void Delete()//function that deletes message from client view and deletes message record after a certain amount of time
    {
        System.out.println("Message deleted");
    }

    private void Open_Conversation()//function that marks message as read
    {
        while()
        {
            System.out.Println()
        }
    }

    public int GenMsgId()
    {
        
    }
}