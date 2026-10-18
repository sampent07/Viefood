# VIEFOOD — WEBSITE THƯƠNG MẠI ĐIỆN TỬ HEALTHY FOOD

Website thương mại điện tử chuyên cung cấp đồ ăn lành mạnh (healthy food), xây dựng theo đặc tả chi tiết tại tài liệu [VieFood_Vibe_Coding_Spec.md](./VieFood_Vibe_Coding_Spec.md).

---

## 🥗 1. Tính Năng Đã Triển Khai Hoàn Chỉnh

### 1.1 Khám phá thực đơn & 5 Danh mục sản phẩm (Đúng 50 món chuẩn đầu vào)
- **Cơm gạo lứt (`/menu/com-gao-lut`)**: 10 món (ức gà, cá hồi teriyaki, bò xào ớt chuông,...)
- **Bún healthy (`/menu/bun-healthy`)**: 10 món (bún gà sả, bún tôm sốt chanh, bún bò lúc lắc,...)
- **Meal Prep chuẩn Macro (`/menu/meal-prep`)**: 10 món (gà khoai lang, cá hồi quinoa, bò nạc khoai nghiền,...)
- **Nước Detox (`/menu/nuoc-detox`)**: 10 loại (chai 500ml, chanh dưa leo bạc hà, táo quế, việt quất chanh,...)
- **Sữa chua Hy Lạp (`/menu/sua-chua-hy-lap`)**: 10 món (sữa chua granola dâu tây, chuối bơ đậu phộng, xoài hạt chia,...)
- **Điều hướng cách ly danh mục:** Bấm vào danh mục nào chỉ hiển thị đúng 10 món của danh mục đó, đồng bộ trạng thái trực tiếp với URL.

### 1.2 Minh bạch khối lượng & Dinh dưỡng
- Mỗi món ăn có **Bảng thành phần công thức chuẩn**: hiển thị rõ tên từng nguyên liệu, định lượng gam/ml và calo tham khảo.
- Phân biệt rõ khối lượng thành phẩm (g/ml), thể tích đồ uống và năng lượng tổng (kcal).

### 1.3 Giỏ hàng & Đặt hàng thông minh
- **Giỏ hàng lưu trữ bền vững:** Tự động lưu `localStorage` cho khách vãng lai và đồng bộ tài khoản.
- **Tính toán phía máy chủ (Backend):** Tính lại toàn bộ giá tiền, chiết khấu voucher và phí giao hàng ở server, không tin dữ liệu client gửi lên.
- **Tùy chỉnh món:** Ghi chú riêng cho từng món (để sốt riêng, không cay,...) và ghi chú chung toàn đơn.
- **Mã ưu đãi (Voucher):** Kiểm tra điều kiện đơn tối thiểu, mức giảm tối đa (% hoặc tiền cố định, freeship).

### 1.4 Thanh toán & VietQR
- Hỗ trợ 2 phương thức:
  - **COD:** Thanh toán tiền mặt khi nhận hàng.
  - **Chuyển khoản ngân hàng VietQR:** Tự động tạo ảnh mã VietQR chứa đúng số tiền, số tài khoản và mã đơn hàng trong nội dung chuyển khoản, kèm nút sao chép nhanh 1-chạm.

### 1.5 Các gói ăn định kỳ & Form tư vấn gói tháng
- **4 Loại gói ăn:** Set dinh dưỡng đầy đủ trong ngày, Gói 3 ngày khởi động, Gói 1 tuần chuẩn Macro, Gói chuyên sâu 1 tháng.
- **Form tư vấn gói tháng (Lead generation):** Thu thập họ tên, SĐT, Zalo, chi nhánh, ngân sách, mục tiêu thể trạng, giờ liên hệ. Tự động sinh mã yêu cầu (VD: `TV2610-xxxx`) và lưu vào CSDL để nhân viên xử lý.

### 1.6 Hệ thống đa chi nhánh
- Hỗ trợ chọn chi nhánh phục vụ (Quận 1 HCM, Ba Đình HN, Hải Châu ĐN).
- Hiển thị địa chỉ, giờ hoạt động, phí ship và số điện thoại hotline tương ứng từng chi nhánh.

