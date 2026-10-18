import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { reply: "Xin chào! Mình là trợ lý ảo VieFood. Bạn đang tìm món ăn lành mạnh hay cần tư vấn gói dinh dưỡng nào ạ?" },
        { status: 200 }
      );
    }

    const lower = message.toLowerCase().trim();

    // 1. Order lookup by orderCode (e.g. VF2610-1234)
    const orderMatch = lower.match(/vf\d{4}-\d{4}/i);
    if (orderMatch) {
      const code = orderMatch[0].toUpperCase();
      const order = await prisma.order.findUnique({
        where: { orderCode: code },
        include: { items: true, branch: true },
      });

      if (order) {
        const statusMap: Record<string, string> = {
          NEW: "Mới tạo (Chờ xác nhận)",
          CONFIRMED: "Đã xác nhận",
          PREPARING: "Bếp đang chuẩn bị",
          DELIVERING: "Đang giao hàng",
          COMPLETED: "Hoàn tất thành công",
          CANCELLED: "Đã hủy",
        };
        const itemsList = order.items.map((i) => `• ${i.productName} (x${i.quantity})`).join("\n");
        return NextResponse.json({
          reply: `Đơn hàng **${order.orderCode}** của bạn:\n- Trạng thái: **${statusMap[order.status] || order.status}**\n- Chi nhánh: ${order.branch?.name}\n- Địa chỉ: ${order.deliveryAddress}\n- Các món:\n${itemsList}\n- Tổng tiền: **${new Intl.NumberFormat('vi-VN').format(order.totalAmount)}đ** (${order.paymentMethod === 'BANK_TRANSFER' ? 'Chuyển khoản QR' : 'COD'}).`,
        });
      } else {
        return NextResponse.json({
          reply: `Hệ thống không tìm thấy đơn hàng mã **${code}**. Bạn vui lòng kiểm tra lại mã trên tin nhắn/xác nhận đặt hàng nhé!`,
        });
      }
    }

    // 2. Meal packages / Tư vấn gói tháng
    if (
      lower.includes("gói") ||
      lower.includes("package") ||
      lower.includes("tháng") ||
      lower.includes("tuần") ||
      lower.includes("3 ngày") ||
      lower.includes("set đầy đủ")
    ) {
      return NextResponse.json({
        reply: `VieFood hiện có 4 hình thức gói ăn chuẩn dinh dưỡng:\n\n1. **Set ăn dinh dưỡng đầy đủ**: 185.000đ (đủ 3 bữa + 1 chai detox trong ngày, ~1.140 kcal).\n2. **Gói 3 Ngày Khởi Động**: 499.000đ (thực đơn 3 ngày liên tiếp, 6 hộp).\n3. **Gói Chuẩn Macro 1 Tuần**: 980.000đ (T2 - T7, 12 bữa trưa và tối luân phiên 12 món).\n4. **Gói Chuyên Sâu 1 Tháng**: 3.600.000đ (24 ngày, có chuyên viên đồng hành đo đạc chỉ số và tinh chỉnh khẩu phần).\n\nBạn có muốn đăng ký nhận tư vấn miễn phí cho gói tháng không? Bạn có thể mở mục **Các gói ăn** và bấm **"Đăng ký tư vấn gói tháng"** ngay trên website nhé!`,
      });
    }

    // 3. Branches / Chi nhánh / Địa chỉ cửa hàng
    if (lower.includes("chi nhánh") || lower.includes("địa chỉ") || lower.includes("ở đâu") || lower.includes("quận")) {
      const branches = await prisma.branch.findMany({ where: { isActive: true } });
      const branchText = branches
        .map((b) => `📍 **${b.name}**\n- Địa chỉ: ${b.address}\n- Hotline: ${b.phone}\n- Giờ mở cửa: ${b.openHours}`)
        .join("\n\n");

      return NextResponse.json({
        reply: `Hiện tại VieFood đang phục vụ tại các chi nhánh sau:\n\n${branchText}\n\nBạn có thể chọn chi nhánh gần nhất ở góc phải trên cùng website để xem đúng menu và nhận giao hàng nhanh nhất!`,
      });
    }

    // 4. Voucher / Khuyến mãi / Mã giảm giá
    if (lower.includes("voucher") || lower.includes("mã giảm") || lower.includes("ưu đãi") || lower.includes("khuyến mãi")) {
      const vouchers = await prisma.voucher.findMany({ where: { isActive: true }, take: 4 });
      const vText = vouchers
        .map((v) => `🏷️ Mã: **${v.code}** — ${v.title} (Đơn từ ${new Intl.NumberFormat('vi-VN').format(v.minOrderValue)}đ)`)
        .join("\n");

      return NextResponse.json({
        reply: `Các mã ưu đãi VieFood đang áp dụng hôm nay:\n\n${vText}\n\nBạn chỉ cần nhập mã tại bước Giỏ hàng hoặc Thanh toán để được giảm giá ngay!`,
      });
    }

    // 5. Calories, Protein, Dinh dưỡng
    if (lower.includes("calo") || lower.includes("kcal") || lower.includes("protein") || lower.includes("dinh dưỡng")) {
      return NextResponse.json({
        reply: `Tại VieFood, toàn bộ 50 món ăn trong thực đơn đều được tính toán và công bố lượng calo tham khảo cũng như khối lượng từng thành phần nguyên liệu (thịt nạc, rau xanh, tinh bột tốt).\n- Các món Cơm gạo lứt & Meal Prep dao động từ: **370 – 480 kcal**\n- Các món Bún healthy: **350 – 460 kcal**\n- Sữa chua Hy Lạp: **215 – 255 kcal**\n- Nước Detox: **10 – 38 kcal/chai 500ml**\n\nBạn có thể bấm vào từng món ăn để xem bảng thành phần chi tiết từng gram nhé!`,
      });
    }

    // 6. Food/Dish search query (e.g. "ức gà", "cá hồi", "tôm", "sữa chua", "bò", "chay", "detox")
    const searchTerms = [
      "ức gà", "cá hồi", "thịt bò", "bò", "tôm", "thịt heo", "đậu hũ", "chay",
      "sữa chua", "detox", "cơm", "bún", "quinoa", "khoai lang", "dâu tây", "nước ép"
    ];

    const matchedTerm = searchTerms.find((t) => lower.includes(t));
    if (matchedTerm) {
      const dishes = await prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: matchedTerm } },
            { description: { contains: matchedTerm } },
            { ingredients: { some: { name: { contains: matchedTerm } } } },
          ],
        },
        take: 4,
      });

      if (dishes.length > 0) {
        const dishList = dishes
          .map((d) => `• **${d.name}** — ${new Intl.NumberFormat('vi-VN').format(d.priceVnd || 0)}đ (${d.caloriesKcal || 0} kcal, ~${d.estimatedWeightG || 0}g)`)
          .join("\n");

        return NextResponse.json({
          reply: `Gợi ý các món ngon có nguyên liệu liên quan đến "${matchedTerm}" dành cho bạn:\n\n${dishList}\n\nBạn muốn xem chi tiết món nào cứ gõ tên món hoặc tìm kiếm trên thanh tìm kiếm của website nhé!`,
        });
      }
    }

    // 7. Shipping / Delivery policy / Thanh toán
    if (lower.includes("giao hàng") || lower.includes("ship") || lower.includes("phí") || lower.includes("thanh toán")) {
      return NextResponse.json({
        reply: `Chính sách giao hàng & thanh toán của VieFood:\n- **Giao hàng**: Trong bán kính 15km từ chi nhánh gần nhất, phí giao từ 18.000đ - 22.000đ tùy chi nhánh (Miễn phí ship đơn từ 250k với mã **FREESHIP**).\n- **Phương thức thanh toán**: Hỗ trợ nhận hàng thanh toán tiền mặt (COD) hoặc Chuyển khoản ngân hàng quét mã VietQR tự động.\n- **Thời gian giao hàng**: Giao trong khung giờ từ 07:00 đến 21:00 hàng ngày.`,
      });
    }

    // Default polite response
    return NextResponse.json({
      reply: `Dạ, VieFood có thể hỗ trợ bạn:\n- Tìm kiếm món ăn theo nguyên liệu (ức gà, cá hồi, tôm, bò, đậu hũ chay...)\n- Tra cứu calo, khối lượng và thành phần món\n- Thông tin 4 gói ăn (set ăn ngày, gói 3 ngày, gói tuần, gói tháng)\n- Danh sách voucher và chi nhánh phục vụ\n- Tra cứu tình trạng đơn hàng bằng mã đơn (ví dụ: VF2610-1234)\n\nNếu bạn cần hỗ trợ đặc biệt, xin vui lòng gọi hotline chi nhánh hoặc để lại thông tin tại mục **Tư vấn gói tháng** nhé!`,
    });
  } catch (error) {
    console.error("Chatbot API error:", error);
    return NextResponse.json(
      { reply: "Xin lỗi bạn, trợ lý VieFood đang bận cập nhật dữ liệu một chút. Bạn vui lòng thử lại sau nhé!" },
      { status: 500 }
    );
  }
}

