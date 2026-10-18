# VIEFOOD — ĐẶC TẢ WEBSITE HEALTHY FOOD DÀNH CHO VIBE CODING

> **Mục đích:** Dùng file này làm prompt/specification chính để AI coding agent xây dựng website VieFood. Hãy đọc toàn bộ yêu cầu trước khi sửa code. Nếu đã có dự án, ưu tiên phát triển tiếp dự án hiện tại, giữ lại phần đang hoạt động tốt và tránh viết lại không cần thiết.
>
> **Ngôn ngữ giao diện:** Tiếng Việt. **Thị trường:** Việt Nam. **Đơn vị tiền tệ:** VNĐ. **Phong cách:** healthy, sạch sẽ, hiện đại, thân thiện và đáng tin cậy.
>
> **Nguyên tắc dữ liệu:** Mọi giá bán, khuyến mãi, chi nhánh, công thức, khối lượng và dinh dưỡng đều phải có thể sửa từ hệ thống quản trị. Số liệu món ăn trong tài liệu này là dữ liệu đầu vào/ước tính ban đầu, không mặc nhiên là số liệu dinh dưỡng đã kiểm nghiệm. Không tự bịa dữ liệu thực tế hoặc hiển thị dữ liệu demo như dữ liệu đã được xác minh.

---

## 1. Vai trò và mục tiêu

Bạn là Senior Full-stack Developer, UI/UX Designer và kiến trúc sư phần mềm thương mại điện tử. Hãy xây dựng một website bán đồ ăn healthy có thể vận hành, không chỉ là bản thiết kế tĩnh.

Website cần hỗ trợ khách hàng:

- Khám phá thực đơn theo từng danh mục sản phẩm.
- Tìm kiếm và lọc món ăn.
- Xem ảnh, giá, thành phần, khối lượng từng thành phần, khối lượng hộp và lượng calo.
- Thêm món vào giỏ hàng, cập nhật số lượng, ghi chú, nhập voucher và đặt hàng.
- Đặt set ăn hoặc đăng ký gói ăn đầy đủ, 3 ngày, tuần và tháng.
- Để lại số điện thoại/Zalo để được tư vấn gói tháng.
- Thanh toán COD hoặc chuyển khoản bằng QR; trạng thái thanh toán chỉ được xác nhận dựa trên nguồn tin cậy.
- Đăng ký, đăng nhập, quản lý thông tin và theo dõi đơn hàng.
- Chat với chatbot hỗ trợ.
- Chọn chi nhánh và xem đúng sản phẩm, giá, khu vực giao hàng, phí giao hàng và ưu đãi của chi nhánh.

Website cần có hệ thống quản trị để nhân viên quản lý sản phẩm, công thức, dinh dưỡng, giá, tồn kho, đơn hàng, voucher, gói ăn, khách hàng tiềm năng và chi nhánh.

## 2. Phong cách giao diện và trải nghiệm người dùng

- Màu chủ đạo: xanh lá, trắng và cam nhạt; có thể dùng màu trung tính làm nền.
- Phong cách sạch sẽ, tươi mới, tạo cảm giác món ăn ngon, an toàn và đáng tin.
- Dùng hình ảnh món ăn rõ nét; mỗi món có ảnh riêng hoặc placeholder có tên món rõ ràng để thay ảnh sau.
- Không dùng cùng một ảnh cho toàn bộ sản phẩm.
- Font dễ đọc, phân cấp heading rõ ràng, khoảng cách thoáng, nút thao tác dễ nhìn.
- Responsive đầy đủ trên desktop, tablet và điện thoại.
- Có trạng thái loading, empty state, thông báo thành công, lỗi và xác nhận thao tác.
- Không tạo nút chỉ để trang trí. Mọi nút hiển thị phải hoạt động hoặc được đánh dấu rõ là chức năng chưa tích hợp.
- Định dạng tiền VNĐ nhất quán; thời gian theo múi giờ Việt Nam.
- Nội dung giao diện chính bằng tiếng Việt.

## 3. Kiến trúc trang và điều hướng

### 3.1 Header

Bao gồm:

- Logo VieFood.
- Trang chủ.
- Thực đơn.
- Các gói ăn.
- Ưu đãi.
- Chi nhánh.
- Liên hệ.
- Thanh tìm kiếm.
- Đăng nhập/Đăng ký hoặc menu tài khoản.
- Biểu tượng giỏ hàng có số lượng sản phẩm hiện tại.

Trên mobile, gom điều hướng vào menu gọn; biểu tượng tìm kiếm và giỏ hàng vẫn dễ truy cập.

### 3.2 Trang chủ

Các khu vực:

1. Banner chính có hình ảnh món ăn, giới thiệu VieFood và thông điệp về thực phẩm lành mạnh, tiện lợi.
2. Nút “Khám phá thực đơn” và “Xem các gói ăn”.
3. Danh mục sản phẩm nổi bật.
4. Món bán chạy và món mới (chỉ gắn nhãn khi được cấu hình).
5. Các gói ăn: set đầy đủ, 3 ngày, tuần, tháng.
6. Ưu đãi đang áp dụng.
7. Ưu đãi theo từng chi nhánh.
8. Giới thiệu thương hiệu, quy trình hoặc cam kết chỉ khi có thông tin đã xác nhận.
9. Đánh giá khách hàng nếu có dữ liệu thật; không tạo đánh giá giả.
10. Footer gồm liên hệ, chính sách giao hàng, đổi/trả/hủy, bảo mật, điều khoản và mạng xã hội.

### 3.3 Trang thực đơn và danh mục

Tạo 5 danh mục chính từ dữ liệu ban đầu:

1. **Cơm gạo lứt** — 10 món.
2. **Bún healthy** — 10 món.
3. **Meal Prep** — 10 món.
4. **Nước Detox** — 10 món.
5. **Sữa chua Hy Lạp** — 10 món.

Khi khách bấm vào một danh mục, chỉ hiển thị danh sách món thuộc danh mục đó. Không hiển thị lẫn món của danh mục khác.

URL đề xuất:

- `/menu/com-gao-lut`
- `/menu/bun-healthy`
- `/menu/meal-prep`
- `/menu/nuoc-detox`
- `/menu/sua-chua-hy-lap`

URL có thể truy cập trực tiếp và chia sẻ được. Khi điều hướng danh mục, trạng thái giao diện phải đồng bộ với URL.

Bộ lọc:

- Danh mục.
- Khoảng giá.
- Mức calo.
- Khối lượng.
- Món bán chạy/món mới (nếu được đánh dấu).
- Chi nhánh phục vụ.
- Tình trạng còn hàng.

Sắp xếp:

- Mức độ phổ biến.
- Giá tăng dần/giảm dần.
- Calo tăng dần/giảm dần.

### 3.4 Thẻ sản phẩm

Mỗi thẻ sản phẩm hiển thị:

- Ảnh món.
- Tên món.
- Giá bán VNĐ hoặc “Đang cập nhật giá” nếu chưa có giá thật.
- Khối lượng tịnh/thành phẩm dự kiến.
- Tổng năng lượng tham khảo (kcal).
- Mô tả ngắn.
- Tên danh mục.
- Nhãn “Bán chạy”, “Món mới” hoặc “Healthy” chỉ khi có căn cứ/cấu hình.
- Nút “Xem chi tiết”.
- Nút “Thêm vào giỏ hàng”.

### 3.5 Trang chi tiết món ăn

Mỗi món có một trang riêng hoặc modal chi tiết đủ lớn, gồm:

