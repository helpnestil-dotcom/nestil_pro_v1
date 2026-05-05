'use client';

import { useEffect, useState } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy, onSnapshot, limit, Timestamp } from 'firebase/firestore';
import { MobileListingHeader } from '@/components/mobile-listing-header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MessageSquare, ChevronRight, User } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

export default function ChatListPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [chats, setChats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid || !firestore) return;

    // Query for chats where the user is a participant
    const chatsQuery = query(
      collection(firestore, 'chats'),
      where('participants', 'array-contains', user.uid),
      orderBy('lastMessageAt', 'desc')
    );

    const unsubscribe = onSnapshot(chatsQuery, (snapshot) => {
      const chatData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setChats(chatData);
      setIsLoading(false);
    }, (error) => {
      console.error('Error fetching chats:', error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid, firestore]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="md:hidden">
        <MobileListingHeader title="Messages" />
        
        <div className="px-5 py-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-3xl">
                  <Skeleton className="h-14 w-14 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>
              ))}
            </div>
          ) : chats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-slate-300" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-800">No messages yet</h3>
                <p className="text-sm text-slate-500 max-w-[200px]">Start a conversation with a property owner or flatmate.</p>
              </div>
              <Link href="/">
                <Button className="rounded-2xl px-8 font-black">Explore Listings</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {chats.map((chat) => {
                const otherParticipantId = chat.participants.find((id: string) => id !== user.uid);
                const otherParticipantName = chat.participantNames?.[otherParticipantId] || 'User';
                const otherParticipantImage = chat.participantImages?.[otherParticipantId];
                const lastMessage = chat.lastMessage || 'No messages yet';
                const lastMessageAt = chat.lastMessageAt?.toDate() || new Date();

                return (
                  <Link key={chat.id} href={`/chat/${chat.id}`}>
                    <div className="flex items-center gap-4 p-4 bg-white rounded-3xl border border-slate-100 shadow-sm active:bg-slate-50 transition-all">
                      <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
                        <AvatarImage src={otherParticipantImage} />
                        <AvatarFallback className="bg-primary/5 text-primary font-black uppercase">
                          {otherParticipantName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-0.5">
                          <h4 className="font-black text-slate-900 truncate">{otherParticipantName}</h4>
                          <span className="text-[10px] font-bold text-slate-400">
                            {formatDistanceToNow(lastMessageAt, { addSuffix: true }).replace('about ', '')}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 truncate font-medium">
                          {lastMessage}
                        </p>
                      </div>
                      
                      <ChevronRight className="w-5 h-5 text-slate-200" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      {/* Desktop view warning */}
      <div className="hidden md:flex flex-col items-center justify-center py-40">
        <h2 className="text-3xl font-black text-slate-800">Chat Coming Soon to Desktop</h2>
        <p className="text-slate-500">Please visit Nestil on your mobile device for real-time chat.</p>
      </div>
    </div>
  );
}
