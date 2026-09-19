const express = require('express');
const { Resend } = require('resend');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

// ĐIỀN API KEY RESEND VÀ EMAIL CỦA BẠN VÀO ĐÂY:
const resend = new Resend('re_123456789_your_api_key_here'); // Điền API Key Resend của bạn
const ADMIN_EMAIL = 'your-email@example.com';               // Email nhận thông báo của bạn

app.post('/api/send-order', async (req, res) => {
    const { orderId, usdtAmount, vndAmount, network, wallet, telegram, userEmail } = req.body;

    try {
        const data = await resend.emails.send({
            from: 'BoY Crypto <onboarding@resend.dev>',
            to: [ADMIN_EMAIL],
            subject: `[ĐƠN MUA MỚI] ${orderId} - ${usdtAmount} USDT`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f5; color: #333;">
                    <h2 style="color: #2563eb;">Có đơn mua USDT mới từ BoY CRYPTO!</h2>
                    <hr/>
                    <p><strong>Mã đơn hàng:</strong> <span style="color: #d97706; font-weight: bold;">${orderId}</span></p>
                    <p><strong>Số lượng USDT:</strong> ${usdtAmount} USDT</p>
                    <p><strong>Số tiền VNĐ nhận:</strong> ${vndAmount.toLocaleString('vi-VN')} VNĐ</p>
                    <p><strong>Mạng lưới Blockchain:</strong> ${network}</p>
                    <p><strong>Địa chỉ ví nhận:</strong> <code style="background: #e2e8f0; padding: 2px 6px; rounded: 4px;">${wallet}</code></p>
                    <p><strong>Telegram Khách:</strong> <a href="https://t.me/${telegram}">@${telegram}</a></p>
                    <p><strong>Email Khách:</strong> ${userEmail || 'Không nhập'}</p>
                    <hr/>
                    <p style="font-size: 12px; color: #666;">Kiểm tra tài khoản MBBank 797968682525 để xác nhận và chuyển USDT cho khách hàng.</p>
                </div>
            `
        });

        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error('Lỗi Resend API:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server BoY CRYPTO running on port ${PORT}`));