- Ảnh, tên, mã sản phẩm, mô tả và giá.
- Danh mục.
- Khối lượng thành phẩm hoặc khối lượng dự kiến (g).
- Tổng kcal tham khảo.
- Bảng từng thành phần: tên, khối lượng, kcal nếu có dữ liệu.
- Các chỉ số protein, carbohydrate, chất béo, chất xơ nếu dữ liệu đã có.
- Thông tin dị ứng chỉ khi đã được xác minh.
- Số lượng còn hàng và chi nhánh phục vụ.
- Số lượng mua.
- Ghi chú tùy chỉnh món (nếu công thức cho phép).
- Nút “Thêm vào giỏ hàng”.
- Món liên quan trong cùng danh mục.

Bảng thành phần cần có cấu trúc tương tự:

| Thành phần | Khối lượng | Calo tham khảo |
|---|---:|---:|
| Cơm gạo lứt | 150 g | Theo dữ liệu công thức |
| Ức gà | 120 g | Theo dữ liệu công thức |
| Bông cải xanh | 80 g | Theo dữ liệu công thức |
| Cà rốt | 40 g | Theo dữ liệu công thức |
| Dầu ô liu | 5 g | Theo dữ liệu công thức |
| Tổng | Theo công thức | Tổng kcal |

### 3.6 Phân biệt khối lượng và dinh dưỡng

Không gộp những đại lượng khác nhau thành một trường duy nhất. Cần phân biệt tối thiểu:

- `ingredient_weight_g`: khối lượng của từng thành phần.
- `recipe_total_weight_g`: tổng khối lượng nguyên liệu theo công thức.
- `finished_weight_g`: khối lượng thành phẩm đã xác nhận.
- `estimated_finished_weight_min_g` và `estimated_finished_weight_max_g`: khoảng khối lượng thành phẩm dự kiến nếu có.
- `serving_volume_ml`: thể tích đồ uống nếu áp dụng.
- `calories_kcal`: năng lượng tổng cho khẩu phần được bán.
- `nutrition_verified`: cho biết dữ liệu dinh dưỡng đã được xác minh hay chưa.
- `data_source` hoặc `nutrition_note`: ghi chú nguồn dữ liệu/phương pháp ước tính.

Tổng khối lượng nguyên liệu có thể khác khối lượng thành phẩm vì hao hụt khi nấu, thay đổi nước, phần không ăn được, gia vị hoặc cách cân trước/sau chế biến. Không tự ý thay khối lượng thành phẩm dự kiến bằng phép cộng nguyên liệu nếu hai số liệu đang nói về hai trạng thái khác nhau.

Tổng kcal phải bằng tổng kcal của từng thành phần trong đúng khẩu phần và theo dữ liệu đầu vào. Nếu chưa có kcal từng thành phần, có thể hiển thị kcal ước tính toàn món với nhãn “tham khảo”; không giả lập kcal chính xác cho từng thành phần. Không tuyên bố số liệu dinh dưỡng là đã kiểm nghiệm nếu chưa có xác nhận.

## 4. Thanh tìm kiếm

Tìm kiếm trên toàn bộ thực đơn theo:

- Tên món.
- Tên nguyên liệu.
- Danh mục.
- Mã sản phẩm nếu người dùng nhập.

Yêu cầu:

- Gợi ý kết quả trong khi gõ nếu phù hợp.
- Nhấn kết quả để mở trang chi tiết.
- Có nút xóa từ khóa.
- Hiển thị thông báo khi không tìm thấy kết quả.
- Có thể giới hạn tìm kiếm trong danh mục hiện tại hoặc tìm trên toàn website.
- Không gửi/hiển thị dữ liệu không cần thiết.

## 5. Giỏ hàng và ghi chú món

### 5.1 Thêm món

Nút “Thêm vào giỏ hàng” phải hoạt động trên thẻ và trang chi tiết. Khi bấm:

- Thêm đúng sản phẩm theo `product_id`.
- Nếu cùng sản phẩm và cùng tùy chọn đã có trong giỏ, tăng số lượng thay vì tạo dòng trùng không cần thiết.
- Hiển thị thông báo thành công.
- Cập nhật số lượng trên biểu tượng giỏ hàng.
- Cho phép tiếp tục mua sắm hoặc đi tới giỏ hàng.

### 5.2 Nội dung giỏ hàng

Hiển thị:

- Ảnh, tên, danh mục và đơn giá.
- Các tùy chọn/ghi chú riêng của món.
- Số lượng và nút tăng/giảm.
- Nút xóa.
- Thành tiền từng dòng.
- Tổng số hộp/sản phẩm.
- Tổng khối lượng dự kiến nếu có dữ liệu tương thích.
- Tạm tính.
- Phí giao hàng.
- Voucher và số tiền giảm.
- Tổng thanh toán.

Công thức:

`Tổng thanh toán = Tạm tính + Phí giao hàng - Giảm giá`.

Tổng tiền phải được tính lại tại backend trước khi xác nhận đơn, không tin số tiền do frontend gửi lên.

### 5.3 Ghi chú

Có ghi chú cho toàn đơn và ghi chú riêng từng món. Ví dụ:

- Để sốt riêng.
- Không thêm sốt.
- Không thêm một nguyên liệu có thể tùy chỉnh.
- Yêu cầu khác.

Chỉ cho phép bỏ/thay nguyên liệu khi công thức và quy trình bếp cho phép. Nếu thay nguyên liệu làm thay đổi giá, khối lượng hoặc calo, phải tính lại theo dữ liệu cấu hình; nếu chưa hỗ trợ thì ghi rõ đây là yêu cầu cần nhân viên xác nhận.

### 5.4 Lưu giỏ

- Giỏ hàng vẫn tồn tại khi chuyển trang hoặc tải lại.
- Khách chưa đăng nhập có thể lưu ở phiên/local storage theo cách phù hợp.
- Khách đăng nhập có thể đồng bộ với giỏ lưu ở server.
- Kiểm tra tồn kho và tình trạng phục vụ của chi nhánh trước lúc đặt.

## 6. Voucher và ưu đãi

Hỗ trợ các loại:

- Giảm theo phần trăm.
- Giảm tiền cố định.
- Miễn/giảm phí giao hàng.
- Đơn hàng đạt giá trị tối thiểu.
- Voucher dành cho sản phẩm hoặc danh mục.
- Voucher dành cho gói ăn.
- Voucher khách hàng mới.
- Voucher theo khung giờ/thời hạn.
- Voucher riêng theo chi nhánh.

Mỗi voucher có các trường:

- Mã và tên chương trình.
- Loại giảm và giá trị giảm.
- Đơn hàng tối thiểu.
- Mức giảm tối đa nếu có.
- Ngày/giờ bắt đầu và kết thúc.
- Số lượt sử dụng tổng thể và/hoặc từng khách hàng.
- Chi nhánh áp dụng.
- Sản phẩm/danh mục/gói áp dụng.
- Quy tắc cộng dồn.
- Trạng thái hoạt động.

Backend phải kiểm tra lại điều kiện voucher. Hiển thị lý do khi voucher hết hạn, không hợp lệ, hết lượt hoặc không đạt giá trị tối thiểu. Không tự cho phép cộng dồn khi cấu hình không cho phép.

## 7. Gói ăn và meal plan

Tạo trang “Các gói ăn” gồm bốn loại:

### 7.1 Set đầy đủ

