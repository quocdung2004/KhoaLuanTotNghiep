import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'

function TryOn({ product, onClose }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let stream = null
    let animationId = null

    const glassesImg = new Image()
    glassesImg.crossOrigin = 'anonymous'
    glassesImg.src = '/glasses/glasses_1.png'

    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve()
          return
        }
        const script = document.createElement('script')
        script.src = src
        script.onload = resolve
        script.onerror = reject
        document.head.appendChild(script)
      })
    }

    const start = async () => {
      try {
        // Load MediaPipe từ CDN
        await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js')
        await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js')

        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' }
        })

        const video = videoRef.current
        video.srcObject = stream
        video.playsInline = true
        video.muted = true

        await new Promise((resolve) => {
          video.onloadedmetadata = () => {
            video.play().then(resolve).catch(resolve)
          }
        })

        setLoading(false)

        const faceMesh = new window.FaceMesh({
          locateFile: (file) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
        })

        faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        })

        faceMesh.onResults((results) => {
          const canvas = canvasRef.current
          const video = videoRef.current
          if (!canvas || !video) return

          const ctx = canvas.getContext('2d')
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight

          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

          if (results.multiFaceLandmarks?.length > 0) {
            const landmarks = results.multiFaceLandmarks[0]
            const leftEye = landmarks[33]
            const rightEye = landmarks[263]

            const x1 = leftEye.x * canvas.width
            const y1 = leftEye.y * canvas.height
            const x2 = rightEye.x * canvas.width
            const y2 = rightEye.y * canvas.height

            const glassesWidth = (x2 - x1) * 2.2
            const glassesHeight = glassesWidth * 0.4
            const centerX = (x1 + x2) / 2
            const centerY = (y1 + y2) / 2
            const angle = Math.atan2(y2 - y1, x2 - x1)

            ctx.save()
            ctx.translate(centerX, centerY)
            ctx.rotate(angle)
            ctx.drawImage(
              glassesImg,
              -glassesWidth / 2,
              -glassesHeight / 2,
              glassesWidth,
              glassesHeight
            )
            ctx.restore()
          }
        })

        const camera = new window.Camera(video, {
          onFrame: async () => {
            await faceMesh.send({ image: video })
          },
          width: 640,
          height: 480,
        })

        camera.start()

      } catch (err) {
        console.error(err)
        setError(`Lỗi: ${err.message}`)
        setLoading(false)
      }
    }

    start()

    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop())
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold">Thử kính: {product.name}</h2>
          <button onClick={onClose}>
            <X size={24} className="text-gray-500 hover:text-red-500" />
          </button>
        </div>

        <div className="relative bg-black">
          <video ref={videoRef} className="hidden" playsInline muted />
          <canvas ref={canvasRef} className="w-full" />

          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 gap-3">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500">Đang tải model AI, vui lòng chờ...</p>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 gap-3 p-6">
              <p className="text-red-500 text-center">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TryOn