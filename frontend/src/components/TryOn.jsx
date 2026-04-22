import { useEffect, useRef, useState } from 'react'
import { X, Camera, RotateCcw, Download, ChevronLeft, ChevronRight, Video, Square } from 'lucide-react'
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'

const GLASSES_LIST = [
  { id: 1, src: '/glasses/glasses_1.png', label: 'Kính 1' },
  { id: 2, src: '/glasses/glasses_2.png', label: 'Kính 2' },
  { id: 3, src: '/glasses/glasses_3.png', label: 'Kính 3' },
]

function TryOn({ product, prescription, onClose }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const glassesImgRef = useRef(null)
  const faceLandmarkerRef = useRef(null)
  const requestRef = useRef(null)
  const streamRef = useRef(null)
  const capturedImageRef = useRef(null)
  const isWearingRef = useRef(false)
  const mediaRecorderRef = useRef(null)
  const recordedChunksRef = useRef([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [capturedImage, setCapturedImage] = useState(null)
  const [currentGlasses, setCurrentGlasses] = useState(0)
  const [isWearingGlasses, setIsWearingGlasses] = useState(false)
  const [mode, setMode] = useState('photo') // 'photo' | 'video'
  const [isRecording, setIsRecording] = useState(false)
  const [recordedVideo, setRecordedVideo] = useState(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const timerRef = useRef(null)

  // Load ảnh kính khi đổi
  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = GLASSES_LIST[currentGlasses].src
    img.onload = () => { glassesImgRef.current = img }
  }, [currentGlasses])

  // Khởi tạo AI + Camera
  useEffect(() => {
    let cancelled = false

    const init = async () => {
      try {
        const filesetResolver = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm'
        )
        faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
            delegate: 'GPU'
          },
          runningMode: 'VIDEO',
          numFaces: 4,
          outputFaceBlendshapes: false,
        })

        if (cancelled) return

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' }
        })
        streamRef.current = stream

        const video = videoRef.current
        video.srcObject = stream
        video.playsInline = true
        video.muted = true

        await new Promise((resolve) => {
          video.onloadedmetadata = () => {
            video.play().then(resolve).catch(resolve)
          }
        })

        if (cancelled) return
        setLoading(false)
        requestRef.current = requestAnimationFrame(detectLoop)

      } catch (err) {
        console.error(err)
        if (!cancelled) {
          setError(`Lỗi: ${err.message}`)
          setLoading(false)
        }
      }
    }

    init()

    return () => {
      cancelled = true
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const drawGlasses = (landmarks) => {
    const canvas = canvasRef.current
    const video = videoRef.current
    if (!canvas || !video) return

    const ctx = canvas.getContext('2d')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    ctx.save()
    ctx.translate(canvas.width, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    ctx.restore()

    if (!isWearingRef.current || !glassesImgRef.current) return

    landmarks.forEach((faceLandmarks) => {
      const midPoint = faceLandmarks[168]
      const leftFace = faceLandmarks[234]
      const rightFace = faceLandmarks[454]
      const p1 = faceLandmarks[33]
      const p2 = faceLandmarks[263]

      const faceWidth = Math.sqrt(
        Math.pow((rightFace.x - leftFace.x) * canvas.width, 2) +
        Math.pow((rightFace.y - leftFace.y) * canvas.height, 2)
      )
      const glassesWidth = faceWidth * 1.15
      const aspectRatio = glassesImgRef.current.height / glassesImgRef.current.width
      const glassesHeight = glassesWidth * aspectRatio

      const angle = -Math.atan2(
        (p2.y - p1.y) * canvas.height,
        (p2.x - p1.x) * canvas.width
      )

      const centerX = (1 - midPoint.x) * canvas.width + 2
      const centerY = midPoint.y * canvas.height + glassesHeight * 0.1

      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(angle)
      ctx.drawImage(
        glassesImgRef.current,
        -glassesWidth / 2,
        -glassesHeight / 2,
        glassesWidth,
        glassesHeight
      )
      ctx.restore()
    })
  }

  const detectLoop = () => {
    const video = videoRef.current
    const faceLandmarker = faceLandmarkerRef.current
    if (!video || !faceLandmarker || video.readyState < 2) {
      requestRef.current = requestAnimationFrame(detectLoop)
      return
    }

    const results = faceLandmarker.detectForVideo(video, performance.now())
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')

    if (canvas && ctx) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      ctx.save()
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      ctx.restore()

      if (results.faceLandmarks?.length > 0) {
        drawGlasses(results.faceLandmarks)
      }
    }

    if (!capturedImageRef.current) {
      requestRef.current = requestAnimationFrame(detectLoop)
    }
  }

  // Chụp ảnh
  const handleCapture = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = video.videoWidth
    tempCanvas.height = video.videoHeight
    const tempCtx = tempCanvas.getContext('2d')

    tempCtx.save()
    tempCtx.translate(tempCanvas.width, 0)
    tempCtx.scale(-1, 1)
    tempCtx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height)
    tempCtx.restore()
    tempCtx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height)

    const imageData = tempCanvas.toDataURL('image/png')
    capturedImageRef.current = imageData
    setCapturedImage(imageData)
  }

  const handleRetakePhoto = () => {
    capturedImageRef.current = null
    setCapturedImage(null)
    if (requestRef.current) cancelAnimationFrame(requestRef.current)
    requestRef.current = requestAnimationFrame(detectLoop)
  }

  const handleDownloadPhoto = () => {
    const link = document.createElement('a')
    link.download = `eyewear-photo-${Date.now()}.png`
    link.href = capturedImage
    link.click()
  }

  // Quay video
  const handleStartRecording = async () => {
  const canvas = canvasRef.current
  if (!canvas) return

  recordedChunksRef.current = []

  let audioStream = null
  try {
    audioStream = await navigator.mediaDevices.getUserMedia({ audio: true })
  } catch (err) {
    console.warn('Không có mic')
  }

  const canvasStream = canvas.captureStream(30)
  const tracks = [...canvasStream.getTracks()]
  if (audioStream) tracks.push(...audioStream.getAudioTracks())
  const stream = new MediaStream(tracks)

  // Thử các định dạng theo thứ tự ưu tiên
  const mimeTypes = [
    'video/mp4;codecs=avc1',
    'video/mp4',
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
  ]
  const mimeType = mimeTypes.find(type => MediaRecorder.isTypeSupported(type)) || 'video/webm'
  console.log('Using mimeType:', mimeType)

  const mediaRecorder = new MediaRecorder(stream, { mimeType })

  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) recordedChunksRef.current.push(e.data)
  }

  mediaRecorder.onstop = () => {
    const blob = new Blob(recordedChunksRef.current, { type: mimeType })
    const url = URL.createObjectURL(blob)
    setRecordedVideo(url)
  }

  mediaRecorderRef.current = mediaRecorder
  mediaRecorder.start(100)
  setIsRecording(true)
  setRecordingTime(0)

  timerRef.current = setInterval(() => {
    setRecordingTime(prev => {
      if (prev >= 29) {
        handleStopRecording()
        return 30
      }
      return prev + 1
    })
  }, 1000)
}

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    if (timerRef.current) clearInterval(timerRef.current)
    setIsRecording(false)
  }

  const handleRetakeVideo = () => {
    setRecordedVideo(null)
    setRecordingTime(0)
  }

  const handleDownloadVideo = () => {
  if (recordedChunksRef.current.length === 0) return

  const mimeTypes = [
    'video/mp4;codecs=avc1',
    'video/mp4',
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
  ]
  const mimeType = mimeTypes.find(type => MediaRecorder.isTypeSupported(type)) || 'video/webm'
  const ext = mimeType.includes('mp4') ? 'mp4' : 'webm'

  const blob = new Blob(recordedChunksRef.current, { type: mimeType })
  const reader = new FileReader()
  reader.onload = () => {
    const a = document.createElement('a')
    a.href = reader.result
    a.download = `eyewear-video-${Date.now()}.${ext}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }
  reader.readAsDataURL(blob)
}
  const toggleGlasses = () => {
    const newVal = !isWearingRef.current
    isWearingRef.current = newVal
    setIsWearingGlasses(newVal)
  }

  const blurAmount = prescription
    ? Math.abs((prescription.od + prescription.os) / 2) * 1.5
    : 0

  const prevGlasses = () => setCurrentGlasses(prev => (prev - 1 + GLASSES_LIST.length) % GLASSES_LIST.length)
  const nextGlasses = () => setCurrentGlasses(prev => (prev + 1) % GLASSES_LIST.length)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold">Thử kính: {product.name}</h2>
          <button onClick={onClose}>
            <X size={24} className="text-gray-500 hover:text-red-500" />
          </button>
        </div>

        {/* Camera */}
        <div className="relative bg-black min-h-48">
          <video ref={videoRef} className="hidden" playsInline muted />
          <canvas
            ref={canvasRef}
            className="w-full transition-all duration-500"
            style={{
              display: capturedImage || recordedVideo ? 'none' : 'block',
              filter: !isWearingGlasses && blurAmount > 0 ? `blur(${blurAmount}px)` : 'none'
            }}
          />

          {/* Ảnh chụp */}
          {capturedImage && (
            <img src={capturedImage} alt="captured" className="w-full" />
          )}

          {/* Video preview */}
          {recordedVideo && (
            <video src={recordedVideo} controls autoPlay loop className="w-full" />
          )}

          {/* Loading */}
          {loading && !capturedImage && !recordedVideo && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 gap-3">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500 text-sm">Đang tải model AI, vui lòng chờ...</p>
            </div>
          )}

          {/* Recording indicator */}
          {isRecording && (
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-black bg-opacity-60 text-white px-3 py-1.5 rounded-full">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-bold">{recordingTime}s / 30s</span>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 gap-3 p-6">
              <p className="text-red-500 text-center text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="px-6 py-4 flex flex-col gap-4">

          {/* Toggle đeo kính */}
          {!capturedImage && !recordedVideo && (
            <button
              onClick={toggleGlasses}
              disabled={isRecording}
              className={`w-full py-3 rounded-xl font-bold transition text-lg ${isWearingGlasses
                ? 'bg-gray-800 text-white hover:bg-gray-900'
                : 'bg-blue-600 text-white hover:bg-blue-700'
                } disabled:opacity-50`}
            >
              {isWearingGlasses ? '🕶️ Bỏ kính ra' : '👓 Đeo kính vào'}
            </button>
          )}

          {/* Đổi kính */}
          {!capturedImage && !recordedVideo && isWearingGlasses && (
            <div className="flex items-center justify-center gap-4">
              <button onClick={prevGlasses} disabled={isRecording} className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-50">
                <ChevronLeft size={20} />
              </button>
              <div className="flex gap-2">
                {GLASSES_LIST.map((g, index) => (
                  <button
                    key={g.id}
                    onClick={() => setCurrentGlasses(index)}
                    disabled={isRecording}
                    className={`w-12 h-12 rounded-full border-2 overflow-hidden bg-gray-100 transition disabled:opacity-50 ${currentGlasses === index ? 'border-blue-500' : 'border-gray-300'}`}
                  >
                    <img src={g.src} alt={g.label} className="w-full h-full object-contain p-1" />
                  </button>
                ))}
              </div>
              <button onClick={nextGlasses} disabled={isRecording} className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-50">
                <ChevronRight size={20} />
              </button>
            </div>
          )}

          {/* Chọn chế độ */}
          {!capturedImage && !recordedVideo && !isRecording && (
            <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setMode('photo')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition ${mode === 'photo' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
              >
                <Camera size={18} />
                Chụp ảnh
              </button>
              <button
                onClick={() => setMode('video')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition ${mode === 'video' ? 'bg-white shadow text-red-500' : 'text-gray-500'}`}
              >
                <Video size={18} />
                Quay video
              </button>
            </div>
          )}

          {/* Nút hành động */}
          <div className="flex gap-3 justify-center">

            {/* Chế độ ảnh */}
            {mode === 'photo' && !capturedImage && (
              <button
                onClick={handleCapture}
                disabled={loading}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
              >
                <Camera size={20} />
                Chụp ảnh
              </button>
            )}

            {mode === 'photo' && capturedImage && (
              <>
                <button
                  onClick={handleRetakePhoto}
                  className="flex items-center gap-2 border-2 border-gray-400 text-gray-600 px-6 py-3 rounded-xl hover:bg-gray-50 transition"
                >
                  <RotateCcw size={20} />
                  Chụp lại
                </button>
                <button
                  onClick={handleDownloadPhoto}
                  className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600 transition"
                >
                  <Download size={20} />
                  Lưu ảnh
                </button>
              </>
            )}

            {/* Chế độ video */}
            {mode === 'video' && !recordedVideo && !isRecording && (
              <button
                onClick={handleStartRecording}
                disabled={loading}
                className="flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 transition disabled:opacity-50"
              >
                <Video size={20} />
                Bắt đầu quay
              </button>
            )}

            {mode === 'video' && isRecording && (
              <button
                onClick={handleStopRecording}
                className="flex items-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-xl hover:bg-gray-900 transition animate-pulse"
              >
                <Square size={20} />
                Dừng quay
              </button>
            )}

            {mode === 'video' && recordedVideo && (
              <>
                <button
                  onClick={handleRetakeVideo}
                  className="flex items-center gap-2 border-2 border-gray-400 text-gray-600 px-6 py-3 rounded-xl hover:bg-gray-50 transition"
                >
                  <RotateCcw size={20} />
                  Quay lại
                </button>
                <button
                  onClick={handleDownloadVideo}
                  className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600 transition"
                >
                  <Download size={20} />
                  Lưu video
                </button>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

export default TryOn