- Một set hoàn chỉnh, có danh sách các món bên trong.
- Hiển thị khẩu phần từng món, tổng giá, tổng khối lượng và tổng calo của set.
- Có tùy chọn đổi món nếu được cấu hình.
- Có nút thêm set vào giỏ hàng.

### 7.2 Gói 3 ngày

- Hiển thị thực đơn từng ngày, có thể chia bữa sáng/trưa/tối theo mô hình kinh doanh.
- Hiển thị tổng số món/hộp, tổng giá, giá trung bình mỗi ngày và lịch giao.
- Nêu rõ số bữa và những gì được bao gồm.
- Có nút đăng ký.

### 7.3 Gói tuần

- Hiển thị thực đơn theo từng ngày trong tuần.
- Cho phép xem chi tiết các bữa.
- Hiển thị tổng số hộp, giá, lịch giao và mức tiết kiệm so với mua lẻ nếu được tính toán từ giá thực.
- Có nút đăng ký.

### 7.4 Gói tháng

- Hiển thị số ngày phục vụ, số bữa/hộp và thực đơn mẫu.
- Cho phép hiển thị theo tuần hoặc từng ngày.
- Hiển thị giá gói đã cấu hình, giá trung bình mỗi ngày và điều kiện giao hàng.
- Có nút “Đăng ký tư vấn gói tháng”.
- Nếu giá/thực đơn tùy chỉnh, yêu cầu khách gửi thông tin trước khi xác nhận mua.

### 7.5 Quy tắc tính gói

- Các món trong gói phải liên kết tới sản phẩm thật bằng ID.
- Lưu số lượng từng món.
- Cộng tổng giá theo quy tắc giá gói được cấu hình; không tự bịa giá hay mức tiết kiệm.
- Phân biệt kcal của một món, một bữa, một ngày và toàn bộ gói.
- Không hiển thị tổng calo của cả gói tháng như lượng calo một ngày.
- Áp dụng voucher cho gói nếu đáp ứng điều kiện.
- Cho phép chọn ngày bắt đầu, chi nhánh, địa chỉ và ghi chú theo quy trình được hỗ trợ.

## 8. Form tư vấn gói tháng qua số điện thoại/Zalo

Các trường:

- Họ tên.
- Số điện thoại.
- Số Zalo nếu khác số điện thoại.
- Gói quan tâm.
- Chi nhánh mong muốn.
- Khu vực/địa chỉ giao hàng ở mức cần thiết.
- Ngân sách dự kiến (tùy chọn).
- Mục tiêu ăn uống hoặc nhu cầu dinh dưỡng (tùy chọn, không yêu cầu dữ liệu nhạy cảm không cần thiết).
- Thời gian phù hợp để liên hệ.
- Ghi chú.
- Đồng ý cho VieFood liên hệ và xử lý dữ liệu theo thông báo quyền riêng tư.

Xử lý sau khi gửi:

- Kiểm tra trường bắt buộc và định dạng số điện thoại.
- Tạo mã yêu cầu.
- Lưu vào database.
- Hiển thị xác nhận gửi thành công.
- Đưa yêu cầu vào trang quản trị.
- Cho phép nhân viên cập nhật trạng thái: `Mới`, `Đang liên hệ`, `Đã tư vấn`, `Đã chuyển đổi`, `Đã hủy`.
- Có trường nhân viên phụ trách và ghi chú nội bộ nếu cần.
- Chỉ gửi tin nhắn Zalo tự động khi đã tích hợp API/nền tảng được cấp quyền; không giả lập gửi thành công nếu chưa kết nối.
- Có chống gửi trùng cơ bản và bảo vệ form khỏi spam.

## 9. Đăng ký, đăng nhập và tài khoản

Hỗ trợ:

- Đăng ký bằng email hoặc số điện thoại theo phương thức hệ thống hỗ trợ.
- Đăng nhập, đăng xuất.
- Quên/đặt lại mật khẩu.
- Xác minh tài khoản nếu cần.
- Hồ sơ cá nhân.
- Sổ địa chỉ giao hàng.
- Lịch sử đơn hàng và trạng thái đơn.
- Lịch sử voucher.
- Các gói đang đăng ký và lịch phục vụ.
- Yêu cầu hỗ trợ.
- Khách được phép đặt hàng không cần tài khoản nếu luồng nghiệp vụ hỗ trợ.

Không lưu mật khẩu dạng văn bản thuần. Dùng giải pháp xác thực an toàn, phiên đăng nhập bảo mật, phân quyền rõ ràng và giới hạn truy cập dữ liệu. Không hiển thị thông tin khách hàng này cho khách hàng khác.

## 10. Thanh toán và QR

### 10.1 Luồng thanh toán

1. Xem lại giỏ hàng.
2. Nhập người nhận và điện thoại.
3. Chọn chi nhánh.
4. Nhập/chọn địa chỉ giao hàng.
5. Chọn ngày/khung giờ giao nếu có.
6. Ghi chú đơn.
7. Áp dụng voucher.
8. Chọn phương thức thanh toán.
9. Xem tổng tiền cuối cùng.
10. Xác nhận đơn và nhận mã đơn.

### 10.2 Phương thức

- COD (thanh toán khi nhận hàng).
- Chuyển khoản ngân hàng bằng QR.
- Cổng thanh toán khác nếu được tích hợp.

### 10.3 Hiển thị QR

Khi chọn chuyển khoản, hiển thị:

- QR gắn với thông tin đơn hàng nếu hệ thống ngân hàng/nhà cung cấp hỗ trợ.
- Tên người nhận, ngân hàng, số tài khoản và nội dung chuyển khoản theo cấu hình.
- Số tiền chính xác.
- Mã đơn hàng trong nội dung chuyển khoản để đối soát.
- Nút sao chép thông tin.
- Thời hạn thanh toán nếu có.
- Trạng thái: Chờ thanh toán, Đã thanh toán, Thất bại, Hết hạn hoặc Hoàn tiền nếu phù hợp.

### 10.4 Bảo mật thanh toán

- Không coi việc khách nhấn “Tôi đã thanh toán” là bằng chứng thanh toán.
- Không xác nhận dựa riêng vào ảnh chụp biên lai do khách tải lên.
- Chỉ cập nhật đã thanh toán bằng webhook xác thực hoặc cơ chế đối soát đáng tin cậy từ nhà cung cấp/ngân hàng.
- Xử lý webhook có xác thực và chống xử lý trùng.
- Không lưu mật khẩu ngân hàng, OTP hoặc thông tin đăng nhập tài chính của khách.
- Nếu chưa có thông tin tài khoản hoặc nhà cung cấp thanh toán, dùng chế độ demo có nhãn rõ ràng. Không tự bịa ngân hàng, số tài khoản hoặc xác nhận giao dịch thực tế.

## 11. Chatbot

Tạo nút chatbot cố định ở góc dưới bên phải. Chatbot dùng tiếng Việt tự nhiên và trả lời theo dữ liệu website.

Năng lực:

- Tìm món theo tên/danh mục/nguyên liệu.
- Gợi ý theo ngân sách hoặc loại món.
- Giải thích thành phần, khối lượng và kcal từ dữ liệu đã có.
- Giới thiệu và so sánh gói ăn.
- Hướng dẫn dùng voucher.
- Giải đáp giao hàng/thanh toán/chính sách.
- Tra cứu đơn hàng sau khi xác minh khách hàng.
- Giới thiệu chi nhánh.
- Thu thập nhu cầu và điều hướng khách sang form tư vấn.
- Chuyển tiếp cho nhân viên khi cần.

