'use client';

import { useEffect, useState, useRef } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  doc, 
  getDoc,
  updateDoc 
} from 'firebase/firestore';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send, User, MapPin } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function ChatDetailPage() {
  const { chatId } = useParams();
  const router = useRouter();
  const { user } = useUser();
  const firestore = useFirestore();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [chatInfo, setChatInfo] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user?.uid || !firestore || !chatId) return;

    // Fetch chat info (participant names, etc.)
    const fetchChatInfo = async () => {
      const chatDoc = await getDoc(doc(firestore, 'chats', chatId as string));
      if (chatDoc.exists()) {
        setChatInfo(chatDoc.data());
      }
    };
    fetchChatInfo();

    // Listen for messages
    const messagesQuery = query(
      collection(firestore, 'chats', chatId as string, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const msgData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgData);
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });

    return () => unsubscribe();
  }, [user?.uid, firestore, chatId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !firestore || !chatId) return;

    const messageText = newMessage.trim();
    setNewMessage('');

    try {
      // Add message to subcollection
      await addDoc(collection(firestore, 'chats', chatId as string, 'messages'), {
        text: messageText,
        senderId: user.uid,
        createdAt: serverTimestamp(),
      });

      // Update chat root doc for last message info
      await updateDoc(doc(firestore, 'chats', chatId as string), {
        lastMessage: messageText,
        lastMessageAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (!user) return null;

  const otherParticipantId = chatInfo?.participants?.find((id: string) => id !== user.uid);
  const otherParticipantName = chatInfo?.participantNames?.[otherParticipantId] || 'Loading...';
  const otherParticipantImage = chatInfo?.participantImages?.[otherParticipantId];

  return (
    <div className="flex flex-col h-screen bg-slate-50 md:hidden">
      {/* Custom Header */}
      <div className="bg-white border-b border-slate-100 px-5 py-3 flex items-center gap-3 sticky top-0 z-10 shadow-sm">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </Button>
        <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
          <AvatarImage src={otherParticipantImage} />
          <AvatarFallback className="bg-primary/5 text-primary font-black uppercase">
            {otherParticipantName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h4 className="text-[15px] font-black text-slate-900 leading-tight">{otherParticipantName}</h4>
          <div className="flex items-center gap-1">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Online</span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {messages.map((msg, index) => {
          const isMe = msg.senderId === user.uid;
          const showDate = index === 0 || 
            (msg.createdAt && messages[index-1].createdAt && 
             format(msg.createdAt.toDate(), 'dd/MM') !== format(messages[index-1].createdAt.toDate(), 'dd/MM'));

          return (
            <div key={msg.id} className="space-y-4">
              {showDate && msg.createdAt && (
                <div className="flex justify-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
                    {format(msg.createdAt.toDate(), 'MMMM d')}
                  </span>
                </div>
              )}
              <div className={cn(
                "flex flex-col max-w-[80%]",
                isMe ? "ml-auto items-end" : "mr-auto items-start"
              )}>
                <div className={cn(
                  "px-4 py-3 rounded-[24px] shadow-sm",
                  isMe 
                    ? "bg-primary text-white rounded-tr-none shadow-primary/20" 
                    : "bg-white text-slate-800 rounded-tl-none border border-slate-100"
                )}>
                  <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                </div>
                {msg.createdAt && (
                  <span className="text-[9px] font-bold text-slate-400 mt-1.5 px-1 uppercase">
                    {format(msg.createdAt.toDate(), 'HH:mm')}
                  </span>
                )}
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100 pb-10">
        <form onSubmit={handleSendMessage} className="flex gap-2 items-center bg-slate-50 p-1.5 rounded-[24px] border border-slate-100">
          <Input 
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="border-none bg-transparent focus-visible:ring-0 shadow-none h-11 text-sm font-medium"
          />
          <Button 
            type="submit" 
            disabled={!newMessage.trim()}
            className="rounded-full w-11 h-11 p-0 shrink-0 shadow-lg shadow-primary/30"
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
