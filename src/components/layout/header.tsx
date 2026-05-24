'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { Share2, Menu, X, User, LogOut, Heart, MessageCircle, ClipboardList, LogIn } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import LoginModal from '@/components/auth/login-modal';

const NAV_ITEMS = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Tìm đồ', href: '/items' },
  { label: 'Đăng món đồ', href: '/post' },
  { label: 'Tác động', href: '/impact' },
];

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const currentUser = useStore(s => s.currentUser);
  const logout = useStore(s => s.logout);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'py-2.5 glass-premium shadow-lg' : 'py-4 bg-transparent'
      }`}>
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center group">
            <div className="h-10 md:h-12 w-auto relative transition-all group-hover:scale-[1.03] duration-300 group-hover:drop-shadow-[0_0_12px_rgba(59,130,246,0.3)]">
              <Image 
                src="/logo.png" 
                alt="ĐN-UniShare Logo" 
                width={200} 
                height={48} 
                className="h-full w-auto object-contain" 
                priority
              />
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  pathname === item.href
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md shadow-blue-500/25'
                    : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--secondary))] hover:shadow-sm'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-[hsl(var(--secondary))] transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-[hsl(var(--primary))] flex items-center justify-center text-white text-sm font-bold">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium max-w-[100px] truncate">{currentUser.name}</span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 glass-premium rounded-2xl shadow-2xl py-2 animate-in">
                    <div className="px-4 py-3 border-b border-[hsl(var(--border))]">
                      <p className="font-bold text-sm">{currentUser.name}</p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))] truncate">{currentUser.email}</p>
                    </div>
                    <Link href="/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[hsl(var(--secondary))] transition-colors">
                      <User size={16} /> Trang cá nhân
                    </Link>
                    <Link href="/requests" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[hsl(var(--secondary))] transition-colors">
                      <ClipboardList size={16} /> Yêu cầu
                    </Link>
                    <Link href="/favorites" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[hsl(var(--secondary))] transition-colors">
                      <Heart size={16} /> Yêu thích
                    </Link>
                    <Link href="/chat" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[hsl(var(--secondary))] transition-colors">
                      <MessageCircle size={16} /> Tin nhắn
                    </Link>
                    <div className="border-t border-[hsl(var(--border))] mt-1 pt-1">
                      <button onClick={() => { logout(); setIsProfileOpen(false); }} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors w-full">
                        <LogOut size={16} /> Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => setIsLoginOpen(true)} className="btn-outline text-sm">
                <LogIn size={14} /> Đăng nhập
              </button>
            )}
            <Link href="/post" className="btn-primary text-sm">
              <Share2 size={14} />
              Đăng món đồ
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-[hsl(var(--secondary))] transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden glass-premium border-t border-white/30 shadow-2xl animate-in">
            <nav className="flex flex-col p-4 gap-1">
              {currentUser && (
                <div className="flex items-center gap-3 px-4 py-3 border-b border-[hsl(var(--border))] mb-2">
                  <div className="h-10 w-10 rounded-full bg-[hsl(var(--primary))] flex items-center justify-center text-white font-bold">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{currentUser.name}</p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">{currentUser.faculty}</p>
                  </div>
                </div>
              )}
              {NAV_ITEMS.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'bg-[hsl(var(--primary))] text-white'
                      : 'hover:bg-[hsl(var(--secondary))]'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {currentUser && (
                <>
                  <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-sm font-medium hover:bg-[hsl(var(--secondary))] flex items-center gap-2">
                    <User size={16} /> Trang cá nhân
                  </Link>
                  <Link href="/requests" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-sm font-medium hover:bg-[hsl(var(--secondary))] flex items-center gap-2">
                    <ClipboardList size={16} /> Yêu cầu
                  </Link>
                  <Link href="/favorites" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-sm font-medium hover:bg-[hsl(var(--secondary))] flex items-center gap-2">
                    <Heart size={16} /> Yêu thích
                  </Link>
                  <Link href="/chat" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-sm font-medium hover:bg-[hsl(var(--secondary))] flex items-center gap-2">
                    <MessageCircle size={16} /> Tin nhắn
                  </Link>
                </>
              )}
              {currentUser ? (
                <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="mt-2 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 flex items-center gap-2">
                  <LogOut size={16} /> Đăng xuất
                </button>
              ) : (
                <button onClick={() => { setIsLoginOpen(true); setIsMobileMenuOpen(false); }} className="mt-2 btn-outline justify-center">
                  <LogIn size={16} /> Đăng nhập
                </button>
              )}
              <Link
                href="/post"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-2 btn-primary justify-center"
              >
                <Share2 size={16} />
                Đăng món đồ mới
              </Link>
            </nav>
          </div>
        )}
      </header>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