Quy tắc:

- Không bịa giá, calo, tồn kho, ưu đãi, giờ hoạt động hoặc trạng thái thanh toán.
- Nếu chưa có câu trả lời, nói rõ chưa có thông tin và đề xuất liên hệ nhân viên.
- Không tư vấn y tế hoặc hứa hẹn hiệu quả giảm cân/chữa bệnh.
- Nếu dùng AI API, gọi từ backend; không để lộ API key ở frontend.
- Chỉ lưu lịch sử chat khi cần thiết, thông báo rõ và giới hạn quyền truy cập.

## 12. Chi nhánh và ưu đãi riêng

Mỗi chi nhánh có:

- ID, tên, địa chỉ, số điện thoại.
- Giờ hoạt động.
- Khu vực giao hàng.
- Phí giao hàng/quy tắc phí.
- Danh sách món đang cung cấp.
- Giá riêng nếu có.
- Tồn kho hoặc tình trạng sẵn có.
- Voucher/chương trình khuyến mãi riêng.
- Trạng thái đang hoạt động/tạm đóng.

Luồng:

1. Khách chọn chi nhánh hoặc chọn theo địa chỉ giao hàng.
2. Website tải đúng sản phẩm, giá, ưu đãi và khả năng giao hàng.
3. Backend xác nhận sản phẩm/giá/voucher thuộc đúng chi nhánh.
4. Nếu giỏ có món không phục vụ tại chi nhánh, cảnh báo rõ và cho khách đổi chi nhánh hoặc điều chỉnh giỏ.
5. Không âm thầm đổi chi nhánh sau khi đơn đã xác nhận.

## 13. Quản trị viên (Admin)

Tạo trang `/admin` bảo vệ bằng xác thực và phân quyền. Chỉ admin/nhân viên được cấp quyền mới truy cập được.

### 13.1 Dashboard

Hiển thị:

- Số đơn theo trạng thái.
- Doanh thu từ đơn hợp lệ/hoàn tất theo quy tắc đã định nghĩa.
- Giá trị đơn hàng trung bình.
- Món bán chạy.
- Voucher được dùng.
- Yêu cầu tư vấn gói tháng.
- Hiệu quả theo chi nhánh.

Phân biệt doanh thu đơn hàng, tiền đã thu, tiền hoàn và đơn bị hủy. Không tính đơn hủy như đơn hoàn tất.

### 13.2 Quản lý sản phẩm/công thức

- Thêm, sửa, ẩn, xóa sản phẩm theo quyền.
- Quản lý slug, mã sản phẩm, danh mục, mô tả, ảnh, giá và tình trạng.
- Quản lý thành phần riêng biệt: tên, khối lượng, đơn vị, trạng thái cân sống/chín nếu cần, kcal và nguồn dữ liệu khi có.
- Quản lý khối lượng tổng và calo.
- Hỗ trợ dữ liệu dinh dưỡng chưa xác minh và đánh dấu rõ.
- Quản lý giá/tồn kho/sản phẩm theo chi nhánh.
- Cập nhật danh sách món liên quan.
- Cho phép thay ảnh và cập nhật dữ liệu mà không sửa code.

### 13.3 Quản lý đơn hàng

- Tìm theo mã đơn, tên, điện thoại, chi nhánh hoặc trạng thái.
- Xem các dòng hàng, giá tại thời điểm đặt, voucher, phí giao và ghi chú.
- Cập nhật trạng thái: Mới, Đã xác nhận, Đang chuẩn bị, Đang giao, Hoàn tất, Đã hủy.
- Xem riêng trạng thái thanh toán.
- Ghi nhận lý do hủy/hoàn nếu có.
- Giữ snapshot sản phẩm, đơn giá, thành phần hiển thị và các trường liên quan tại thời điểm mua; chỉnh sửa công thức hiện tại không làm thay đổi đơn cũ.

### 13.4 Quản lý gói và đăng ký

- Tạo gói đầy đủ/3 ngày/tuần/tháng.
- Chọn món và số lượng theo ngày/bữa.
- Cấu hình giá, thời hạn, ngày phục vụ, lịch giao, chính sách đổi món.
- Xem danh sách đăng ký.
- Quản lý yêu cầu tư vấn và trạng thái chăm sóc.

### 13.5 Quản lý voucher

- Tạo/sửa/ẩn voucher.
- Cấu hình thời hạn, lượt dùng, điều kiện, giá trị tối thiểu/tối đa.
- Chọn phạm vi sản phẩm/danh mục/gói/chi nhánh.
- Theo dõi lịch sử sử dụng và người dùng theo phạm vi cần thiết.

### 13.6 Quản lý chi nhánh

- Tạo/sửa/ngừng hoạt động.
- Quản lý thông tin liên hệ, giờ mở cửa và khu vực giao hàng.
- Quản lý sản phẩm, giá và tồn kho riêng.
- Thiết lập ưu đãi riêng.

### 13.7 Quản lý khách hàng và phân quyền

- Xem thông tin cần thiết cho phục vụ đơn hàng/tư vấn.
- Xem lịch sử đơn.
- Phân quyền nhân viên.
- Hạn chế quyền theo nhiệm vụ.
- Ghi lại các thao tác quản trị quan trọng nếu phù hợp.

## 14. Cơ sở dữ liệu đề xuất

Thiết kế schema có quan hệ, khóa chính, khóa ngoại, ràng buộc và chỉ mục phù hợp. Các bảng cốt lõi:

- `users`: tài khoản.
- `roles` / `user_roles`: vai trò và phân quyền nếu cần.
- `addresses`: địa chỉ giao hàng.
- `categories`: danh mục.
- `products`: thông tin sản phẩm.
- `ingredients`: nguyên liệu chuẩn hóa nếu cần dùng chung.
- `product_ingredients`: thành phần của sản phẩm, khối lượng, đơn vị và dinh dưỡng.
- `branches`: chi nhánh.
- `branch_products`: sản phẩm, giá, tồn kho, khả năng cung cấp tại chi nhánh.
- `packages`: thông tin gói ăn.
- `package_items`: món trong gói, ngày/bữa và số lượng.
- `package_subscriptions`: đăng ký gói của khách.
- `carts` / `cart_items`: giỏ hàng nếu lưu tại server.
- `orders`: thông tin đơn.
- `order_items`: dòng hàng và snapshot dữ liệu tại thời điểm mua.
- `vouchers`: cấu hình voucher.
- `voucher_redemptions`: lịch sử áp dụng.
- `payments`: giao dịch và trạng thái.
- `consultation_requests`: form tư vấn.
- `reviews`: đánh giá thật nếu có.
- `chat_sessions` / `chat_messages`: lịch sử chat nếu được bật.
- `delivery_slots`: khung giờ giao nếu cần.

Có thể điều chỉnh schema theo stack hiện tại; không bắt buộc tạo mọi bảng nếu chức năng chưa cần. Không sử dụng tên sản phẩm làm khóa chính. Dùng ID ổn định. Lưu snapshot đơn hàng để giá và nội dung đơn cũ không bị thay đổi khi admin sửa sản phẩm.

## 15. Công nghệ đề xuất

Nếu dự án chưa có stack, chọn:

