import React, { useState, useEffect, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import { 
  Send, Menu, MessageSquare, ArrowLeft, Check, CheckCheck, Paperclip, X
} from 'lucide-react';
import AdminSidebar, { TabType } from '@/Components/Admin/AdminSidebar';
import AdminHeader from '@/Components/Admin/AdminHeader';
import InlineSpinner from '@/Components/UI/InlineSpinner';
import { useToast } from '@/Components/UI/Toast';
import EmptyState from '@/Components/UI/EmptyState';

interface ChatItem {
  id_chat: number;
  participant: {
    name: string;
    foto_profil: string | null;
    type: 'Panti' | 'Donatur';
    username: string;
  };
  last_message: string | null;
  last_message_time: string | null;
  unread_count: number;
}

interface Message {
  id_message: number | string;
  id_chat: number | string;
  id_sender: number | string;
  message?: string | null;
  image_path?: string | null;
  is_read: boolean;
  created_at: string;
}

interface AdminChatProps {
  chats: ChatItem[];
  activeChatId: number | null;
  auth: any;
}

function AdminChatContent({ chats: initialChats, activeChatId: initialActiveChatId, auth }: AdminChatProps) {
  const [chats, setChats] = useState<ChatItem[]>(initialChats);
  const [activeChatId, setActiveChatId] = useState<number | null>(initialActiveChatId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const { showToast } = useToast();
  const [isSending, setIsSending] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancelImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!inputMessage.trim() && !selectedImage) || !activeChatId || isSending) return;

    const messageText = inputMessage;
    const imageFile = selectedImage;

    setInputMessage('');
    handleCancelImage();
    setIsSending(true);

    const tempId = 'temp-' + Date.now();
    const tempMsg: Message = {
      id_message: tempId,
      id_chat: activeChatId,
      id_sender: auth.user.id_user,
      message: messageText || 'Mengirim gambar...',
      is_read: false,
      created_at: new Date().toISOString(),
    };

    setMessages(prev => [...prev, tempMsg]);

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
      const formData = new FormData();
      if (messageText.trim()) {
        formData.append('message', messageText);
      }
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await fetch(`/chat/${activeChatId}/send`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: formData,
      });

      if (response.status === 401) {
        window.location.href = '/login';
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => prev.map(m => m.id_message === tempId ? data.message : m));
        
        setChats(prevChats => 
          prevChats.map(c => 
            c.id_chat === activeChatId 
              ? { ...c, last_message: messageText || 'Mengirim gambar', last_message_time: new Date().toISOString() } 
              : c
          ).sort((a, b) => {
            const timeA = a.last_message_time ? new Date(a.last_message_time).getTime() : 0;
            const timeB = b.last_message_time ? new Date(b.last_message_time).getTime() : 0;
            return timeB - timeA;
          })
        );
      } else {
        setMessages(prev => prev.filter(m => m.id_message !== tempId));
        showToast('Gagal mengirim pesan chat. Silakan periksa koneksi Anda.', 'error', 'Pesan Gagal Terkirim');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => prev.filter(m => m.id_message !== tempId));
      showToast('Terjadi kesalahan jaringan saat mengirim pesan.', 'error', 'Pesan Gagal Terkirim');
    } finally {
      setIsSending(false);
    }
  };

  const handleTabChange = (tab: TabType) => {
    setIsMobileMenuOpen(false);
    if (tab === 'chat') return;
    router.visit(tab === 'dashboard' ? route('admin.dashboard') : `${route('admin.dashboard')}?tab=${tab}`);
  };

  const formatTime = (timeStr: string | null) => {
    if (!timeStr) return '';
    const date = new Date(timeStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex h-screen font-sans bg-white text-[#293681] overflow-hidden">
      <Head title="Admin Chat - KawanBerbagi" />

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
        <AdminSidebar
          activeTab="chat"
          onTabChange={handleTabChange}
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
            <span className="font-extrabold text-[#293681] tracking-wide uppercase text-sm">Pesan Chat Admin</span>
          </div>

          <div className="w-9 h-9 rounded-full bg-[#4274D9] flex items-center justify-center font-extrabold text-xs text-white shadow-xs">
            AD
          </div>
        </div>

        {/* Header Desktop */}
        <div className="hidden lg:block">
          <AdminHeader activeTab="chat" />
        </div>

        {/* Chat UI Body Container */}
        <div className="flex-1 flex overflow-hidden p-4 md:p-6">
          <div className="flex-1 flex bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden h-full">
            
            {/* Left Column: Chat List */}
            <div className={`w-full md:w-80 flex flex-col border-r border-gray-100 ${activeChatId ? 'hidden md:flex' : 'flex'}`}>
              <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-[#F8FAFC]">
                <h3 className="font-extrabold text-[12pt] text-[#293681]">Percakapan</h3>
                <span className="text-[10px] bg-[#4274D9] text-white px-2 py-0.5 rounded-full font-bold">
                  {chats.length} Obrolan
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
                          {chat.participant.foto_profil ? (
                            <img src={chat.participant.foto_profil} className="w-full h-full object-cover" alt="Avatar" />
                          ) : (
                            <span>{chat.participant.name.charAt(0)}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline mb-0.5">
                            <div className="flex items-center gap-1.5 min-w-0 flex-1">
                              <h4 className="font-bold text-[10pt] text-[#293681] truncate">{chat.participant.name}</h4>
                              <span className={`shrink-0 text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-full ${
                                chat.participant.type === 'Panti' 
                                  ? 'bg-[#D0E7E6] text-[#4274D9]' 
                                  : 'bg-[#F59E0B]/15 text-[#F59E0B]'
                              }`}>
                                {chat.participant.type}
                              </span>
                            </div>
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
                    <p className="text-[10px] mt-1 text-gray-500">Hubungi panti atau donatur dari menu manajemen.</p>
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
                      {activeChat.participant.foto_profil ? (
                        <img src={activeChat.participant.foto_profil} className="w-full h-full object-cover" alt="Avatar" />
                      ) : (
                        <span>{activeChat.participant.name.charAt(0)}</span>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-[11pt] text-[#293681] truncate">{activeChat.participant.name}</h4>
                        <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-full ${
                          activeChat.participant.type === 'Panti' 
                            ? 'bg-[#D0E7E6] text-[#4274D9]' 
                            : 'bg-[#F59E0B]/15 text-[#F59E0B]'
                        }`}>
                          {activeChat.participant.type}
                        </span>
                      </div>
                      <p className="text-[8pt] text-gray-400 font-medium">
                        {activeChat.participant.type === 'Panti' && activeChat.participant.username ? `@${activeChat.participant.username}` : activeChat.participant.username}
                      </p>
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
                              {msg.image_path && (
                                <div className="mb-2 max-w-xs overflow-hidden rounded-xl cursor-pointer hover:opacity-95 transition-opacity">
                                  <img 
                                    src={msg.image_path} 
                                    alt="Uploaded" 
                                    className="max-h-60 w-full object-cover"
                                    onClick={() => setLightboxImage(msg.image_path || null)}
                                  />
                                </div>
                              )}
                              {msg.message && <p className="whitespace-pre-wrap break-words leading-relaxed">{msg.message}</p>}
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
                        <p className="text-sm font-bold">Kirim pesan pertama Anda</p>
                        <p className="text-xs mt-1">Mulailah obrolan hangat dengan {activeChat.participant.name}.</p>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Chat Input Bar */}
                  <div className="border-t border-gray-100 bg-white flex flex-col shrink-0">
                    {imagePreview && (
                      <div className="px-4 py-2.5 bg-gray-50/50 border-b border-gray-100 flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-gray-200 shrink-0 bg-white shadow-xs">
                          <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                          <button
                            type="button"
                            onClick={handleCancelImage}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-sm cursor-pointer flex items-center justify-center"
                          >
                            <X size={10} />
                          </button>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-600 truncate">{selectedImage?.name}</p>
                          <p className="text-[10px] text-gray-400 font-medium">{((selectedImage?.size ?? 0) / 1024).toFixed(0)} KB</p>
                        </div>
                      </div>
                    )}
                    
                    <form onSubmit={handleSendMessage} className="p-3 bg-white flex gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-10 h-10 rounded-xl border border-gray-200 text-gray-500 hover:text-gray-700 flex items-center justify-center transition shrink-0 hover:bg-gray-50 cursor-pointer"
                      >
                        <Paperclip size={16} />
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageSelect}
                        accept="image/*"
                        className="hidden"
                      />
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Tulis pesan..."
                        className="flex-1 px-4 py-2.5 bg-gray-50 rounded-xl text-sm outline-none placeholder-gray-400 border border-transparent focus:bg-white focus:border-[#4274D9] focus:ring-2 focus:ring-[#4274D9]/20 transition-all font-semibold text-[#293681]"
                      />
                      <button
                        type="submit"
                        disabled={(!inputMessage.trim() && !selectedImage) || isSending}
                        className="w-10 h-10 rounded-xl bg-[#4274D9] hover:bg-[#293681] text-white flex items-center justify-center transition shadow-md shadow-[#4274D9]/20 disabled:opacity-50 cursor-pointer"
                      >
                        {isSending ? <InlineSpinner color="white" size="sm" /> : <Send size={16} />}
                      </button>
                    </form>
                  </div>

                  {/* Lightbox Modal */}
                  {lightboxImage && (
                    <div 
                      className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-xs cursor-pointer"
                      onClick={() => setLightboxImage(null)}
                    >
                      <button 
                        className="absolute top-5 right-5 text-white hover:text-gray-300 p-2 transition-colors"
                        onClick={() => setLightboxImage(null)}
                      >
                        <X size={24} />
                      </button>
                      <img 
                        src={lightboxImage} 
                        className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl transition-transform duration-300 scale-100" 
                        alt="Enlarged view" 
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  )}
                </>
              ) : (
                <EmptyState
                  mode="accomplishment"
                  icon={MessageSquare}
                  title="Pesan Obrolan Admin"
                  description="Pilih salah satu percakapan di sebelah kiri untuk mulai mengobrol atau hubungi panti/donatur langsung dari tombol pesan di samping daftar nama mereka."
                  className="h-full border-none"
                />
              )}
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}

export default function AdminChat(props: AdminChatProps) {
  return (
    <AdminChatContent {...props} />
  );
}