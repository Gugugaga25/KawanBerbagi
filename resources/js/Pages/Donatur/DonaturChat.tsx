import React, { useState, useEffect, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import { 
  Send, Menu, MessageSquare, ArrowLeft, Check, CheckCheck, Clock, User2, Bot, Paperclip, X, Trash2
} from 'lucide-react';
import DonaturSidebar, { DonaturTabType } from '@/Components/Donatur/DonaturSidebar';
import DonaturHeader from '@/Components/Donatur/DonaturHeader';
import { useToast } from '@/Components/UI/Toast';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';

interface Message {
  id_message: number | string;
  id_chat: number | string;
  id_sender: number | string;
  message?: string | null;
  image_path?: string | null;
  is_read: boolean;
  created_at: string;
  shelters?: Array<{
    id_shelter: number;
    nama_yayasan: string;
    alamat: string;
    foto_profil: string | null;
    username: string;
    needs: Array<{
      id_needs: number;
      nama_kebutuhan: string;
      jumlah: number;
      terkumpul: number;
      satuan: string;
      kategori: string;
    }>;
  }>;
}

interface ChatItem {
  id_chat: number;
  shelter: {
    id_shelter: number;
    nama_yayasan: string;
    foto_profil: string | null;
    username: string;
  };
  last_message: string | null;
  last_message_time: string | null;
  unread_count: number;
}

interface DonaturChatProps {
  chats: ChatItem[];
  activeChatId: number | string | null;
  donaturData: {
    id_donor: number;
    nama_lengkap: string;
    foto_profil: string | null;
  };
  auth: any;
}

export default function DonaturChat({ chats: initialChats, activeChatId: initialActiveChatId, donaturData, auth }: DonaturChatProps) {
  const { showToast } = useToast();
  const [chats, setChats] = useState<ChatItem[]>(initialChats);
  const [activeChatId, setActiveChatId] = useState<number | string | null>(initialActiveChatId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingIntervalRef = useRef<number | null>(null);
  const [showClearAiModal, setShowClearAiModal] = useState(false);

  const isAiSelected = activeChatId === 'ai-assistant';

  const activeChat = isAiSelected
    ? {
        id_chat: 'ai-assistant',
        shelter: {
          id_shelter: 0,
          nama_yayasan: 'Asisten AI KawanBerbagi',
          foto_profil: null,
          username: 'asisten_ai',
        },
        last_message: null,
        last_message_time: null,
        unread_count: 0
      }
    : chats.find(c => c.id_chat === activeChatId);

  // Fetch AI messages from backend database
  const fetchAiMessages = async (silent = false) => {
    if (!silent) setLoadingMessages(true);
    try {
      const response = await fetch('/chat/bot/messages', {
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
      }
    } catch (error) {
      console.error('Error fetching AI messages:', error);
    } finally {
      if (!silent) setLoadingMessages(false);
    }
  };

  const executeClearAiHistory = async () => {
    setShowClearAiModal(false);
    setLoadingMessages(true);
    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
      const response = await fetch('/chat/bot/clear', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-TOKEN': csrfToken,
        }
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
        showToast('Riwayat obrolan Asisten AI berhasil dihapus.', 'success', 'Riwayat Dihapus');
      }
    } catch (error) {
      console.error('Error clearing AI history:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

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
    }, 3000); // Poll every 3 seconds
  };

  useEffect(() => {
    if (activeChatId) {
      if (activeChatId === 'ai-assistant') {
        if (pollingIntervalRef.current) {
          window.clearInterval(pollingIntervalRef.current);
        }
        fetchAiMessages();
      } else {
        fetchMessages(activeChatId as number);
        startPolling(activeChatId as number);
      }
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

  useEffect(() => {
    if (activeChatId) {
      const urlParams = new URLSearchParams(window.location.search);
      const initialMessage = urlParams.get('message');
      if (initialMessage) {
        setInputMessage(initialMessage);
        
        // Clean up parameter from URL so it doesn't reappear on page refresh
        const newUrl = `${window.location.pathname}?active_chat=${activeChatId}`;
        window.history.pushState({ path: newUrl }, '', newUrl);
      }
    }
  }, [activeChatId]);

  const handleSelectChat = (chatId: number | string) => {
    setActiveChatId(chatId);
    // Update URL to make it bookmarkable
    const newUrl = `${window.location.pathname}?active_chat=${chatId}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
  };

  const handleSelectAiChat = () => {
    handleSelectChat('ai-assistant');
  };

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
    if ((!inputMessage.trim() && !selectedImage) || !activeChatId) return;

    const messageText = inputMessage;
    const imageFile = selectedImage;

    setInputMessage('');
    handleCancelImage();

    if (isAiSelected) {
      const tempUserMsg: Message = {
        id_message: `temp-user-${Date.now()}`,
        id_chat: 'ai-assistant',
        id_sender: auth.user.id_user,
        message: messageText,
        is_read: true,
        created_at: new Date().toISOString(),
      };

      setMessages(prev => [...prev, tempUserMsg]);
      setIsBotTyping(true);

      try {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
        const response = await fetch('/chat/bot/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-TOKEN': csrfToken,
          },
          body: JSON.stringify({ message: messageText }),
        });

        if (response.ok) {
          const data = await response.json();
          setMessages(prev => {
            const filtered = prev.filter(m => m.id_message !== tempUserMsg.id_message);
            return [...filtered, data.user_message, data.message];
          });
        } else {
          const errorMsg: Message = {
            id_message: `ai-err-${Date.now()}`,
            id_chat: 'ai-assistant',
            id_sender: 'ai-assistant-sender',
            message: 'Maaf, saya tidak dapat memproses pesan Anda saat ini. Silakan coba beberapa saat lagi.',
            is_read: true,
            created_at: new Date().toISOString(),
          };
          setMessages(prev => [...prev, errorMsg]);
        }
      } catch (error) {
        console.error('Error with chatbot response:', error);
      } finally {
        setIsBotTyping(false);
      }
    } else {
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
          // Append sent message
          setMessages(prev => [...prev, data.message]);
          
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
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handleTabChange = (tab: DonaturTabType) => {
    setIsMobileMenuOpen(false);
    if (tab === 'chat') return;
    router.visit(tab === 'dashboard' ? route('donatur.dashboard') : `${route('donatur.dashboard')}?tab=${tab}`);
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
        <DonaturSidebar
          activeTab="chat"
          onTabChange={handleTabChange}
          donaturData={donaturData}
        />
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-[#F4F3EF]">
        
        {/* Header Mobile */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white z-30 shadow-md">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-xl bg-[#4274D9] hover:bg-[#293681] text-white transition-colors"
            >
              <Menu size={20} />
            </button>
            <span className="font-extrabold text-[#293681] tracking-wide uppercase text-sm">Pesan Chat</span>
          </div>
        </div>

        {/* Header Desktop */}
        <div className="hidden lg:block">
          <DonaturHeader activeTab="chat" donaturData={donaturData} />
        </div>

        {/* Chat UI Body Container */}
        <div className="flex-1 flex overflow-hidden p-4 md:p-6">
          <div className="flex-1 flex bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden h-full">
            
            {/* Left Column: Chat List */}
            <div className={`w-full md:w-80 flex flex-col border-r border-gray-100 ${activeChatId ? 'hidden md:flex' : 'flex'}`}>
              <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-[#F4F3EF]/30">
                <h3 className="font-extrabold text-[12pt]">Daftar Percakapan</h3>
                <span className="text-[10px] bg-[#4274D9] text-white px-2 py-0.5 rounded-full font-bold">
                  {chats.length} Panti
                </span>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
                {/* Pinned AI Assistant */}
                <button
                  onClick={handleSelectAiChat}
                  className={`w-full p-4 flex items-start gap-3 text-left transition-all border-b border-gray-100 ${
                    isAiSelected 
                      ? 'bg-[#4274D9]/10 border-l-4 border-[#4274D9]' 
                      : 'hover:bg-gray-50 border-l-4 border-transparent'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-[#4274D9] text-white shrink-0 overflow-hidden flex items-center justify-center font-bold relative border border-gray-100 shadow-sm flex flex-col">
                    <Bot size={20} className="text-[#fff]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h4 className="font-extrabold text-[10pt] text-[#293681] truncate">Asisten AI KawanBerbagi</h4>
                      <span className="text-[9px] text-[#4274D9] font-bold uppercase tracking-wider">AI Bot</span>
                    </div>
                    <p className="text-[11px] text-gray-500 truncate pr-4 font-semibold">
                      Tanyakan rekomendasi panti asuhan & kebutuhan donasi.
                    </p>
                  </div>
                </button>

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
                          {chat.shelter.foto_profil ? (
                            <img src={chat.shelter.foto_profil} className="w-full h-full object-cover" alt="Avatar" />
                          ) : (
                            <span>{chat.shelter.nama_yayasan.charAt(0)}</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline mb-0.5">
                            <h4 className="font-bold text-[10pt] text-[#293681] truncate">{chat.shelter.nama_yayasan}</h4>
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
                    <MessageSquare size={32} className="mx-auto mb-2 opacity-40 text-[#4274D9]" />
                    <p className="text-xs font-bold">Belum ada obrolan.</p>
                    <p className="text-[10px] mt-1 text-gray-500">Mulai chat dengan panti melalui halaman "Cari Panti".</p>
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
                    
                    <div className="w-9 h-9 rounded-full bg-[#4274D9] text-white shrink-0 overflow-hidden flex items-center justify-center font-bold">
                      {isAiSelected ? (
                        <Bot size={18} className="text-[#fff]" />
                      ) : activeChat.shelter.foto_profil ? (
                        <img src={activeChat.shelter.foto_profil} className="w-full h-full object-cover" alt="Avatar" />
                      ) : (
                        <span>{activeChat.shelter.nama_yayasan.charAt(0)}</span>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-extrabold text-sm text-[#293681] truncate">{activeChat.shelter.nama_yayasan}</h4>
                      <p className="text-xs text-gray-400 font-medium">
                        {isAiSelected ? 'Online' : `@${activeChat.shelter.username}`}
                      </p>
                    </div>

                    {isAiSelected && (
                      <button
                        onClick={() => setShowClearAiModal(true)}
                        title="Hapus Riwayat Chat"
                        className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-all cursor-pointer flex items-center justify-center"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                  {/* Chat Messages List */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col">
                    {loadingMessages ? (
                      <div className="flex-1 flex items-center justify-center text-sm text-gray-400">
                        Memuat riwayat chat...
                      </div>
                    ) : messages.length > 0 ? (
                      messages.map((msg) => {
                        const isMe = msg.id_sender == auth.user.id_user;
                        return (
                          <div 
                            key={msg.id_message} 
                            className={`flex flex-col max-w-[75%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}
                          >
                            <div 
                              className={`p-3 rounded-2xl text-sm font-semibold shadow-xs ${
                                isMe 
                                  ? 'bg-[#4274D9] text-white rounded-tr-none' 
                                  : 'bg-white border border-gray-100 text-[#293681] rounded-tl-none'
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
                              
                              {/* Render Interactive Recommended Shelters Cards */}
                              {msg.shelters && msg.shelters.length > 0 && (
                                <div className="mt-3 space-y-3 w-full max-w-sm text-left">
                                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Rekomendasi Panti Asuhan:</p>
                                  <div className="grid grid-cols-1 gap-2.5">
                                    {msg.shelters.map((shelter) => (
                                      <div 
                                        key={shelter.id_shelter} 
                                        className="bg-[#F9F8F6] border border-gray-200/80 rounded-2xl p-3 shadow-xs hover:border-[#4274D9]/50 transition-all flex flex-col gap-2"
                                      >
                                        <div className="flex gap-2.5 items-center">
                                          <div className="w-8 h-8 rounded-full bg-[#4274D9] text-white shrink-0 overflow-hidden flex items-center justify-center font-bold text-xs border border-gray-50">
                                            {shelter.foto_profil ? (
                                              <img src={shelter.foto_profil} className="w-full h-full object-cover" alt="Avatar" />
                                            ) : (
                                              <span className="text-white">{shelter.nama_yayasan.charAt(0)}</span>
                                            )}
                                          </div>
                                          <div className="min-w-0 flex-1">
                                            <h5 className="font-extrabold text-xs text-[#293681] truncate">{shelter.nama_yayasan}</h5>
                                            <p className="text-[10px] text-gray-400 truncate">{shelter.alamat}</p>
                                          </div>
                                        </div>

                                        {/* Panti Specific Needs */}
                                        {shelter.needs && shelter.needs.length > 0 && (
                                          <div className="bg-white border border-gray-100 p-2 rounded-xl text-xs">
                                            <p className="font-bold text-gray-600 mb-1">Kebutuhan terdeteksi:</p>
                                            <ul className="space-y-0.5 text-gray-500 font-semibold">
                                              {shelter.needs.map((need: any) => (
                                                <li key={need.id_needs} className="flex justify-between items-center">
                                                  <span className="truncate pr-2">• {need.nama_kebutuhan}</span>
                                                  <span className="shrink-0 text-[#293681] font-bold">
                                                    {need.terkumpul}/{need.jumlah} {need.satuan}
                                                  </span>
                                                </li>
                                              ))}
                                            </ul>
                                          </div>
                                        )}

                                        <button
                                          type="button"
                                          onClick={() => router.visit(route('donatur.panti.show', { id: shelter.id_shelter }))}
                                          className="w-full py-1.5 bg-[#4274D9] hover:bg-[#293681] text-white text-xs font-bold rounded-xl transition text-center shadow-xs"
                                        >
                                          Kunjungi Profil
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-1 mt-1 px-1">
                              <span className="text-xs text-gray-400">
                                {formatTime(msg.created_at)}
                              </span>
                              {isMe && !isAiSelected && (
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
                        <p className="text-xs mt-1">Mulailah obrolan hangat dengan {activeChat.shelter.nama_yayasan}.</p>
                      </div>
                    )}
                    {isBotTyping && (
                      <div className="flex flex-col max-w-[75%] self-start items-start">
                        <div className="p-3 rounded-2xl text-sm font-semibold shadow-xs bg-white text-[#293681] border border-gray-100 rounded-tl-none flex items-center gap-1.5">
                          <span className="text-xs text-gray-400 animate-pulse font-semibold">Mengetik</span>
                          <span className="flex gap-1">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </span>
                        </div>
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
                    
                    <form onSubmit={handleSendMessage} className="p-3 flex gap-2">
                      {!isAiSelected && (
                        <>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-10 h-10 rounded-xl border border-gray-200 text-gray-500 hover:text-gray-700 flex items-center justify-center transition shrink-0 hover:bg-gray-50 cursor-pointer"
                            title="Kirim Gambar"
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
                        </>
                      )}
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Tulis pesan..."
                        className="flex-1 px-4 py-2.5 bg-[#F4F3EF] rounded-xl text-sm outline-none text-[#293681] placeholder-gray-400 border border-transparent focus:bg-white focus:border-[#4274D9] transition-all"
                      />
                      <button
                        type="submit"
                        disabled={!inputMessage.trim() && !selectedImage}
                        className="w-10 h-10 rounded-xl bg-[#4274D9] hover:bg-[#293681] text-white flex items-center justify-center transition shadow-sm disabled:opacity-50 cursor-pointer"
                      >
                        <Send size={16} />
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
                <div className="flex flex-col items-center justify-center p-8 text-gray-400 h-full">
                  <div className="w-16 h-16 rounded-full bg-[#4274D9]/10 flex items-center justify-center text-[#4274D9] mb-4">
                    <MessageSquare size={32} />
                  </div>
                  <h3 className="font-extrabold text-sm text-[#293681]">Pesan Obrolan Anda</h3>
                  <p className="text-xs text-gray-500 mt-1 max-w-sm">
                    Pilih salah satu panti di daftar sebelah kiri untuk mulai membaca dan mengirimkan pesan.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>

      {/* Modal Konfirmasi Hapus Riwayat Chat AI */}
      <Modal show={showClearAiModal} onClose={() => setShowClearAiModal(false)} maxWidth="sm">
        <div className="p-6">
          <div className="flex items-center gap-3 text-red-600 mb-3">
            <div className="p-2.5 bg-red-50 rounded-2xl">
              <Trash2 size={24} />
            </div>
            <h2 className="text-lg font-bold text-[#293681]">
              Hapus Riwayat AI
            </h2>
          </div>
          <p className="text-sm text-gray-500 font-medium leading-relaxed">
            Apakah Anda yakin ingin menghapus seluruh riwayat obrolan dengan Asisten AI?
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <SecondaryButton onClick={() => setShowClearAiModal(false)}>
              Batal
            </SecondaryButton>
            <DangerButton onClick={executeClearAiHistory}>
              Ya, Hapus
            </DangerButton>
          </div>
        </div>
      </Modal>

      </main>
    </div>
  );
}