- Frontend: Next.js hoặc React + TypeScript.
- UI: Tailwind CSS và thư viện component nhất quán.
- Backend: route handlers/API trong Next.js hoặc backend Node.js có cấu trúc rõ.
- Database: PostgreSQL.
- ORM: Prisma hoặc giải pháp tương đương.
- Auth: giải pháp xác thực an toàn.
- Ảnh: storage/media service; không dùng đường dẫn ảnh giả trong production.
- Thanh toán: nhà cung cấp hỗ trợ QR và webhook/đối soát phù hợp.
- Chatbot AI: gọi API từ backend.
- Deployment: cấu hình phù hợp với framework và database được chọn.

Nếu dự án hiện có công nghệ khác đang hoạt động tốt, ưu tiên giữ nguyên và triển khai trên stack hiện tại. Không thay stack chỉ để phù hợp với đề xuất này.

## 16. Bảo mật, độ tin cậy và chất lượng

- Xác thực và phân quyền cho mọi API nhạy cảm.
- Kiểm tra dữ liệu ở cả frontend và backend.
- Không để lộ secret, API key hoặc thông tin thanh toán.
- Tính lại giá, phí ship, voucher, tồn kho và tổng đơn ở server.
- Có cơ chế tránh tạo đơn trùng khi người dùng bấm nhiều lần.
- Xác thực webhook và chống xử lý giao dịch lặp.
- Chỉ trả dữ liệu khách hàng mà người dùng hiện tại có quyền xem.
- Không lưu mật khẩu dạng thuần.
- Có chính sách quyền riêng tư và thông báo xử lý dữ liệu cá nhân.
- Không yêu cầu dữ liệu nhạy cảm không cần thiết.
- Có xử lý lỗi API, loading, empty state và error state.
- Responsive, tối ưu tốc độ tải, SEO cơ bản, metadata và sitemap.
- Có kiểm thử cho các luồng nghiệp vụ trọng yếu.
- Cấu hình secret bằng biến môi trường và cung cấp `.env.example` không chứa secret thật.

## 17. Quy ước dữ liệu ban đầu cho sản phẩm

Tạo seed data cho 50 sản phẩm ở Mục 18. Mỗi sản phẩm ít nhất có:

- `id`: ID ổn định.
- `sku`: mã sản phẩm duy nhất.
- `slug`: slug duy nhất.
- `name`: tên hiển thị.
- `category_slug`: thuộc một trong 5 danh mục.
- `description`: mô tả ngắn, có thể chỉnh sửa.
- `price_vnd`: để `null` nếu chưa được chủ shop cung cấp giá; có thể có giá demo nhưng phải đánh dấu demo ở môi trường thử nghiệm.
- `ingredients`: mảng đối tượng gồm `name`, `amount`, `unit`, `calories_kcal` nếu đã biết, `weight_state` hoặc ghi chú cân sống/chín nếu phù hợp.
- `estimated_weight_g` hoặc `estimated_weight_min_g`/`estimated_weight_max_g`.
- `calories_kcal` hoặc `calories_min_kcal`/`calories_max_kcal` nếu danh sách cung cấp khoảng.
- `nutrition_verified`: mặc định `false` cho dữ liệu chưa được kiểm chứng.
- `image_url`: ảnh riêng hoặc placeholder có thể thay thế.
- `is_available`.
- `branch_ids` hoặc quan hệ tới `branch_products`.
- `sort_order`.

Các số calo và khối lượng ở Mục 18 giữ nguyên như dữ liệu tham khảo đầu vào. Không tự sửa số liệu nhưng phải đánh dấu là ước tính; admin có thể hiệu chỉnh sau. Nếu tổng khối lượng thành phần không bằng khối lượng hộp dự kiến, lưu cả hai trường và không tự ghi đè một giá trị bằng giá trị còn lại.

---

## 18. DANH SÁCH 50 SẢN PHẨM BAN ĐẦU

### A. Cơm gạo lứt (10 món)

#### 1. Cơm gạo lứt ức gà áp chảo

- Khối lượng hộp dự kiến: khoảng 395–410 g.
- Năng lượng tham khảo ban đầu: khoảng 430 kcal.
- Thành phần:
  - Cơm gạo lứt: 150 g.
  - Ức gà: 120 g.
  - Bông cải xanh: 80 g.
  - Cà rốt: 40 g.
  - Dầu ô liu, gia vị: 5 g dầu.

#### 2. Cơm gạo lứt cá hồi sốt teriyaki

- Khối lượng hộp dự kiến: khoảng 375 g.
- Năng lượng tham khảo ban đầu: khoảng 480 kcal.
- Thành phần:
  - Cơm gạo lứt: 150 g.
  - Cá hồi: 100 g.
  - Bông cải xanh: 80 g.
  - Cà rốt: 30 g.
  - Sốt teriyaki: 15 g.

#### 3. Cơm gạo lứt thịt heo nạc sả

- Khối lượng hộp dự kiến: khoảng 400 g.
- Năng lượng tham khảo ban đầu: khoảng 450 kcal.
- Thành phần:
  - Cơm gạo lứt: 150 g.
  - Thịt heo nạc: 110 g.
  - Dưa leo: 50 g.
  - Cà rốt: 40 g.
  - Dầu ăn, sả và nước mắm: khoảng 5 g dầu.

#### 4. Cơm gạo lứt tôm xào rau củ

- Khối lượng hộp dự kiến: khoảng 405 g.
- Năng lượng tham khảo ban đầu: khoảng 390 kcal.
- Thành phần:
  - Cơm gạo lứt: 150 g.
  - Tôm bóc vỏ: 120 g.
  - Đậu Hà Lan: 40 g.
  - Cà rốt: 40 g.
  - Bông cải xanh: 50 g.
  - Dầu ăn: 5 g.

#### 5. Cơm gạo lứt gà nướng mật ong

- Khối lượng hộp dự kiến: khoảng 395 g.
- Năng lượng tham khảo ban đầu: khoảng 450 kcal.
- Thành phần:
  - Cơm gạo lứt: 150 g.
  - Thịt gà bỏ da: 120 g.
  - Đậu que: 70 g.
  - Cà rốt: 40 g.
  - Mật ong: 8 g.
  - Dầu ăn: 3 g.

#### 6. Cơm gạo lứt đậu hũ nấm sốt tiêu

- Khối lượng hộp dự kiến: khoảng 425 g.
- Năng lượng tham khảo ban đầu: khoảng 370 kcal.
- Thành phần:
  - Cơm gạo lứt: 150 g.
  - Đậu hũ: 120 g.
  - Nấm: 80 g.
  - Cải thìa: 70 g.
  - Dầu ăn và sốt tiêu: khoảng 5 g dầu.

#### 7. Cơm gạo lứt bò xào ớt chuông

- Khối lượng hộp dự kiến: khoảng 385 g.
- Năng lượng tham khảo ban đầu: khoảng 460 kcal.
- Thành phần:
  - Cơm gạo lứt: 150 g.
  - Thịt bò nạc: 110 g.
  - Ớt chuông: 80 g.
  - Hành tây: 40 g.
  - Dầu ăn: 5 g.

#### 8. Cơm gạo lứt gà nghệ bí đỏ

- Khối lượng hộp dự kiến: khoảng 395 g.
- Năng lượng tham khảo ban đầu: khoảng 420 kcal.
- Thành phần:
  - Cơm gạo lứt: 150 g.
  - Ức gà: 110 g.
  - Bí đỏ: 80 g.
  - Cải bó xôi: 50 g.
  - Dầu ô liu: 5 g.

#### 9. Cơm gạo lứt trứng và đậu nành Nhật

