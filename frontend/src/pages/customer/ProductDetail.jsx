import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Camera, ShoppingCart, ShieldCheck, ChevronLeft, Info, X, RefreshCw, Download } from 'lucide-react';
import { PRODUCTS } from '../../constants/data';
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

export default function ProductDetail() {
  const { id } = useParams();
  const product = PRODUCTS.find(p => p.id === parseInt(id));

  // --- 1. QUẢN LÝ TRẠNG THÁI (STATE) ---
  const [hasPrescription, setHasPrescription] = useState(false);
  const [od, setOd] = useState('');
  const [os, setOs] = useState('');
  const [isAROpen, setIsAROpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(true);
  const [capturedImage, setCapturedImage] = useState(null); // Lưu ảnh sau khi chụp

  // --- 2. QUẢN LÝ THAM CHIẾU (REFS) ---
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const faceLandmarkerRef = useRef(null);
  const requestRef = useRef(null);
  const glassesImageRef = useRef(new Image());

  // --- 3. KHỞI TẠO BỘ NÃO AI (MEDIAPIPE) ---
  useEffect(() => {
    if (product) glassesImageRef.current.src = product.image;

    const initAI = async () => {
      try {
        const filesetResolver = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
        );
        faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
            delegate: "GPU"
          },
          outputFaceBlendshapes: true,
          runningMode: "VIDEO",
          numFaces: 1
        });
        setIsAiLoading(false);
        console.log("AI MediaPipe đã sẵn sàng!");
      } catch (err) {
        console.error("Lỗi khởi tạo AI:", err);
      }
    };
    initAI();

    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [product]);

  // --- 4. THUẬT TOÁN VẼ KÍNH (AR ENGINE) ---
  const drawGlasses = (landmarks) => {
    const canvas = canvasRef.current;
    if (!canvas || !glassesImageRef.current.complete) return;
    const ctx = canvas.getContext("2d");

    // Các điểm mốc quan trọng (Landmarks Index)
    const midPoint = landmarks[168]; // Giữa sống mũi
    const leftFace = landmarks[234]; // Rìa mặt trái
    const rightFace = landmarks[454]; // Rìa mặt phải
    const p1 = landmarks[33];        // Góc mắt trái
    const p2 = landmarks[263];       // Góc mắt phải

    // Tính độ rộng kính (Scale)
    const faceWidth = Math.sqrt(
      Math.pow((rightFace.x - leftFace.x) * canvas.width, 2) +
      Math.pow((rightFace.y - leftFace.y) * canvas.height, 2)
    );
    const glassesWidth = faceWidth * 1.15; // Hệ số điều chỉnh độ to của kính
    const glassesHeight = glassesWidth * (glassesImageRef.current.height / glassesImageRef.current.width);

    // Tính góc nghiêng của đầu (Rotation) bằng công thức tan
    // $$ \text{angle} = \arctan2(\Delta y, \Delta x) $$
    const angle = Math.atan2(
      (p2.y - p1.y) * canvas.height,
      (p2.x - p1.x) * canvas.width
    );
    const yOffsetScale = 0.1;
    const yOffset = glassesHeight * yOffsetScale;

    const xOffsetScale = 0.005;
    const xOffset = glassesWidth * xOffsetScale;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate((midPoint.x * canvas.width) + xOffset, (midPoint.y * canvas.height) + yOffset);
    ctx.rotate(angle);
    ctx.drawImage(
      glassesImageRef.current,
      -glassesWidth / 2,
      -glassesHeight / 2,
      glassesWidth,
      glassesHeight
    );
    ctx.restore();
  };

  const predictWebcam = () => {
    if (faceLandmarkerRef.current && videoRef.current?.readyState === 4) {
      const results = faceLandmarkerRef.current.detectForVideo(videoRef.current, performance.now());
      if (results.faceLandmarks?.[0]) {
        drawGlasses(results.faceLandmarks[0]);
      }
    }
    if (isAROpen && !capturedImage) {
      requestRef.current = requestAnimationFrame(predictWebcam);
    }
  };

  // --- 5. LOGIC CHỤP ẢNH & TẢI VỀ ---
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    // 1. Tạo Canvas tạm với kích thước chuẩn của Video
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = video.videoWidth;
    tempCanvas.height = video.videoHeight;
    const tempCtx = tempCanvas.getContext("2d");

    // 2. Vẽ MẶT từ Video (Lật ngược để ảnh tải về đúng chiều)
    tempCtx.translate(tempCanvas.width, 0);
    tempCtx.scale(-1, 1);
    tempCtx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);
    
    // 3. Vẽ KÍNH từ Canvas AR (Cũng phải lật ngược để khớp với mặt)
    // Lưu ý: KHÔNG reset transform ở đây, để nguyên trạng thái lật ngược
    tempCtx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);

    // Reset lại transform về mặc định (cho chắc chắn)
    tempCtx.setTransform(1, 0, 0, 1, 0, 0);

    // Xuất ảnh
    setCapturedImage(tempCanvas.toDataURL("image/png"));
  };

  // --- 6. ĐIỀU KHIỂN CAMERA ---
  const startCamera = () => {
    setCapturedImage(null);
    setIsAROpen(true);
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    setIsAROpen(false);
    setCapturedImage(null);
  };

  useEffect(() => {
    if (isAROpen && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
        .then((stream) => {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            predictWebcam();
          };
        });
    }
  }, [isAROpen]);

  const calculateBlur = () => {
    if (!hasPrescription) return 0;
    const maxVal = Math.max(Math.abs(parseFloat(od) || 0), Math.abs(parseFloat(os) || 0));
    return maxVal * 2;
  };

  if (!product) return <div className="p-20 text-center">Đang tải sản phẩm...</div>;

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* ---------------- TRANG CHI TIẾT SẢN PHẨM ---------------- */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-8 font-medium">
          <ChevronLeft className="w-5 h-5 mr-1" /> Quay lại cửa hàng
        </Link>

        <div className="flex flex-col md:flex-row gap-12">
          {/* CỘT TRÁI: ẢNH SẢN PHẨM */}
          <div className="md:w-1/2 flex flex-col gap-6">
            <div className="bg-gray-50 rounded-3xl p-10 aspect-square flex items-center justify-center relative border border-gray-100 shadow-inner">
              <img src={product.image} alt={product.name} className="w-full h-auto object-contain" />
              {product.isARAvailable && (
                <div className="absolute top-6 left-6 bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center border border-green-200">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  HỖ TRỢ THỬ KÍNH ẢO
                </div>
              )}
            </div>

            <button
              onClick={startCamera}
              disabled={isAiLoading}
              className={`w-full py-5 rounded-2xl font-black text-xl flex items-center justify-center space-x-3 transition-all ${isAiLoading ? 'bg-gray-200 text-gray-400' : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl hover:scale-[1.01]'}`}
            >
              <Camera className="w-7 h-7" />
              <span>{isAiLoading ? "ĐANG TẢI AI..." : "THỬ KÍNH THỰC TẾ ẢO (AR)"}</span>
            </button>
          </div>

          {/* CỘT PHẢI: THÔNG TIN & ĐỘ CẬN */}
          <div className="md:w-1/2">
            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">{product.name}</h1>
            <div className="text-3xl font-black text-blue-600 my-6">{product.price.toLocaleString('vi-VN')} VNĐ</div>

            <p className="text-gray-600 text-lg mb-8">{product.description || "Gọng kính Titanium cao cấp, siêu nhẹ, bền bỉ và không gây kích ứng da."}</p>

            <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-blue-900 text-lg">Áp dụng độ cận của bạn</span>
                <input type="checkbox" checked={hasPrescription} onChange={() => setHasPrescription(!hasPrescription)} className="w-6 h-6 rounded-lg cursor-pointer" />
              </div>

              {hasPrescription && (
                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-blue-200">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-blue-400 uppercase">Mắt phải (OD)</label>
                    <input type="number" value={od} onChange={(e) => setOd(e.target.value)} step="0.25" placeholder="-1.50" className="w-full p-4 rounded-xl border-white outline-none focus:ring-2 focus:ring-blue-400 shadow-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-blue-400 uppercase">Mắt trái (OS)</label>
                    <input type="number" value={os} onChange={(e) => setOs(e.target.value)} step="0.25" placeholder="-1.25" className="w-full p-4 rounded-xl border-white outline-none focus:ring-2 focus:ring-blue-400 shadow-sm" />
                  </div>
                </div>
              )}
            </div>

            <button className="w-full bg-gray-900 text-white py-5 rounded-2xl font-bold text-xl hover:bg-black transition flex items-center justify-center gap-3 shadow-lg">
              <ShoppingCart className="w-6 h-6" /> Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>

      {/* ---------------- MODAL AR ---------------- */}
      {isAROpen && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col animate-in fade-in duration-300">
          {/* Header */}
          <div className="p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent z-10 text-white">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="font-bold tracking-wide">PHÒNG THỬ KÍNH ẢO</span>
            </div>
            <button onClick={stopCamera} className="bg-white/20 hover:bg-red-500 text-white p-2 rounded-full transition-colors">
              <X className="w-8 h-8" />
            </button>
          </div>

          {/* Màn hình Camera hoặc Preview */}
          <div className="relative flex-1 flex items-center justify-center overflow-hidden">
            {!capturedImage ? (
              <>
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform -scale-x-100" style={{ filter: `blur(${calculateBlur()}px)` }} />
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover transform -scale-x-100 pointer-events-none" />

                {/* Nút Chụp Ảnh */}
                <div className="absolute bottom-12 w-full flex justify-center items-center z-20">
                  <button
                    onClick={capturePhoto}
                    className="group relative flex items-center justify-center"
                  >
                    <div className="absolute w-20 h-20 bg-white/30 rounded-full animate-ping"></div>
                    <div className="w-16 h-16 bg-white rounded-full border-4 border-gray-400 shadow-2xl flex items-center justify-center group-active:scale-90 transition-transform">
                      <div className="w-12 h-12 rounded-full border-2 border-gray-100"></div>
                    </div>
                  </button>
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center animate-in zoom-in-95 duration-300">
                <img src={capturedImage} className="w-full h-full object-cover" alt="Captured" />

                {/* Thanh công cụ sau khi chụp */}
                <div className="absolute bottom-12 w-full px-6 flex justify-between items-center z-20 max-w-md">
                  <button
                    onClick={() => setCapturedImage(null)}
                    className="flex-1 bg-white/20 backdrop-blur-md text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 border border-white/30 hover:bg-white/30 transition"
                  >
                    <RefreshCw className="w-5 h-5" /> Chụp lại
                  </button>
                  <div className="w-4"></div>
                  <a
                    href={capturedImage}
                    download={`kinh-dung-${product.id}.png`}
                    className="flex-[1.5] bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-blue-600/30 hover:bg-blue-700 transition"
                  >
                    <Download className="w-5 h-5" /> Tải ảnh về máy
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Chỉ số mô phỏng (Chỉ hiện khi đang live) */}
          {!capturedImage && (
            <div className="p-6 bg-black/90 backdrop-blur-xl border-t border-white/10 flex items-center justify-around text-white">
              <div className="text-center">
                <p className="text-[10px] uppercase opacity-50 mb-1">CẬN GIẢ LẬP</p>
                <p className="font-black text-blue-400 text-xl">{calculateBlur() / 2} Diop</p>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
              <div className="text-center">
                <p className="text-[10px] uppercase opacity-50 mb-1">MỨC ĐỘ MỜ</p>
                <p className="font-black text-yellow-400 text-xl">{calculateBlur()}px</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}