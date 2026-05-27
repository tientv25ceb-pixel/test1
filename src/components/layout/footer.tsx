import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Mail, Phone, Heart, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[var(--background)] border-t border-[var(--border)] pt-12 pb-6">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          <div>
            <Link href="/" className="flex items-center mb-4 group">
              <div className="h-10 w-auto relative transition-transform duration-300 group-hover:scale-[1.02]">
                <Image
                  src="/logo.png"
                  alt="ĐN-UniShare Logo"
                  width={160}
                  height={40}
                  className="h-full w-auto object-contain rounded-lg"
                />
              </div>
            </Link>
            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed max-w-xs">
              Nền tảng chia sẻ đồ dùng, sách vở và suất ăn cho sinh viên tại Đà Nẵng. Giảm lãng phí, lan tỏa sẻ chia.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-sm mb-4">Liên kết nhanh</h4>
            <ul className="space-y-2.5 text-sm text-[var(--muted-foreground)]">
              <li><Link href="/" className="hover:text-[var(--primary)] transition-colors">Trang chủ</Link></li>
              <li><Link href="/items" className="hover:text-[var(--primary)] transition-colors">Tìm đồ cần nhận</Link></li>
              <li><Link href="/post" className="hover:text-[var(--primary)] transition-colors">Đăng món đồ</Link></li>
              <li><Link href="/impact" className="hover:text-[var(--primary)] transition-colors">Tác động cộng đồng</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm mb-4">Danh mục</h4>
            <ul className="space-y-2.5 text-sm text-[var(--muted-foreground)]">
              <li><Link href="/items?category=sach" className="hover:text-[var(--primary)] transition-colors">📚 Sách giáo trình</Link></li>
              <li><Link href="/items?category=do-hoc-tap" className="hover:text-[var(--primary)] transition-colors">🎓 Đồ học tập</Link></li>
              <li><Link href="/items?category=do-ktx" className="hover:text-[var(--primary)] transition-colors">🏠 Đồ ký túc xá</Link></li>
              <li><Link href="/items?category=suatan" className="hover:text-[var(--primary)] transition-colors">🍜 Suất ăn & Voucher</Link></li>
              <li><Link href="/items?category=tailieu" className="hover:text-[var(--primary)] transition-colors">📄 Tài liệu</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm mb-4">Liên hệ</h4>
            <ul className="space-y-3 text-sm text-[var(--muted-foreground)]">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-[var(--primary)] shrink-0 mt-0.5" />
                <span>Làng Đại học Đà Nẵng</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-[var(--primary)] shrink-0" />
                <span>hello@dn-unishare.vn</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-[var(--primary)] shrink-0" />
                <span>0236 999 888</span>
              </li>
            </ul>
            <div className="flex gap-2 mt-4">
              <a href="#" className="h-8 w-8 rounded-full bg-[var(--secondary)] flex items-center justify-center hover:bg-[var(--primary)] hover:text-white transition-all text-[var(--muted-foreground)]" aria-label="Facebook">
                <Heart size={14} />
              </a>
              <a href="#" className="h-8 w-8 rounded-full bg-[var(--secondary)] flex items-center justify-center hover:bg-[var(--primary)] hover:text-white transition-all text-[var(--muted-foreground)]" aria-label="GitHub">
                <Github size={14} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--border)] pt-6 text-center text-xs text-[var(--muted-foreground)]">
          <p>© 2025 ĐN-UniShare. Chia sẻ hôm nay, giúp đỡ ngày mai. Made with <span className="text-green-500">💚</span> for students.</p>
        </div>
      </div>
    </footer>
  );
}
