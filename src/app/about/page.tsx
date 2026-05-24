'use client';

import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import MountainRange from '@/components/decorative/mountain-range';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      <Header />
      <MountainRange className="absolute bottom-0 left-0 w-full h-[100px] opacity-60" />
      <div className="flex-grow pt-32 pb-20">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-12 rounded-[40px] shadow-xl"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-8">
              Về <span className="gradient-text">ĐN-UniShare</span>
            </h1>
            <div className="space-y-6 text-lg text-muted-foreground text-left">
              <p>
                ĐN-UniShare khởi nguồn từ một ý tưởng đơn giản: <strong className="text-foreground">Làm thế nào để những món đồ sinh viên không dùng nữa có thể đến tay những người thực sự cần?</strong>
              </p>
              <p>
                Mỗi năm, hàng tấn sách vở, giáo trình, và đồ dùng ký túc xá bị vứt bỏ khi sinh viên tốt nghiệp hoặc chuyển trọ. Trong khi đó, hàng ngàn tân sinh viên lại phải chật vật chi trả cho những vật dụng tương tự.
              </p>
              <p>
                Nhận thấy sự lãng phí này, chúng tôi xây dựng ĐN-UniShare - nền tảng kết nối sẻ chia đầu tiên dành riêng cho cộng đồng sinh viên tại Làng Đại học Đà Nẵng (bao gồm ĐH Bách Khoa, ĐH Sư Phạm, ĐH Kinh Tế, ĐH Ngoại Ngữ, và các trường thành viên).
              </p>
              
              <div className="pt-8 mt-8 border-t border-border">
                <h3 className="text-2xl font-bold text-foreground mb-4">Sứ mệnh của chúng tôi</h3>
                <ul className="list-disc pl-6 space-y-3">
                  <li><strong>Giảm thiểu rác thải:</strong> Kéo dài vòng đời của các vật dụng sinh viên.</li>
                  <li><strong>Hỗ trợ tài chính:</strong> Giúp sinh viên tiết kiệm chi phí học tập và sinh hoạt.</li>
                  <li><strong>Xây dựng cộng đồng:</strong> Tạo ra một môi trường đoàn kết, tử tế và sẵn sàng giúp đỡ lẫn nhau tại Đà Nẵng.</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-12 flex justify-center">
              <div className="h-24 w-24 rounded-full gradient-bg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">ĐN</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      <Footer />
    </main>
  );
}
