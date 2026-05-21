'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Share2, Search, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

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

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'py-2.5 bg-white/95 backdrop-blur-md shadow-sm border-b border-[hsl(var(--border))]' : 'py-4 bg-transparent'
    }`}>
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <div className="h-10 md:h-12 w-auto relative transition-transform group-hover:scale-[1.02] duration-300">
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

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                pathname === item.href
                  ? 'bg-[hsl(var(--primary))] text-white shadow-sm'
                  : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--secondary))]'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/post" className="btn-primary text-sm">
            <Share2 size={14} />
            Đăng món đồ
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-[hsl(var(--secondary))] transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-[hsl(var(--border))] shadow-lg animate-in">
          <nav className="flex flex-col p-4 gap-1">
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
            <Link
              href="/post"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-3 btn-primary justify-center"
            >
              <Share2 size={16} />
              Đăng món đồ mới
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
