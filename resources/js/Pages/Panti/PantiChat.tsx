import React, { useState, useEffect, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import { 
  Send, Menu, MessageSquare, ArrowLeft, Check, CheckCheck
} from 'lucide-react';
import PantiSidebar, { PantiTabType } from '@/Components/Panti/PantiSidebar';
import PantiHeader from '@/Components/Panti/PantiHeader';

interface Message {
  id_message: number;
  id_chat: number;
  id_sender: number;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface ChatItem {
  id_chat: number;
  donor: {
    id_donor: number;
    nama_lengkap: string;
    foto_profil: string | null;
  };
  last_message: string | null;
  last_message_time: string | null;
  unread_count: number;
}

interface PantiChatProps {
  chats: ChatItem[];
  activeChatId: number | null;
  pantiData: {
    id_shelter: number;
    nama_yayasan: string;
    foto_profil: string | null;
  };
  auth: any;
}

export default function PantiChat({ chats: initialChats, activeChatId: initialActiveChatId, pantiData, auth }: PantiChatProps) {
  const [chats, setChats] = useState<ChatItem[]>(initialChats);
  const [activeChatId, setActiveChatId] = useState<number | null>(initialActiveChatId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingIntervalRef = useRef<number | null>(null);

  const activeChat = chats.find(c => c.id_chat === activeChatId);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch messages function
  const fetchMessages = async (chatId: number, silent = false) => {
    if (!silent) setLoadingMessages(true);
    try {
      const response = await fetch(`/chat/${chatId}/messages`, {
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        }
      });
      if (response.status === 401) {
        window.location.href = '/login';
        return;
      }
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
        
        // Reset unread count for active chat in client-side state
        setChats(prevChats => {
          const updatedChats = prevChats.map(c => 
            c.id_chat === chatId ? { ...c, unread_count: 0 } : c
          );
          const totalUnread = updatedChats.reduce((sum, c) => sum + c.unread_count, 0);
          window.dispatchEvent(new CustomEvent('unread-chat-count-updated', {
            detail: { unread_chat_count: totalUnread }
          }));
          return updatedChats;
        });
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      if (!silent) setLoadingMessages(false);
    }
  };

  // Start polling
  const startPolling = (chatId: number) => {
    if (pollingIntervalRef.current) {
      window.clearInterval(pollingIntervalRef.current);
    }
    pollingIntervalRef.current = window.setInterval(() => {
      fetchMessages(chatId, true);
    }, 3000);
  };

  useEffect(() => {
    if (activeChatId) {
      fetchMessages(activeChatId);
      startPolling(activeChatId);
    } else {
      setMessages([]);
      if (pollingIntervalRef.current) {
        window.clearInterval(pollingIntervalRef.current);
      }
    }

    return () => {
      if (pollingIntervalRef.current) {
        window.clearInterval(pollingIntervalRef.current);
      }
    };
  }, [activeChatId]);

  const handleSelectChat = (chatId: number) => {
    setActiveChatId(chatId);
    const newUrl = `${window.location.pathname}?active_chat=${chatId}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeChatId) return;

    const messageText = inputMessage;
    setInputMessage('');

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
      const response = await fetch(`/chat/${activeChatId}/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify({ message: messageText }),
      });
      if (response.status === 401) {
        window.location.href = '/login';
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, data.message]);
        
        setChats(prevChats => 
          prevChats.map(c => 
            c.id_chat === activeChatId 
              ? { ...c, last_message: messageText, last_message_time: new Date().toISOString() } 
              : c
          ).sort((a, b) => {
            const timeA = a.last_message_time ? new Date(a.last_message_time).getTime() : 0;
            const timeB = b.last_message_time ? new Date(b.last_message_time).getTime() : 0;
            return timeB - timeA;
          })
        );
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleTabChange = (tab: PantiTabType) => {
    setIsMobileMenuOpen(false);
    if (tab === 'chat') return;
    router.visit(tab === 'dashboard' ? route('panti.dashboard') : `${route('panti.dashboard')}?tab=${tab}`);
  };

  const formatTime = (timeStr: string | null) => {
    if (!timeStr) return '';
    const date = new Date(timeStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex h-screen font-sans bg-white text-[#293681] overflow-hidden">
      <Head title="Pesan Chat - KawanBerbagi" />

      {/* ================= OVERLAY MOBILE ================= */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <div className={`
        fixed inset-y-0 left-0 z-50 h-full transform transition-transform duration-300 ease-in-out w-64 lg:w-64 lg:relative lg:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <PantiSidebar
          activeTab="chat"
          onTabChange={handleTabChange}
          orgName={pantiData.nama_yayasan}
        />
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-[#F8FAFC]">
        
        {/* Header Mobile Putih */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white z-30 shadow-md border-b border-gray-100">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-xl bg-[#4274D9] hover:bg-[#293681] text-white transition-colors"
            >
              <Menu size={20} />
            </button>
            <span className="font-extrabold text-[#293681] tracking-wide uppercase text-sm">Pesan Chat</span>
          </div>

          <div className="w-9 h-9 rounded-full bg-[#4274D9] flex items-center justify-center font-extrabold text-xs text-white shadow-xs">
            {pantiData?.nama_yayasan ? pantiData.nama_yayasan.charAt(0).toUpperCase() : 'P'}
          </div>
        </div>

        {/* Header Desktop */}
        <div className="hidden lg:block">
          <PantiHeader activeTab="chat" orgName={pantiData.nama_yayasan} />
        </div>

        {/* Chat UI Body Container */}
        <div className="flex-1 flex overflow-hidden p-4 md:p-6">
          <div className="flex-1 flex bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden h-full">
            
            {/* Left Column: Chat List */}
            <div className={`w-full md:w-80 flex flex-col border-r border-gray-100 ${activeChatId ? 'hidden md:flex' : 'flex'}`}>
              <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-[#F8FAFC]">
                <h3 className="font-extrabold text-[12pt] text-[#293681]">Daftar Percakapan</h3>
                <span className="text-[10px] bg-[#4274D9] text-white px-2 py-0.5 rounded-full font-bold">
                  {chats.length} Donatur
                </span>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
                {chats.length > 0 ? (
                  chats.map((chat) => {
                    const isSelected = chat.id_chat === activeChatId;
                    return (
                      <button
                        key={chat.id_chat}
                        onClick={() => handleSelectChat(chat.id_chat)}
                        className={`w-full p-4 flex items-start gap-3 text-left transition-all ${
                          isSelected 
                            ? 'bg-[#4274D9]/10 border-l-4 border-[#4274D9]' 
                            : 'hover:bg-[#4274D9]/5 border-l-4 border-transparent'
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full bg-[#4274D9] text-white shrink-0 overflow-hidden flex items-center justify-center font-bold relative border border-gray-100 shadow-sm">
                          {chat.donor.foto_profil ? (
                            <img src={chat.donor.foto_profil} className="w-full h-full object-cover" alt="Avatar" />
                          ) : (
                            <span>{chat.donor.nama_lengkap.charAt(0)}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline mb-0.5">
                            <h4 className="font-bold text-[10pt] text-[#293681] truncate">{chat.donor.nama_lengkap}</h4>
                            <span className="text-[9px] text-gray-400 font-medium">
                              {formatTime(chat.last_message_time)}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500 truncate pr-4">
                            {chat.last_message || 'Belum ada pesan.'}
                          </p>
                        </div>
                        {chat.unread_count > 0 && (
                          <div className="bg-red-500 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center shrink-0 self-center shadow-xs">
                            {chat.unread_count}
                          </div>
                        )}
                      </button>
                    );
                  })
                ) : (
                  <div className="text-center py-12 px-4 text-gray-400">
                    <MessageSquare size={32} className="mx-auto mb-2 opacity-40 text-[#293681]" />
                    <p className="text-xs font-bold">Belum ada obrolan.</p>
                    <p className="text-[10px] mt-1 text-gray-500">Hanya donatur yang dapat memulai obrolan terlebih dahulu.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Active Chat Pane */}
            <div className={`flex-1 flex flex-col bg-[#F9F8F6] ${!activeChatId ? 'hidden md:flex items-center justify-center text-center p-8' : 'flex'}`}>
              {activeChat ? (
                <>
                  {/* Chat Pane Header */}
                  <div className="h-16 px-4 border-b border-gray-100 bg-white flex items-center gap-3 shrink-0">
                    <button 
                      onClick={() => setActiveChatId(null)}
                      className="md:hidden p-1 rounded-lg hover:bg-gray-100 text-[#293681]"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    
                    <div className="w-9 h-9 rounded-full bg-[#4274D9] text-white shrink-0 overflow-hidden flex items-center justify-center font-bold shadow-xs">
                      {activeChat.donor.foto_profil ? (
                        <img src={activeChat.donor.foto_profil} className="w-full h-full object-cover" alt="Avatar" />
                      ) : (
                        <span>{activeChat.donor.nama_lengkap.charAt(0)}</span>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-extrabold text-[11pt] text-[#293681] truncate">{activeChat.donor.nama_lengkap}</h4>
                      <p className="text-[8pt] text-gray-400 font-medium">Donatur</p>
                    </div>
                  </div>

                  {/* Chat Messages List */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col">
                    {loadingMessages ? (
                      <div className="flex-1 flex items-center justify-center text-sm text-gray-400 font-semibold">
                        Memuat riwayat chat...
                      </div>
                    ) : messages.length > 0 ? (
                      messages.map((msg) => {
                        const isMe = msg.id_sender === auth.user.id_user;
                        return (
                          <div 
                            key={msg.id_message} 
                            className={`flex flex-col max-w-[75%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}
                          >
                            <div 
                              className={`p-3 rounded-2xl text-sm font-semibold shadow-xs ${
                                isMe 
                                  ? 'bg-[#4274D9] text-white rounded-tr-none shadow-sm shadow-[#4274D9]/20' 
                                  : 'bg-white border border-gray-200/80 rounded-tl-none text-[#293681]'
                              }`}
                            >
                              <p className="whitespace-pre-wrap break-words leading-relaxed">{msg.message}</p>
                            </div>
                            <div className="flex items-center gap-1 mt-1 px-1">
                              <span className="text-xs text-gray-400">
                                {formatTime(msg.created_at)}
                              </span>
                              {isMe && (
                                msg.is_read ? (
                                  <CheckCheck size={11} className="text-blue-500" />
                                ) : (
                                  <Check size={11} className="text-gray-400" />
                                )
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-400">
                        <MessageSquare size={36} className="mb-2 opacity-30 text-[#293681]" />
                        <p className="text-sm font-bold">Belum ada percakapan</p>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Chat Input Bar */}
                  <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2 shrink-0">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Tulis pesan..."
                      className="flex-1 px-4 py-2.5 bg-gray-50 rounded-xl text-sm outline-none text-[#293681] placeholder-gray-400 border border-transparent focus:bg-white focus:border-[#4274D9] focus:ring-2 focus:ring-[#4274D9]/20 transition-all font-semibold"
                    />
                    <button
                      type="submit"
                      disabled={!inputMessage.trim()}
                      className="w-10 h-10 rounded-xl bg-[#4274D9] hover:bg-[#293681] text-white flex items-center justify-center transition shadow-md shadow-[#4274D9]/20 disabled:opacity-50 cursor-pointer"
                    >
                      <Send size={16} />
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-gray-400 h-full">
                  <div className="w-16 h-16 rounded-full bg-[#4274D9]/10 flex items-center justify-center text-[#4274D9] mb-4">
                    <MessageSquare size={32} />
                  </div>
                  <h3 className="font-extrabold text-sm text-[#293681]">Pesan Obrolan Anda</h3>
                  <p className="text-xs text-gray-500 mt-1 max-w-sm">
                    Pilih salah satu donatur di daftar sebelah kiri untuk mulai membaca dan mengirimkan pesan.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}