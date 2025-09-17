# ChatBox Component

## Mô tả
ChatBox là một component chat AI nhỏ gọn được tích hợp vào trang web phim, cho phép người dùng hỏi đáp về phim ảnh, thể loại phim, gợi ý phim và nhiều thông tin khác.

## Tính năng
- 💬 Giao diện chat thân thiện và responsive
- 🤖 Tích hợp AI để trả lời câu hỏi về phim
- 📱 Hỗ trợ mobile và desktop
- ⚡ Fallback responses khi API không khả dụng
- 🎨 Thiết kế đẹp mắt với animation

## Cách sử dụng

### 1. Cấu hình API Key (Tùy chọn)
Tạo file `.env` trong thư mục gốc và thêm API key:

```env
REACT_APP_OPENAI_API_KEY=your-openai-api-key-here
```

### 2. Sử dụng trong App
```jsx
import ChatBox from './components/ChatBox/ChatBox';

function App() {
  return (
    <div className="App">
      {/* Other components */}
      <ChatBox />
    </div>
  );
}
```

## API Services

### OpenAI (Mặc định)
- Endpoint: `https://api.openai.com/v1/chat/completions`
- Model: `gpt-3.5-turbo`
- Cần API key từ OpenAI

### Fallback API
- Có thể cấu hình API khác trong `aiService.js`
- Hoặc sử dụng responses mặc định dựa trên từ khóa

## Các câu hỏi phổ biến

### Thể loại phim
- "Thể loại phim nào hay?"
- "Phim hành động nào đáng xem?"
- "Gợi ý phim tình cảm"

### Phim hot
- "Phim hot hiện tại"
- "Top phim Hàn Quốc"
- "Anime phổ biến"

### Thông tin khác
- "Diễn viên nổi tiếng"
- "Đạo diễn tài năng"
- "Phim theo năm"

## Customization

### Thay đổi giao diện
Chỉnh sửa file `ChatBox.css` để thay đổi:
- Màu sắc
- Kích thước
- Vị trí
- Animation

### Thay đổi AI Service
Chỉnh sửa file `aiService.js` để:
- Thay đổi API endpoint
- Thêm API service mới
- Tùy chỉnh system prompt
- Thêm responses mặc định

### Thay đổi vị trí
Trong `ChatBox.css`, thay đổi:
```css
.chat-container {
  position: fixed;
  bottom: 20px;  /* Khoảng cách từ bottom */
  right: 20px;   /* Khoảng cách từ right */
}
```

## Troubleshooting

### Chat không hoạt động
1. Kiểm tra console để xem lỗi
2. Kiểm tra API key có đúng không
3. Kiểm tra kết nối internet

### API không trả về kết quả
1. Kiểm tra API key có hợp lệ
2. Kiểm tra quota API
3. Chat sẽ tự động chuyển sang fallback responses

### Giao diện bị lỗi
1. Kiểm tra file CSS có được import đúng
2. Kiểm tra responsive design
3. Kiểm tra z-index conflicts

## Dependencies
- React (useState, useRef, useEffect)
- CSS3 (animations, flexbox, grid)
- Fetch API (cho API calls)

## Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