### 1.7 Chatbot Dinh dưỡng Tiếng Việt
- Nút chat cố định góc dưới bên phải màn hình.
- Trợ lý thông minh tự động tra cứu dữ liệu sản phẩm, calo, thành phần, voucher, chi nhánh và tra cứu đơn hàng bằng mã đơn `VF2610-xxxx`.

### 1.8 Hệ thống Quản trị Viên (Admin Dashboard tại `/admin`)
- **Dashboard Thống kê:** Số lượng đơn theo trạng thái, doanh thu hợp lệ (loại trừ đơn hủy), giá trị đơn trung bình.
- **Quản lý Đơn hàng:** Tra cứu theo mã/SĐT, cập nhật trạng thái đơn (Mới, Đã xác nhận, Đang nấu, Đang giao, Hoàn tất, Đã hủy).
- **Quản lý Sản phẩm & Công thức:** Cho phép sửa giá bán, calo, khối lượng và chỉnh sửa từng nguyên liệu công thức mà không cần sửa code.
- **Quản lý Yêu cầu Tư vấn:** Cập nhật trạng thái chăm sóc khách hàng và ghi chú nội bộ của nhân viên.
- **Quản lý Voucher & Chi nhánh:** Thêm mới và cấu hình điều kiện voucher, chi nhánh.

---

## 🛠️ 2. Công Nghệ Sử Dụng

- **Frontend & Backend:** Next.js 14 (App Router) + TypeScript
- **Giao diện:** Tailwind CSS, Lucide Icons
- **Cơ sở dữ liệu & ORM:** Prisma ORM với SQLite (sẵn sàng chuyển đổi sang PostgreSQL khi deploy)
- **Bảo mật:** Bcrypt.js mã hóa mật khẩu, HTTP-Only Cookie session

---

## 🚀 3. Hướng Dẫn Cài Đặt & Khởi Động

### Bước 1: Cài đặt dependencies
```bash
npm install
```

### Bước 2: Cấu hình biến môi trường
File `.env` đã được cấu hình mặc định:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="viefood_super_secret_jwt_key_2026_healthy_living"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Bước 3: Đồng bộ cơ sở dữ liệu và nạp dữ liệu mẫu 50 món ăn
```bash
npx prisma db push
npm run db:seed
```

### Bước 4: Khởi chạy môi trường phát triển
```bash
npm run dev
```
Mở trình duyệt truy cập: **`http://localhost:3000`**

Để chạy build production:
```bash
npm run build
npm run start
```

---

## 🔑 4. Tài Khoản Demo Thử Nghiệm

| Vai trò | Email đăng nhập | Mật khẩu | Chức năng |
|---|---|---|---|
| **Quản trị viên (Admin)** | `admin@viefood.vn` | `admin123456` | Toàn quyền trang `/admin` (đơn hàng, công thức, voucher, chi nhánh) |
| **Khách hàng** | `khachhang@viefood.vn` | `customer123456` | Đặt hàng, xem lịch sử đơn, sổ địa chỉ |

---

## 🏷️ 5. Các Mã Voucher Dùng Thử

- `VIEFOODNEW`: Giảm 15% cho đơn từ 100.000đ (tối đa 50.000đ)
- `HEALTHY30K`: Giảm ngay 30.000đ cho đơn từ 200.000đ
- `FREESHIP`: Miễn phí vận chuyển cho đơn từ 250.000đ
- `Q1SPECIAL`: Giảm 20.000đ áp dụng tại chi nhánh Quận 1 (đơn từ 150.000đ)

---

## 📋 6. Danh Mục Cấu Hình Ngoài Khi Triển Khai Thực Tế

1. **Cổng thanh toán & Webhook ngân hàng:** Tích hợp Webhook đối soát tài khoản ngân hàng thực tế (Cass / PayOS / VietQR Open API) để tự động chuyển trạng thái đơn sang "Đã thanh toán".
2. **Zalo ZNS / SMS OTP:** Cấu hình Zalo Business ZNS API khi gửi thông báo đơn hàng cho khách.
3. **AI Chatbot API:** Có thể thêm biến môi trường `GEMINI_API_KEY` nếu muốn trợ lý AI trò chuyện chuyên sâu hơn ngoài kho tri thức hiện tại.
