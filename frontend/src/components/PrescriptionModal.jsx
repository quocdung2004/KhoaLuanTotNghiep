import { useState } from 'react'
import { X, FileText, Eye, ArrowRight, ChevronLeft } from 'lucide-react'

// Bảng Snellen map sang độ cận
const SNELLEN_ROWS = [
  { label: 'Hàng 1', chars: 'E', size: 72, acuity: '20/200', diopter: -3.0 },
  { label: 'Hàng 2', chars: 'F P', size: 56, acuity: '20/100', diopter: -2.0 },
  { label: 'Hàng 3', chars: 'T O Z', size: 44, acuity: '20/70', diopter: -1.5 },
  { label: 'Hàng 4', chars: 'L P E D', size: 34, acuity: '20/50', diopter: -1.0 },
  { label: 'Hàng 5', chars: 'P E C F D', size: 26, acuity: '20/40', diopter: -0.75 },
  { label: 'Hàng 6', chars: 'E D F C Z P', size: 20, acuity: '20/30', diopter: -0.5 },
  { label: 'Hàng 7', chars: 'F E L O P Z D', size: 15, acuity: '20/20', diopter: 0 },
]

function PrescriptionModal({ onClose, onConfirm }) {
  const [step, setStep] = useState('choose') // choose | manual | snellen | result
  const [od, setOd] = useState('')
  const [os, setOs] = useState('')
  const [snellenStep, setSnellenStep] = useState(0)
  const [lastReadRow, setLastReadRow] = useState(null)

  const handleManualConfirm = () => {
    if (!od && !os) {
      alert('Vui lòng nhập ít nhất 1 mắt!')
      return
    }
    onConfirm({
      od: parseFloat(od) || 0,
      os: parseFloat(os) || 0,
    })
  }

  const handleSnellenRead = (rowIndex) => {
    setLastReadRow(rowIndex)
    if (rowIndex === SNELLEN_ROWS.length - 1) {
      // Đọc được hàng cuối = bình thường
      setStep('result')
    } else {
      setSnellenStep(rowIndex + 1)
    }
  }

  const handleSnellenCantRead = () => {
    const row = SNELLEN_ROWS[snellenStep]
    setLastReadRow(snellenStep - 1 >= 0 ? snellenStep - 1 : 0)
    setStep('result')
  }

  const handleSnellenConfirm = () => {
    const row = SNELLEN_ROWS[lastReadRow ?? 0]
    onConfirm({
      od: row.diopter,
      os: row.diopter,
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-2">
            {step !== 'choose' && (
              <button
                onClick={() => {
                  if (step === 'result') setStep('snellen')
                  else setStep('choose')
                }}
                className="text-gray-400 hover:text-gray-600 mr-1"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            <h2 className="text-lg font-bold">Xác định độ cận</h2>
          </div>
          <button onClick={onClose}>
            <X size={24} className="text-gray-400 hover:text-red-500" />
          </button>
        </div>

        <div className="p-6">

          {/* BƯỚC 1: Chọn phương thức */}
          {step === 'choose' && (
            <div className="flex flex-col gap-4">
              <p className="text-gray-500 text-sm text-center mb-2">
                Chọn cách xác định độ cận để mô phỏng thị lực của bạn
              </p>

              <button
                onClick={() => setStep('manual')}
                className="flex items-center gap-4 border-2 border-gray-200 hover:border-blue-500 rounded-2xl p-5 text-left transition group"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-500 transition">
                  <FileText size={24} className="text-blue-500 group-hover:text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-800">Nhập độ cận sẵn có</p>
                  <p className="text-sm text-gray-500">Tôi đã biết số độ của mình</p>
                </div>
                <ArrowRight size={20} className="ml-auto text-gray-300 group-hover:text-blue-500" />
              </button>

              <button
                onClick={() => { setStep('snellen'); setSnellenStep(0) }}
                className="flex items-center gap-4 border-2 border-gray-200 hover:border-blue-500 rounded-2xl p-5 text-left transition group"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-500 transition">
                  <Eye size={24} className="text-purple-500 group-hover:text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-800">Test thị lực ngay</p>
                  <p className="text-sm text-gray-500">Tôi chưa biết độ cận của mình</p>
                </div>
                <ArrowRight size={20} className="ml-auto text-gray-300 group-hover:text-purple-500" />
              </button>

              <button
                onClick={() => onConfirm({ od: 0, os: 0 })}
                className="text-center text-gray-400 hover:text-gray-600 text-sm py-2"
              >
                Bỏ qua → Thử kính luôn
              </button>
            </div>
          )}

          {/* BƯỚC 2A: Nhập độ cận thủ công */}
          {step === 'manual' && (
            <div className="flex flex-col gap-5">
              <p className="text-gray-500 text-sm text-center">
                Xem số độ trên toa kính hoặc kết quả khám mắt của bạn
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-gray-600 mb-2 block">
                    Mắt phải (OD)
                  </label>
                  <input
                    type="number"
                    value={od}
                    onChange={(e) => setOd(e.target.value)}
                    step="0.25"
                    min="-20"
                    max="0"
                    placeholder="-1.50"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 text-center text-lg font-bold"
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-600 mb-2 block">
                    Mắt trái (OS)
                  </label>
                  <input
                    type="number"
                    value={os}
                    onChange={(e) => setOs(e.target.value)}
                    step="0.25"
                    min="-20"
                    max="0"
                    placeholder="-1.25"
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 text-center text-lg font-bold"
                  />
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700">
                💡 Số âm là cận thị (ví dụ: -1.50), số dương là viễn thị
              </div>

              <button
                onClick={handleManualConfirm}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition"
              >
                Xác nhận → Thử kính
              </button>
            </div>
          )}

          {/* BƯỚC 2B: Test Snellen */}
          {step === 'snellen' && (
            <div className="flex flex-col gap-5">
              <div className="bg-yellow-50 rounded-xl p-3 text-sm text-yellow-700 text-center">
                📏 Ngồi cách màn hình khoảng <strong>40-50cm</strong> để kết quả chính xác hơn
              </div>

              <p className="text-center text-gray-500 text-sm">
                Bạn đọc được hàng này không? (Không được nheo mắt)
              </p>

              {/* Hiển thị hàng chữ hiện tại */}
              <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 text-center min-h-32 flex items-center justify-center">
                <span
                  style={{ fontSize: `${SNELLEN_ROWS[snellenStep].size}px`, fontFamily: 'monospace', letterSpacing: '0.2em' }}
                  className="font-bold text-gray-800"
                >
                  {SNELLEN_ROWS[snellenStep].chars}
                </span>
              </div>

              {/* Progress */}
              <div className="flex gap-1 justify-center">
                {SNELLEN_ROWS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full flex-1 ${i <= snellenStep ? 'bg-blue-500' : 'bg-gray-200'}`}
                  />
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleSnellenRead(snellenStep)}
                  className="bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition"
                >
                  ✅ Đọc được
                </button>
                <button
                  onClick={handleSnellenCantRead}
                  className="bg-red-100 text-red-600 py-3 rounded-xl font-bold hover:bg-red-200 transition"
                >
                  ❌ Không đọc được
                </button>
              </div>
            </div>
          )}

          {/* BƯỚC 3: Kết quả Snellen */}
          {step === 'result' && lastReadRow !== null && (
            <div className="flex flex-col gap-5 text-center">
              <div className="text-5xl">👁️</div>
              <h3 className="text-xl font-bold">Kết quả thị lực của bạn</h3>

              <div className="bg-gray-50 rounded-2xl p-5">
                <p className="text-gray-500 text-sm mb-1">Thị lực ước tính</p>
                <p className="text-3xl font-black text-blue-600">
                  {SNELLEN_ROWS[lastReadRow].acuity}
                </p>
                <p className="text-gray-500 text-sm mt-3 mb-1">Độ cận ước tính</p>
                <p className="text-2xl font-black text-gray-800">
                  {SNELLEN_ROWS[lastReadRow].diopter === 0
                    ? 'Bình thường 🎉'
                    : `${SNELLEN_ROWS[lastReadRow].diopter}D`}
                </p>
              </div>

              <p className="text-xs text-gray-400">
                ⚠️ Đây chỉ là ước tính, không thay thế khám mắt chuyên nghiệp
              </p>

              <button
                onClick={handleSnellenConfirm}
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition"
              >
                Xác nhận → Thử kính
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default PrescriptionModal