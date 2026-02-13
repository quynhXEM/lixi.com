import Link from "next/link";

export default function CauHoiThuongGapPage() {
  const faqs: { question: string; answer: string }[] = [
    {
      question: "Lương tháng cao không con?",
      answer: "Dạ lương tháng 5 củ, đủ đóng tiền mạng với tiền cà phê ạ 🥲.",
    },
    {
      question: "Bao giờ lấy vợ?",
      answer: "Dạ con đang đợi trúng số Vietlott rồi lấy luôn cho hoành tráng ạ 😌.",
    },
    {
      question: "Có người yêu chưa?",
      answer: "Dạ hiện tại con yêu nước, yêu Đảng, yêu gia đình trước đã ạ 🫡.",
    },
    {
      question: "Làm công việc gì, có ổn định không?",
      answer: "Dạ con làm IT, mỗi ngày sửa bug với sống chung deadline thôi ạ 👨‍💻.",
    },
    {
      question: "Tháng gửi về cho ba mẹ được bao nhiêu?",
      answer:
        "Dạ con gửi về bằng cả tấm lòng và một ít tiền đủ để ba mẹ nhớ đến con ạ 🥹.",
    },
    {
      question: "Ở công ty có lên chức chưa?",
      answer: "Dạ con mới được thăng chức từ sinh viên thử việc lên nhân viên thử việc ạ 😎.",
    },
    {
      question: "Sao dạo này nhìn ốm vậy?",
      answer: "Dạ con giảm cân theo trend, với lại ví mỏng nên người cũng mỏng theo ạ 😭.",
    },
    {
      question: "Có định về quê làm không hay ở thành phố luôn?",
      answer:
        "Dạ hiện tại con ở đâu thì ngân hàng cũng nhắn tin đều nên chắc vẫn ở thành phố thêm thời gian nữa ạ.",
    },
    {
      question: "Tết này có thưởng không?",
      answer:
        "Dạ có ạ, thưởng là cho phép nghỉ vài ngày không bị gọi họp online bất ngờ ạ 😅.",
    },
    {
      question: "Bao giờ mua nhà, mua xe?",
      answer:
        "Dạ con đang tích góp, hiện đã đủ tiền mua… mô hình nhà với xe để ngắm mỗi tối rồi ạ 🏠🚗.",
    },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-primary text-white px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Nút Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors group"
        >
          <span className="text-xl group-hover:-translate-x-1 transition-transform">
            ←
          </span>
          <span className="text-sm font-medium">Về trang chủ</span>
        </Link>

        <div className="flex flex-col items-center mb-6">
          <div className="mb-4 bg-yellow-400/20 p-2 rounded-full border border-yellow-400/40 backdrop-blur-md shadow-lg">
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-3 rounded-full shadow-inner">
              <span className="text-white text-3xl" aria-hidden>
                🤔
              </span>
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-center mb-2">
            Bạn có thắc mắc gì về tui nào
          </h1>
          <p className="text-white/80 text-sm text-center">
            Đừng hỏi tui ngại - Hỏi lại tui đánh á
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((item, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1 text-yellow-300 text-lg">❓</div>
                <div>
                  <p className="font-semibold text-sm sm:text-base">
                    {item.question}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-start gap-3">
                <div className="mt-1 text-green-300 text-lg">💬</div>
                <p className="text-sm sm:text-base text-white/90">
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center text-xs text-white/60">
          <p>
            Gợi ý: đọc xong nhớ cân nhắc hoàn cảnh gia đình trước khi áp dụng
            kẻo ăn “quở” nha 😅
          </p>
        </div>
      </div>
    </div>
  );
}