- Khối lượng hộp dự kiến: khoảng 400 g.
- Năng lượng tham khảo ban đầu: khoảng 430 kcal.
- Thành phần:
  - Cơm gạo lứt: 150 g.
  - Trứng gà: 2 quả nhỏ.
  - Đậu nành Nhật (edamame): 60 g.
  - Bắp: 30 g.
  - Dưa leo: 50 g.
- Ghi chú dữ liệu: cần xác định khối lượng phần ăn được của trứng; không giả định mọi quả trứng cùng khối lượng.

#### 10. Cơm gạo lứt cá ngừ bắp

- Khối lượng hộp dự kiến: khoảng 400 g.
- Năng lượng tham khảo ban đầu: khoảng 390 kcal.
- Thành phần:
  - Cơm gạo lứt: 150 g.
  - Cá ngừ ngâm nước để ráo: 100 g.
  - Bắp: 40 g.
  - Dưa leo: 50 g.
  - Xà lách: 40 g.
  - Sốt sữa chua: 20 g.

### B. Bún healthy (10 món)

#### 1. Bún gà sả

- Khối lượng dự kiến: 415 g.
- Năng lượng tham khảo ban đầu: khoảng 400 kcal.
- Thành phần:
  - Bún: 150 g.
  - Ức gà: 120 g.
  - Xà lách: 40 g.
  - Dưa leo: 50 g.
  - Cà rốt: 30 g.
  - Sốt chua ngọt: 25 g.

#### 2. Bún bò rau củ

- Khối lượng dự kiến: 355 g.
- Năng lượng tham khảo ban đầu: khoảng 410 kcal.
- Thành phần:
  - Bún: 150 g.
  - Bò nạc: 100 g.
  - Cải thìa: 60 g.
  - Cà rốt: 40 g.
  - Dầu ăn: 5 g.

#### 3. Bún tôm sốt chanh

- Khối lượng dự kiến: 420 g.
- Năng lượng tham khảo ban đầu: khoảng 350 kcal.
- Thành phần:
  - Bún: 150 g.
  - Tôm: 120 g.
  - Bắp cải tím: 50 g.
  - Dưa leo: 50 g.
  - Cà rốt: 30 g.
  - Sốt chanh: 20 g.

#### 4. Bún cá hồi áp chảo

- Khối lượng dự kiến: 375 g.
- Năng lượng tham khảo ban đầu: khoảng 460 kcal.
- Thành phần:
  - Bún: 150 g.
  - Cá hồi: 100 g.
  - Bông cải: 70 g.
  - Dưa leo: 40 g.
  - Sốt mè: 15 g.

#### 5. Bún thịt heo nạc nướng

- Khối lượng dự kiến: 390 g.
- Năng lượng tham khảo ban đầu: khoảng 450 kcal.
- Thành phần:
  - Bún: 150 g.
  - Thịt heo nạc: 110 g.
  - Rau sống: 80 g.
  - Cà rốt: 30 g.
  - Nước mắm chua ngọt: 20 g.

#### 6. Bún đậu hũ nấm

- Khối lượng dự kiến: 430 g.
- Năng lượng tham khảo ban đầu: khoảng 380 kcal.
- Thành phần:
  - Bún: 150 g.
  - Đậu hũ: 120 g.
  - Nấm: 80 g.
  - Cải xanh: 60 g.
  - Sốt tương: 20 g.

#### 7. Bún bò lúc lắc

- Khối lượng dự kiến: 365 g.
- Năng lượng tham khảo ban đầu: khoảng 420 kcal.
- Thành phần:
  - Bún: 150 g.
  - Bò nạc: 100 g.
  - Ớt chuông: 70 g.
  - Hành tây: 40 g.
  - Dầu ăn: 5 g.

#### 8. Bún gà sốt mè rang

- Khối lượng dự kiến: 395 g.
- Năng lượng tham khảo ban đầu: khoảng 430 kcal.
- Thành phần:
  - Bún: 150 g.
  - Ức gà: 110 g.
  - Bắp cải: 50 g.
  - Cà rốt: 30 g.
  - Edamame: 40 g.
  - Sốt mè: 15 g.

#### 9. Bún trứng và rau củ

- Khối lượng dự kiến: 360 g.
- Năng lượng tham khảo ban đầu: khoảng 370 kcal.
- Thành phần:
  - Bún: 150 g.
  - Trứng nhỏ: 2 quả.
  - Nấm: 60 g.
  - Cải bó xôi: 50 g.
  - Cà rốt: 30 g.
  - Dầu ăn: 3 g.
- Ghi chú dữ liệu: cần xác định khối lượng phần ăn được của trứng.

#### 10. Bún cá ngừ kiểu salad

- Khối lượng dự kiến: 410 g.
- Năng lượng tham khảo ban đầu: khoảng 370 kcal.
- Thành phần:
  - Bún: 150 g.
  - Cá ngừ để ráo: 100 g.
  - Bắp: 40 g.
  - Xà lách: 50 g.
  - Dưa leo: 50 g.
  - Sốt sữa chua: 20 g.

### C. Meal Prep (10 món)

#### 1. Set gà – khoai lang – rau xanh

- Khối lượng dự kiến: 415 g.
- Năng lượng tham khảo ban đầu: khoảng 440 kcal.
- Thành phần:
  - Ức gà: 130 g.
  - Khoai lang hấp: 180 g.
  - Bông cải: 100 g.
  - Dầu ô liu: 5 g.

#### 2. Set cá hồi – quinoa – măng tây

- Khối lượng dự kiến: 380 g.
- Năng lượng tham khảo ban đầu: khoảng 440 kcal.
- Thành phần:
  - Cá hồi: 100 g.
  - Quinoa chín: 130 g.
  - Măng tây: 100 g.
  - Cà chua bi: 50 g.

#### 3. Set bò nạc – khoai nghiền – đậu que

- Khối lượng dự kiến: 395 g.
- Năng lượng tham khảo ban đầu: khoảng 450 kcal.
- Thành phần:
  - Bò nạc: 110 g.
  - Khoai tây nghiền: 180 g.
  - Đậu que: 100 g.
  - Dầu ô liu: 5 g.

#### 4. Set tôm – quinoa – edamame

- Khối lượng dự kiến: 380 g.
- Năng lượng tham khảo ban đầu: khoảng 420 kcal.
- Thành phần:
  - Tôm: 130 g.
  - Quinoa chín: 140 g.
  - Edamame: 60 g.
  - Dưa leo: 50 g.

#### 5. Set chay đậu hũ – đậu gà

- Khối lượng dự kiến: 415 g.
- Năng lượng tham khảo ban đầu: khoảng 430 kcal.
- Thành phần:
  - Đậu hũ: 150 g.
  - Đậu gà chín: 80 g.
  - Bí đỏ: 100 g.
  - Bông cải: 80 g.
  - Dầu ô liu: 5 g.

#### 6. Set mì nguyên cám gà sốt cà chua

- Khối lượng dự kiến: 430 g.
- Năng lượng tham khảo ban đầu: khoảng 450 kcal.
- Thành phần:
  - Mì nguyên cám chín: 160 g.
  - Ức gà: 110 g.
  - Sốt cà chua: 70 g.
  - Cà chua bi: 50 g.
  - Rau chân vịt: 40 g.

#### 7. Set gà nướng – cơm gạo lứt – măng tây

- Khối lượng dự kiến: 395 g.
- Năng lượng tham khảo ban đầu: khoảng 430 kcal.
- Thành phần:
  - Cơm gạo lứt: 150 g.
  - Ức gà: 120 g.
  - Măng tây: 80 g.
  - Cà rốt: 40 g.
  - Dầu ăn: 5 g.

