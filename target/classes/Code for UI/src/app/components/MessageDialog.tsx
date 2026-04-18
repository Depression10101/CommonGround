import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Send } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';

interface MessageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  listerName: string;
  listerEmail: string;
  listingTitle: string;
}

interface Message {
  id: string;
  text: string;
  senderEmail: string;
  senderName: string;
  timestamp: string;
  readBy: string[];
}

interface Conversation {
  id: string;
  buyerEmail: string;
  buyerName: string;
  sellerEmail: string;
  sellerName: string;
  listingTitle: string;
  messages: Message[];
  lastMessageTime: string;
}

export function MessageDialog({ isOpen, onClose, listerName, listerEmail, listingTitle }: MessageDialogProps) {
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSend = () => {
    if (message.trim() && user) {
      // Create conversation ID based on buyer email, seller email, and listing title
      const conversationId = `${user.email}_${listerEmail}_${listingTitle}`.replace(/\s+/g, '_').replace(/@/g, '-');

      // Load all conversations
      const conversationsJson = localStorage.getItem('conversations');
      const conversations: Conversation[] = conversationsJson ? JSON.parse(conversationsJson) : [];

      // Find or create conversation
      let conversation = conversations.find(c => c.id === conversationId);

      const newMessage: Message = {
        id: Date.now().toString(),
        text: message,
        senderEmail: user.email,
        senderName: user.name,
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        }),
        readBy: [user.email],
      };

      if (conversation) {
        // Add to existing conversation
        conversation.messages.push(newMessage);
        conversation.lastMessageTime = newMessage.timestamp;
      } else {
        // Create new conversation
        conversation = {
          id: conversationId,
          buyerEmail: user.email,
          buyerName: user.name,
          sellerEmail: listerEmail,
          sellerName: listerName,
          listingTitle: listingTitle,
          messages: [newMessage],
          lastMessageTime: newMessage.timestamp,
        };
        conversations.push(conversation);
      }

      // Save all conversations
      localStorage.setItem('conversations', JSON.stringify(conversations));

      setMessage('');
      onClose();

      // Navigate to home page and trigger chat sidebar to open
      navigate('/', { state: { openChat: true, conversationId } });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Message {listerName}</DialogTitle>
          <DialogDescription>
            Send a message about "{listingTitle}"
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Hi ${listerName}, I'm interested in your listing...`}
            className="min-h-[150px]"
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={!message.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}