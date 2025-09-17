# 🎬 ChatBox AI Assistant - Hướng dẫn sử dụng

## ✅ Đã hoàn thành
Tôi đã thành công thêm ChatBox AI vào trang web phim của bạn! 

## 🚀 Cách sử dụng

### 1. Truy cập trang web
- Mở trình duyệt và vào: `http://localhost:5173`
- Bạn sẽ thấy nút chat 💬 ở góc dưới bên phải

### 2. Sử dụng ChatBox
- **Click vào nút 💬** để mở chat
- **Gõ câu hỏi** về phim ảnh vào ô input
- **Nhấn Enter** hoặc click nút ➤ để gửi
- **Click ✕** để đóng chat

## 💬 Các câu hỏi mẫu

### Thể loại phim
```
"Thể loại phim nào hay?"
"Phim hành động nào đáng xem?"
"Gợi ý phim tình cảm"
"Phim anime nào hay?"
```

### Phim hot
```
"Phim hot hiện tại"
"Top phim Hàn Quốc"
"Anime phổ biến"
"Phim mới ra"
```

### Thông tin khác
```
"Diễn viên nổi tiếng"
"Đạo diễn tài năng"
"Phim theo năm 2023"
"Gợi ý phim kinh dị"
```

## 🔧 Cấu hình AI (Tùy chọn)

### Sử dụng OpenAI API
1. Tạo file `.env` trong thư mục gốc
2. Thêm API key:
```env
REACT_APP_OPENAI_API_KEY=your-openai-api-key-here
```

### Không có API key
- ChatBox vẫn hoạt động với responses mặc định
- Dựa trên từ khóa để trả lời thông minh

## 📱 Tính năng

### ✅ Đã có
- 💬 Giao diện chat đẹp mắt
- 🤖 AI trả lời câu hỏi về phim
- 📱 Responsive trên mobile
- ⚡ Fallback responses thông minh
- 🎨 Animation mượt mà
- ⌨️ Hỗ trợ Enter để gửi

### 🎯 Có thể mở rộng
- Tích hợp API AI khác
- Lưu lịch sử chat
- Gửi hình ảnh
- Voice input
- Chat với người dùng khác

## 🎨 Tùy chỉnh giao diện

### Thay đổi vị trí
Trong `src/components/ChatBox/ChatBox.css`:
```css
.chat-container {
  bottom: 20px;  /* Khoảng cách từ dưới */
  right: 20px;   /* Khoảng cách từ phải */
}
```

### Thay đổi màu sắc
```css
.chat-toggle-btn {
  background: linear-gradient(135deg, #your-color1, #your-color2);
}
```

## 🐛 Troubleshooting

### Chat không mở được
- Kiểm tra console browser (F12)
- Refresh trang web
- Kiểm tra file CSS có load không

### AI không trả lời
- Kiểm tra kết nối internet
- Kiểm tra API key (nếu có)
- Chat sẽ dùng fallback responses

### Giao diện bị lỗi
- Kiểm tra responsive design
- Thử trên browser khác
- Clear cache browser

## 📁 Files đã tạo/sửa đổi

### Mới tạo
- `src/components/ChatBox/ChatBox.jsx` - Component chính
- `src/components/ChatBox/ChatBox.css` - Styling
- `src/components/ChatBox/README.md` - Hướng dẫn chi tiết
- `src/services/aiService.js` - AI service

### Đã sửa đổi
- `src/App.jsx` - Thêm ChatBox component

## 🎉 Kết quả

Bây giờ trang web của bạn đã có:
- ✅ ChatBox AI ở góc dưới phải
- ✅ Có thể hỏi về phim ảnh
- ✅ Giao diện đẹp và responsive
- ✅ Hoạt động ngay cả không có API key
- ✅ Tích hợp hoàn hảo với trang web hiện tại

**Hãy thử ngay bằng cách click vào nút 💬 và hỏi "Phim hot hiện tại" nhé!** 🎬✨