#### 8. Set đậu hũ teriyaki – cơm lứt

- Khối lượng dự kiến: 418 g.
- Năng lượng tham khảo ban đầu: khoảng 440 kcal.
- Thành phần:
  - Cơm gạo lứt: 150 g.
  - Đậu hũ: 150 g.
  - Bông cải: 100 g.
  - Sốt teriyaki: 15 g.
  - Mè: 3 g.

#### 9. Set salad cá ngừ – khoai tây – trứng

- Khối lượng dự kiến: 360 g.
- Năng lượng tham khảo ban đầu: khoảng 390 kcal.
- Thành phần:
  - Cá ngừ để ráo: 100 g.
  - Khoai tây luộc: 150 g.
  - Trứng gà: 1 quả.
  - Xà lách: 60 g.
  - Sốt sữa chua: 20 g.
- Ghi chú dữ liệu: cần xác định khối lượng phần ăn được của trứng.

#### 10. Set gà fajita – cơm lứt – đậu đen

- Khối lượng dự kiến: 395 g.
- Năng lượng tham khảo ban đầu: khoảng 440 kcal.
- Thành phần:
  - Cơm gạo lứt: 130 g.
  - Ức gà: 120 g.
  - Đậu đen chín: 60 g.
  - Ớt chuông: 80 g.
  - Dầu ô liu: 5 g.

### D. Nước Detox (10 món)

**Quy cách:** 500 ml/chai. Trường calo tính trên một chai theo ước tính ban đầu. Đây là đồ uống; không cộng lượng nguyên liệu rồi coi đó là khối lượng hoặc thể tích thành phẩm.

#### 1. Chanh – dưa leo – bạc hà

- Thành phần cho chai 500 ml: chanh 20 g, dưa leo 50 g, bạc hà 3 g.
- Năng lượng tham khảo ban đầu: 8–12 kcal/chai.

#### 2. Cam – chanh – bạc hà

- Thành phần cho chai 500 ml: cam 50 g, chanh 10 g, bạc hà 3 g.
- Năng lượng tham khảo ban đầu: 25–30 kcal/chai.

#### 3. Dâu tây – chanh

- Thành phần cho chai 500 ml: dâu tây 70 g, chanh 10 g.
- Năng lượng tham khảo ban đầu: 20–25 kcal/chai.

#### 4. Táo xanh – quế

- Thành phần cho chai 500 ml: táo xanh 70 g, một thanh quế nhỏ.
- Năng lượng tham khảo ban đầu: 35–40 kcal/chai.

#### 5. Dứa – bạc hà

- Thành phần cho chai 500 ml: dứa 60 g, bạc hà 3 g.
- Năng lượng tham khảo ban đầu: 30–35 kcal/chai.

#### 6. Dưa hấu – chanh

- Thành phần cho chai 500 ml: dưa hấu 80 g, chanh 10 g.
- Năng lượng tham khảo ban đầu: 25–30 kcal/chai.

#### 7. Cam – cà rốt

- Thành phần cho chai 500 ml: cam 50 g, cà rốt 30 g.
- Năng lượng tham khảo ban đầu: 25–35 kcal/chai.

#### 8. Kiwi – dưa leo

- Thành phần cho chai 500 ml: kiwi 40 g, dưa leo 50 g.
- Năng lượng tham khảo ban đầu: 25–30 kcal/chai.

#### 9. Việt quất – chanh

- Thành phần cho chai 500 ml: việt quất 40 g, chanh 10 g.
- Năng lượng tham khảo ban đầu: 25–30 kcal/chai.

#### 10. Gừng – chanh – dứa

- Thành phần cho chai 500 ml: dứa 40 g, chanh 10 g, gừng 3 g.
- Năng lượng tham khảo ban đầu: 20–25 kcal/chai.

Lưu ý quản trị: xác định cách chế biến là nước ngâm, nước ép hay xay trước khi công bố calo chính thức; phần nguyên liệu không nhất thiết được tiêu thụ toàn bộ trong nước ngâm.

### E. Sữa chua Hy Lạp (10 món)

#### 1. Dâu tây – granola – mật ong

- Khối lượng dự kiến: 235 g.
- Năng lượng tham khảo ban đầu: khoảng 240 kcal.
- Thành phần: sữa chua Hy Lạp 150 g, dâu tây 60 g, granola 20 g, mật ong 5 g.

#### 2. Xoài chín – hạt chia

- Khối lượng dự kiến: 231 g.
- Năng lượng tham khảo ban đầu: khoảng 220 kcal.
- Thành phần: sữa chua Hy Lạp 150 g, xoài 70 g, hạt chia 8 g, mật ong 3 g.

#### 3. Việt quất – yến mạch

- Khối lượng dự kiến: 225 g.
- Năng lượng tham khảo ban đầu: khoảng 240 kcal.
- Thành phần: sữa chua Hy Lạp 150 g, việt quất 50 g, yến mạch 20 g, hạt bí 5 g.

#### 4. Chuối – bơ đậu phộng

- Khối lượng dự kiến: 230 g.
- Năng lượng tham khảo ban đầu: khoảng 255 kcal.
- Thành phần: sữa chua Hy Lạp 150 g, chuối 60 g, bơ đậu phộng 10 g, yến mạch 10 g.

#### 5. Thanh long – hạt chia

- Khối lượng dự kiến: 243 g.
- Năng lượng tham khảo ban đầu: khoảng 215 kcal.
- Thành phần: sữa chua Hy Lạp 150 g, thanh long 80 g, hạt chia 8 g, dừa sấy không đường 5 g.

#### 6. Dứa – dừa sấy

- Khối lượng dự kiến: 233 g.
- Năng lượng tham khảo ban đầu: khoảng 225 kcal.
- Thành phần: sữa chua Hy Lạp 150 g, dứa 70 g, dừa sấy 5 g, hạt điều 8 g.

#### 7. Chocolate – chuối

- Khối lượng dự kiến: 216 g.
- Năng lượng tham khảo ban đầu: khoảng 245 kcal.
- Thành phần: sữa chua Hy Lạp 150 g, chuối 50 g, bột cacao không đường 5 g, chocolate đen 8 g, mật ong 3 g.

#### 8. Chanh dây – granola

- Khối lượng dự kiến: 200 g.
- Năng lượng tham khảo ban đầu: khoảng 235 kcal.
- Thành phần: sữa chua Hy Lạp 150 g, ruột chanh dây 25 g, granola 20 g, mật ong 5 g.

#### 9. Táo – quế – óc chó

- Khối lượng dự kiến: 229 g.
- Năng lượng tham khảo ban đầu: khoảng 245 kcal.
- Thành phần: sữa chua Hy Lạp 150 g, táo 60 g, óc chó 8 g, yến mạch 10 g, bột quế 1 g.

#### 10. Berry mix – hạnh nhân

- Khối lượng dự kiến: 223 g.
- Năng lượng tham khảo ban đầu: khoảng 225 kcal.
- Thành phần: sữa chua Hy Lạp 150 g, dâu tây 30 g, việt quất 30 g, hạnh nhân 8 g, hạt chia 5 g.

---

## 19. Các luồng nghiệp vụ bắt buộc

### Luồng A — Mua món lẻ

