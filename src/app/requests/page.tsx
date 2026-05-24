'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { useStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Clock, CheckCircle, Package, ArrowRight, MessageCircle } from 'lucide-react';

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  pending: { label: 'Đang chờ', className: 'bg-amber-100 text-amber-700' },
  accepted: { label: 'Đã duyệt', className: 'bg-green-100 text-green-700' },
  rejected: { label: 'Đã từ chối', className: 'bg-red-100 text-red-700' },
  collected: { label: 'Đã nhận', className: 'bg-blue-100 text-blue-700' },
};

export default function RequestsPage() {
  const { currentUser, requests, fetchRequests, updateRequestStatus, startConversation } = useStore();
  const [tab, setTab] = useState<'sent' | 'received'>('received');

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  if (!currentUser) {
    return (
      <main className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center p-4">
          <div className="text-center card rounded-2xl p-10 max-w-sm">
            <div className="text-5xl mb-4">🔒</div>
            <h2 className="text-xl font-bold mb-2">Vui lòng đăng nhập</h2>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mb-6">Bạn cần đăng nhập để quản lý yêu cầu.</p>
            <Link href="/" className="btn-primary">Về trang chủ</Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  const sentRequests = requests.filter(r => r.requesterId === currentUser.id);
  const receivedRequests = requests.filter(r => r.requesterId !== currentUser.id);

  const displayedRequests = tab === 'sent' ? sentRequests : receivedRequests;

  const handleChat = async (otherUserId: string, otherUserName: string, itemId: string, itemTitle: string) => {
    const convId = await startConversation(otherUserId, otherUserName, itemId, itemTitle);
    window.open(`/chat/${convId}`, '_blank');
  };

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow pt-28 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Quản lý yêu cầu</h1>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">Theo dõi và duyệt các yêu cầu nhận đồ</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-8 bg-[hsl(var(--secondary))] p-1 rounded-xl w-fit">
            <button
              onClick={() => setTab('received')}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === 'received' ? 'bg-white shadow-sm' : 'hover:text-[hsl(var(--foreground))] text-[hsl(var(--muted-foreground))]'}`}
            >
              Yêu cầu đến ({receivedRequests.length})
            </button>
            <button
              onClick={() => setTab('sent')}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === 'sent' ? 'bg-white shadow-sm' : 'hover:text-[hsl(var(--foreground))] text-[hsl(var(--muted-foreground))]'}`}
            >
              Yêu cầu đã gửi ({sentRequests.length})
            </button>
          </div>

          {displayedRequests.length === 0 ? (
            <div className="card rounded-2xl p-12 text-center">
              <div className="text-5xl mb-4">📋</div>
              <h3 className="text-xl font-bold mb-2">Chưa có yêu cầu nào</h3>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                {tab === 'received' ? 'Khi có người yêu cầu nhận đồ của bạn, họ sẽ hiển thị ở đây.' : 'Bạn chưa gửi yêu cầu nhận món đồ nào.'}
              </p>
              <Link href="/items" className="btn-primary mt-6 inline-flex">Khám phá món đồ</Link>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <div className="space-y-4">
                {displayedRequests.map((req, idx) => (
                  <motion.div
                    key={req.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                    layout
                    className="card rounded-2xl p-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_BADGE[req.status].className}`}>
                            {req.status === 'pending' && <Clock size={12} className="inline mr-1" />}
                            {req.status === 'accepted' && <Check size={12} className="inline mr-1" />}
                            {req.status === 'collected' && <Package size={12} className="inline mr-1" />}
                            {req.status === 'rejected' && <X size={12} className="inline mr-1" />}
                            {STATUS_BADGE[req.status].label}
                          </div>
                          <span className="text-xs text-[hsl(var(--muted-foreground))]">{new Date(req.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>

                        <Link href={`/detail/${req.itemId}`} className="text-lg font-bold hover:text-[hsl(var(--primary))] transition-colors mb-1 block">
                          {req.itemTitle}
                        </Link>

                        <p className="text-sm text-[hsl(var(--muted-foreground))]">
                          {tab === 'received'
                            ? <><span className="font-medium text-[hsl(var(--foreground))]">{req.requesterName}</span> muốn nhận món đồ này</>
                            : <span>Gửi đến <span className="font-medium text-[hsl(var(--foreground))]">{req.posterName}</span></span>
                          }
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 shrink-0">
                        {tab === 'received' && req.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateRequestStatus(req.id, 'accepted')}
                              className="px-4 py-2 rounded-xl bg-green-500 text-white text-sm font-bold hover:bg-green-600 transition-colors flex items-center gap-1.5"
                            >
                              <Check size={16} /> Duyệt
                            </button>
                            <button
                              onClick={() => updateRequestStatus(req.id, 'rejected')}
                              className="px-4 py-2 rounded-xl bg-red-100 text-red-600 text-sm font-bold hover:bg-red-200 transition-colors flex items-center gap-1.5"
                            >
                              <X size={16} /> Từ chối
                            </button>
                          </>
                        )}
                        {tab === 'received' && req.status === 'accepted' && (
                          <>
                            <button
                              onClick={() => updateRequestStatus(req.id, 'collected')}
                              className="px-4 py-2 rounded-xl bg-blue-500 text-white text-sm font-bold hover:bg-blue-600 transition-colors flex items-center gap-1.5"
                            >
                              <Package size={16} /> Xác nhận đã nhận
                            </button>
                            <button
                              onClick={() => handleChat(req.requesterId, req.requesterName, req.itemId, req.itemTitle)}
                              className="px-4 py-2 rounded-xl bg-[hsl(var(--secondary))] text-sm font-medium hover:bg-[hsl(var(--border))] transition-colors"
                            >
                              <MessageCircle size={16} />
                            </button>
                          </>
                        )}
                        {tab === 'sent' && req.status === 'pending' && (
                          <span className="text-xs text-[hsl(var(--muted-foreground))] italic flex items-center">Đang chờ phản hồi</span>
                        )}
                        {tab === 'sent' && req.status === 'accepted' && (
                          <span className="text-xs text-green-600 font-medium flex items-center"><CheckCircle size={16} className="mr-1" /> Đã duyệt</span>
                        )}
                        {req.status === 'collected' && (
                          <span className="text-xs text-blue-600 font-medium flex items-center"><Package size={16} className="mr-1" /> Hoàn tất</span>
                        )}
                        <Link href={`/detail/${req.itemId}`} className="px-4 py-2 rounded-xl bg-[hsl(var(--secondary))] text-sm font-medium hover:bg-[hsl(var(--border))] transition-colors flex items-center">
                          <ArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
