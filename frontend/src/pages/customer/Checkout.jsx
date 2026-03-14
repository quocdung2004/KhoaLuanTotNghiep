import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Truck, QrCode, CreditCard, Banknote } from 'lucide-react'; // Thêm icon

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [checkoutItems, setCheckoutItems] = useState([]);
  const selectedIds = location.state?.selectedItems || [];

  const MY_BANK = {
    BANK_ID: "MB",
    ACCOUNT_NO: "0336766665"
  };

  const [customerInfo, setCustomerInfo] = useState({
    name: '', phone: '', address: '', note: ''
  });

  // --- STATE MỚI: Phương thức thanh toán ---
  // Mặc định cho khách chọn COD trước cho thân thiện
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const [showQR, setShowQR] = useState(false);
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('glassesCart')) || [];
    const itemsToCheckout = savedCart.filter(item => selectedIds.includes(item.cartId));

    setCheckoutItems(itemsToCheckout);
    setOrderId(`DH${Math.floor(Math.random() * 10000)}`);

    if (itemsToCheckout.length === 0) {
      alert("Vui lòng chọn sản phẩm trước khi thanh toán!");
      navigate('/cart');
    }
  }, []);

  const calculateTotal = () => {
    return checkoutItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // --- HÀM XỬ LÝ ĐẶT HÀNG CHUNG ---
  const handlePlaceOrder = () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      alert("Vui lòng điền đầy đủ thông tin giao hàng!");
      return;
    }

    if (paymentMethod === 'banking') {
      // Nếu chọn chuyển khoản -> Mở QR Code
      setShowQR(true);
    } else {
      // Nếu chọn COD -> Hoàn tất đơn hàng ngay lập tức
      processSuccessfulOrder();
    }
  };

  // --- HÀM HOÀN TẤT & XÓA GIỎ HÀNG (Dùng chung cho cả COD và QR) ---
  const processSuccessfulOrder = () => {
    const currentCart = JSON.parse(localStorage.getItem('glassesCart')) || [];
    const purchasedIds = checkoutItems.map(item => item.cartId);
    const remainingCart = currentCart.filter(item => !purchasedIds.includes(item.cartId));

    localStorage.setItem('glassesCart', JSON.stringify(remainingCart));
    window.dispatchEvent(new Event('cartUpdated'));

    // --- PHẦN MỚI: LƯU ĐƠN HÀNG CHO ADMIN QUẢN LÝ ---
    const newOrder = {
      id: orderId,
      customer: customerInfo,
      items: checkoutItems,
      total: calculateTotal(),
      paymentMethod: paymentMethod,
      status: 'pending', // Trạng thái mặc định: Đang chờ duyệt
      date: new Date().toISOString()
    };

    const existingOrders = JSON.parse(localStorage.getItem('glassesOrders')) || [];
    localStorage.setItem('glassesOrders', JSON.stringify([newOrder, ...existingOrders])); // Đẩy đơn mới lên đầu

    const methodText = paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản QR';
    alert(`🎉 ĐẶT HÀNG THÀNH CÔNG!\nMã đơn: ${orderId}\nPhương thức: ${methodText}\nCảm ơn bạn đã mua sắm.`);
    navigate('/');
  };

  const qrUrl = `https://img.vietqr.io/image/${MY_BANK.BANK_ID}-${MY_BANK.ACCOUNT_NO}-compact2.png?amount=${calculateTotal()}&addInfo=${orderId}&accountName=${MY_BANK.ACCOUNT_NAME}`;

  if (checkoutItems.length === 0) return null; // Tránh render nháy trước khi redirect

  return (
    <div className="min-h-screen bg-gray-50 py-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <button onClick={() => navigate(-1)} className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 font-medium transition">
          <ArrowLeft className="w-5 h-5 mr-2" /> Quay lại giỏ hàng
        </button>

        <h1 className="text-3xl font-black text-gray-900 mb-8">Thanh Toán Đơn Hàng</h1>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* CỘT TRÁI: FORM GIAO HÀNG & CHỌN PHƯƠNG THỨC */}
          <div className="lg:w-2/3 space-y-6">

            {/* Box 1: Thông tin người nhận */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                <Truck className="text-blue-600 w-6 h-6" /> Thông tin nhận hàng
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">Họ và tên *</label>
                  <input type="text" placeholder="Nguyễn Văn A"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none"
                    value={customerInfo.name} onChange={e => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">Số điện thoại *</label>
                  <input type="tel" placeholder="0901234567"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none"
                    value={customerInfo.phone} onChange={e => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-bold text-gray-700">Địa chỉ giao hàng chi tiết *</label>
                  <input type="text" placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện, Tỉnh/TP"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-600 outline-none"
                    value={customerInfo.address} onChange={e => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Box 2: Chọn phương thức thanh toán */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                <CreditCard className="text-blue-600 w-6 h-6" /> Phương thức thanh toán
              </h2>

              <div className="space-y-3">

                {/* Option 1: COD */}
                <label className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-100 hover:border-blue-200'}`}>
                  <input
                    type="radio" name="payment" value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => { setPaymentMethod('cod'); setShowQR(false); }}
                    className="hidden"
                  />
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 flex-shrink-0 ${paymentMethod === 'cod' ? 'border-blue-600' : 'border-gray-300'}`}>
                    {paymentMethod === 'cod' && <div className="w-3 h-3 bg-blue-600 rounded-full"></div>}
                  </div>
                  <Banknote className="w-6 h-6 text-green-600 mr-3 flex-shrink-0" />
                  <div>
                    <div className="font-bold text-gray-900">Thanh toán khi nhận hàng (COD)</div>
                    <div className="text-sm text-gray-500">Thanh toán bằng tiền mặt khi shipper giao kính tới.</div>
                  </div>
                </label>

                {/* Option 2: Banking / QR */}
                <label className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === 'banking' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-100 hover:border-blue-200'}`}>
                  <input
                    type="radio" name="payment" value="banking"
                    checked={paymentMethod === 'banking'}
                    onChange={() => setPaymentMethod('banking')}
                    className="hidden"
                  />
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 flex-shrink-0 ${paymentMethod === 'banking' ? 'border-blue-600' : 'border-gray-300'}`}>
                    {paymentMethod === 'banking' && <div className="w-3 h-3 bg-blue-600 rounded-full"></div>}
                  </div>
                  <QrCode className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0" />
                  <div>
                    <div className="font-bold text-gray-900">Chuyển khoản qua mã QR (Khuyên dùng)</div>
                    <div className="text-sm text-gray-500">Mở app Ngân hàng hoặc MoMo quét mã QR tự động.</div>
                  </div>
                </label>

              </div>
            </div>

          </div>

          {/* CỘT PHẢI: BILL & NÚT CHỨC NĂNG */}
          <div className="lg:w-1/3">
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Mã đơn: <span className="text-blue-600">{orderId}</span></h3>

              <div className="space-y-3 mb-6 max-h-48 overflow-y-auto pr-2">
                {checkoutItems.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600 line-clamp-1 w-2/3">{item.quantity}x {item.name}</span>
                    <span className="font-bold">{(item.price * item.quantity).toLocaleString('vi-VN')} đ</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between items-end">
                  <span className="text-gray-700 font-bold">Cần thanh toán</span>
                  <span className="text-2xl font-black text-blue-600">{calculateTotal().toLocaleString('vi-VN')} đ</span>
                </div>
              </div>

              {/* LOGIC HIỂN THỊ NÚT VÀ QR CODE */}
              {paymentMethod === 'cod' ? (
                // NẾU CHỌN COD: Chỉ hiện 1 nút bấm xong là hoàn tất
                <button
                  onClick={handlePlaceOrder}
                  className="w-full py-4 rounded-xl font-bold text-lg bg-gray-900 text-white hover:bg-blue-600 transition flex items-center justify-center gap-2 shadow-lg"
                >
                  <CheckCircle2 className="w-6 h-6" /> Xác nhận Đặt Hàng
                </button>
              ) : (
                // NẾU CHỌN BANKING: Hiện luồng tạo QR
                !showQR ? (
                  <button
                    onClick={handlePlaceOrder}
                    className="w-full py-4 rounded-xl font-bold text-lg bg-gray-900 text-white hover:bg-blue-600 transition flex items-center justify-center gap-2 shadow-lg"
                  >
                    <QrCode className="w-6 h-6" /> Tạo mã QR Thanh toán
                  </button>
                ) : (
                  <div className="flex flex-col items-center animate-in zoom-in duration-300">
                    <div className="bg-blue-50 p-4 rounded-2xl border-2 border-blue-200 w-full flex justify-center mb-4">
                      <img src={qrUrl} alt="QR Thanh Toan" className="w-full max-w-[200px] object-contain rounded-xl mix-blend-multiply" />
                    </div>
                    <p className="text-sm text-center text-gray-500 mb-4">
                      Quét mã để thanh toán.<br />Hệ thống tự động xác nhận sau khi nhận tiền.
                    </p>
                    <button
                      onClick={processSuccessfulOrder} // Gọi hàm hoàn tất chung
                      className="w-full py-4 rounded-xl font-bold text-lg bg-green-500 text-white hover:bg-green-600 transition flex items-center justify-center gap-2 shadow-lg"
                    >
                      <CheckCircle2 className="w-6 h-6" /> Đã chuyển khoản xong
                    </button>
                  </div>
                )
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}