Trang chủ → Thực đơn → Chọn danh mục → Chọn món → Xem chi tiết thành phần/dinh dưỡng → Thêm vào giỏ → Nhập voucher → Chọn chi nhánh → Nhập thông tin giao hàng → Chọn thanh toán → Xác nhận đơn → Theo dõi đơn.

### Luồng B — Mua gói ăn

Trang chủ → Các gói ăn → Chọn gói → Xem thực đơn/dinh dưỡng → Chọn lịch và chi nhánh → Đăng ký hoặc thanh toán → Nhận xác nhận.

### Luồng C — Tư vấn gói tháng

Trang gói ăn → Gói tháng → Form tư vấn → Nhập tên, điện thoại/Zalo, chi nhánh và nhu cầu → Gửi yêu cầu → Lưu database → Admin tiếp nhận → Nhân viên cập nhật trạng thái.

### Luồng D — QR thanh toán

Giỏ hàng → Thanh toán → Tạo đơn/mã đơn → Hiển thị QR gắn với số tiền/nội dung → Chờ thanh toán → Nhận xác nhận từ nhà cung cấp hoặc đối soát → Cập nhật trạng thái.

### Luồng E — Ưu đãi chi nhánh

Chọn chi nhánh → Tải đúng sản phẩm/giá/ưu đãi → Thêm món → Kiểm tra phạm vi voucher ở backend → Tính lại tổng tiền → Xác nhận đơn.

### Luồng F — Chatbot

Khách mở chatbot → Chatbot truy vấn dữ liệu sản phẩm/gói/chi nhánh → Trả lời dựa trên dữ liệu đã có → Nếu không giải quyết được, hướng dẫn mở form tư vấn hoặc liên hệ nhân viên.

## 20. Kiểm thử và tiêu chí nghiệm thu

Trước khi kết luận hoàn tất, kiểm thử tối thiểu:

1. Trang chủ và các điều hướng hoạt động.
2. Bấm Cơm hiển thị đúng 10 món cơm.
3. Bấm Bún hiển thị đúng 10 món bún.
4. Bấm Meal Prep hiển thị đúng 10 set.
5. Bấm Nước Detox hiển thị đúng 10 loại nước.
6. Bấm Sữa chua Hy Lạp hiển thị đúng 10 món.
7. Tìm kiếm theo tên, thành phần và danh mục hoạt động.
8. Trang chi tiết hiển thị đúng công thức của từng món.
9. Khối lượng, dung tích và calo dùng đúng trường và đơn vị.
10. Các số liệu ước tính được gắn nhãn phù hợp.
11. Thêm/xóa/tăng/giảm số lượng trong giỏ hoạt động.
12. Giỏ hàng giữ được trạng thái khi tải lại trang.
13. Tổng tiền tính chính xác ở backend.
14. Voucher đúng điều kiện và không thể lợi dụng để giảm sai.
15. Sản phẩm hết hàng hoặc không có tại chi nhánh không thể đặt sai quy tắc.
16. Gói ăn tính đúng số món, giá và tổng calo theo phạm vi.
17. Form tư vấn lưu được dữ liệu và tạo mã yêu cầu.
18. Đăng ký/đăng nhập và phân quyền hoạt động.
19. QR demo/QR thực tế có nhãn và trạng thái chính xác; không tự xác nhận giao dịch.
20. Chatbot không tự bịa dữ liệu và có hướng dẫn chuyển sang nhân viên.
21. Ưu đãi được áp dụng đúng chi nhánh.
22. Admin có thể quản lý sản phẩm, nguyên liệu, giá, đơn hàng, voucher, gói ăn, yêu cầu tư vấn và chi nhánh.
23. Đơn cũ không bị thay đổi khi cập nhật giá hoặc công thức hiện tại.
24. Responsive trên desktop, tablet và mobile.
25. Kiểm tra lỗi trình duyệt, API, trạng thái loading/empty/error và quyền truy cập.

## 21. Kế hoạch triển khai cho AI coding agent

Thực hiện trực tiếp trên repo hiện có nếu đã có repo. Trước tiên kiểm tra cấu trúc dự án, package, framework và các thành phần đang hoạt động. Không xóa chức năng hiện hữu khi chưa hiểu tác động.

### Giai đoạn 1 — Kiểm tra và thiết kế

- Kiểm tra codebase hiện tại.
- Xác định stack và kiến trúc.
- Lập kế hoạch thay đổi ngắn gọn.
- Xây dựng mô hình dữ liệu cho 5 danh mục và 50 sản phẩm.
- Thiết kế hệ thống điều hướng, trang danh mục và trang chi tiết.

### Giai đoạn 2 — MVP giao diện và sản phẩm

- Trang chủ.
- Header, tìm kiếm và điều hướng.
- Năm danh mục có đúng 10 sản phẩm/danh mục.
- Trang chi tiết món và bảng thành phần/dinh dưỡng.
- Responsive.
- Dữ liệu seed có cấu trúc.

### Giai đoạn 3 — Giỏ hàng và đặt đơn

- Giỏ hàng.
- Ghi chú món/đơn.
- Voucher.
- Chọn chi nhánh.
- Checkout và quản lý trạng thái đơn.

### Giai đoạn 4 — Gói ăn và lead generation

- Set đầy đủ, 3 ngày, tuần, tháng.
- Form tư vấn gói tháng qua điện thoại/Zalo.
- Quản lý trạng thái yêu cầu trong Admin.

### Giai đoạn 5 — Tài khoản, admin và tích hợp

- Đăng ký/đăng nhập.
- Admin sản phẩm, công thức, đơn hàng, voucher và chi nhánh.
- QR thanh toán thực tế khi có nhà cung cấp/cấu hình hợp lệ.
- Chatbot AI backend nếu có API key và cấu hình cần thiết.

### Giai đoạn 6 — Kiểm thử và bàn giao

- Kiểm thử các luồng ở Mục 20.
- Sửa lỗi phát hiện được.
- Bổ sung `.env.example`, migration/seed và hướng dẫn setup.
- Tài liệu cách chạy ở local, cách cấu hình dịch vụ ngoài và cách deploy.
- Báo rõ chức năng nào hoạt động thực tế, chức năng nào đang demo/chờ cấu hình.

## 22. Yêu cầu đầu ra khi AI hoàn thành

Không chỉ trả lời bằng kế hoạch hay các đoạn code rời rạc. Hãy thực hiện các thay đổi trong dự án và cung cấp:

- Cấu trúc file đã tạo/chỉnh sửa.
- Cách cài đặt dependencies.
- Cách cấu hình `.env` dựa trên `.env.example`.
- Cách tạo database, chạy migrations và seed 50 sản phẩm.
- Cách khởi động website.
- Tài khoản demo chỉ dùng trong môi trường local, nếu cần; không hard-code tài khoản mặc định trong production.
- Cách kiểm thử các chức năng chính.
- Danh sách cấu hình ngoài còn thiếu (ngân hàng/nhà cung cấp thanh toán, Zalo API, API chatbot, thông tin chi nhánh, giá bán thật).
- Nêu cụ thể các giới hạn còn lại. Không tuyên bố chức năng thực tế nếu chỉ là giao diện giả lập.

**Ưu tiên chất lượng:** MVP phải chạy được, các danh mục điều hướng đúng, dữ liệu 50 món đầy đủ và giỏ hàng hoạt động. Sau đó mới bổ sung các tích hợp bên ngoài. Giá, thông tin ngân hàng, ưu đãi, chi nhánh và công thức dinh dưỡng thật phải do chủ hệ thống xác nhận hoặc cập nhật qua Admin.
