import { useState, useEffect } from 'react'
import { X, Gift, Copy } from 'lucide-react'
import { useLuckyDrawStore } from '@/stores/lucky-draw.store'

const SEGMENTS = [
  { label: '10% OFF', value: '10% Discount Coupon', color: '#F5F5F5', textColor: '#333333' },
  { label: 'Free Gift', value: 'Random Sample Kit', color: '#ffffff', textColor: '#333333' },
  { label: '5% OFF', value: '5% Discount Coupon', color: '#F5F5F5', textColor: '#333333' },
  { label: 'Free Ship', value: 'Free Shipping', color: '#ffffff', textColor: '#333333' },
  { label: '20% OFF', value: '20% Secret Discount', color: '#000000', textColor: '#ffffff' },
  { label: 'Try Again', value: 'Better luck next time...', color: '#F5F5F5', textColor: '#999999' },
]

const TOTAL_SEGMENTS = SEGMENTS.length
const SEGMENT_ANGLE = 360 / TOTAL_SEGMENTS

// Confetti 파티클 효과
const Confetti = () => {
  const [particles, setParticles] = useState<any[]>([])

  useEffect(() => {
    const colors = ['#FFD700', '#FFC0CB', '#FFFFFF', '#000000']
    const newParticles = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: 50,
      y: 50,
      angle: Math.random() * 360,
      velocity: 2 + Math.random() * 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 4 + Math.random() * 4,
      rotation: Math.random() * 360,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full animate-confetti"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            '--angle': `${p.angle}deg`,
            '--velocity': p.velocity,
            '--rotation': `${p.rotation}deg`,
          } as any}
        />
      ))}
      <style>{`
        @keyframes confetti-explode {
          0% { transform: translate(-50%, -50%) rotate(0deg); opacity: 1; }
          100% { 
            transform: translate(calc(-50% + (cos(var(--angle)) * var(--velocity) * 200px)), 
                       calc(-50% + (sin(var(--angle)) * var(--velocity) * 200px))) 
                       rotate(var(--rotation));
            opacity: 0; 
          }
        }
        .animate-confetti {
          animation: confetti-explode 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
      `}</style>
    </div>
  )
}

export function LuckyDrawPopup() {
  const { isOpen, closeLuckyDraw } = useLuckyDrawStore()
  const [isSpinning, setIsSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [result, setResult] = useState<typeof SEGMENTS[0] | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  const handleSpin = () => {
    if (isSpinning || result) return

    setIsSpinning(true)
    const minSpins = 5
    const randomDegree = Math.floor(Math.random() * 360)
    const totalRotation = minSpins * 360 + randomDegree
    const newRotation = rotation + totalRotation

    setRotation(newRotation)

    setTimeout(() => {
      setIsSpinning(false)
      calculateResult(newRotation)
      setShowConfetti(true)
    }, 4000)
  }

  const calculateResult = (finalRotation: number) => {
    const actualDeg = finalRotation % 360
    const pointerIndex = Math.floor(((360 - actualDeg + SEGMENT_ANGLE / 2) % 360) / SEGMENT_ANGLE)
    const winningSegment = SEGMENTS[pointerIndex]
    setResult(winningSegment)
  }

  const resetGame = () => {
    closeLuckyDraw()
    setTimeout(() => {
      setResult(null)
      setShowConfetti(false)
      setRotation(0)
    }, 300)
  }

  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent)
    const y = Math.sin(2 * Math.PI * percent)
    return [x, y]
  }

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText('LUCKY2024')
    alert('Coupon code copied to clipboard!')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300" onClick={resetGame} />

      <div className="relative bg-white w-full max-w-2xl shadow-2xl overflow-hidden transform transition-all duration-500 scale-100">
        {showConfetti && <Confetti />}

        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-800 tracking-wide text-lg" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Hiragino Sans", "Roboto", "NotoSansJP", Arial, sans-serif' }}>OLIVEYOUNG LUCKY DRAW</span>
          </div>
          <button onClick={resetGame} className="text-gray-400 hover:text-black transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Wheel Container */}
        <div className="p-12 flex flex-col items-center justify-center bg-white">
          {!result ? (
            <>
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold mb-2 text-gray-900" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Hiragino Sans", "Roboto", "NotoSansJP", Arial, sans-serif' }}>Spin & Win</h2>
                <p className="text-gray-500 text-base" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Hiragino Sans", "Roboto", "NotoSansJP", Arial, sans-serif' }}>Today's special offer awaits you.</p>
              </div>

              <div className="relative w-80 h-80 md:w-96 md:h-96">
                {/* Pointer */}
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
                  <div className="w-10 h-12 bg-[#00C73C] rounded-b-full shadow-lg flex items-center justify-center border-2 border-white">
                    <div className="w-3 h-3 bg-white rounded-full" />
                  </div>
                </div>

                {/* The Wheel */}
                <div
                  className="w-full h-full rounded-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] border-8 border-gray-200 overflow-hidden relative"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    transition: isSpinning ? 'transform 4s cubic-bezier(0.1, 0, 0.2, 1)' : 'none',
                  }}
                >
                  <svg viewBox="-1 -1 2 2" className="w-full h-full transform -rotate-90">
                    {SEGMENTS.map((seg, i) => {
                      const startAngle = i * (1 / TOTAL_SEGMENTS)
                      const endAngle = (i + 1) * (1 / TOTAL_SEGMENTS)
                      const [x1, y1] = getCoordinatesForPercent(startAngle)
                      const [x2, y2] = getCoordinatesForPercent(endAngle)
                      const pathData = `M 0 0 L ${x1} ${y1} A 1 1 0 0 1 ${x2} ${y2} Z`

                      return (
                        <g key={i}>
                          <path d={pathData} fill={seg.color} stroke="white" strokeWidth="0.02" />
                          <text
                            x={0.65}
                            y={0}
                            fill={seg.textColor}
                            fontSize="0.14"
                            fontWeight="bold"
                            textAnchor="middle"
                            alignmentBaseline="middle"
                            transform={`rotate(${i * 360 / TOTAL_SEGMENTS + 360 / TOTAL_SEGMENTS / 2})`}
                            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Hiragino Sans", "Roboto", "NotoSansJP", Arial, sans-serif' }}
                          >
                            {seg.label}
                          </text>
                        </g>
                      )
                    })}
                  </svg>
                </div>

                {/* Center Button */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <button
                    onClick={handleSpin}
                    disabled={isSpinning}
                    className={`w-20 h-20 rounded-full bg-white shadow-xl flex items-center justify-center border-4 border-gray-200 font-bold text-sm tracking-wider text-gray-900 transition-transform ${
                      isSpinning ? 'scale-95 opacity-80' : 'hover:scale-105 active:scale-95'
                    }`}
                    style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Hiragino Sans", "Roboto", "NotoSansJP", Arial, sans-serif' }}
                  >
                    {isSpinning ? '...' : 'SPIN'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 animate-scale-in">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <Gift className="w-12 h-12 text-gray-700" />
              </div>
              <h3 className="text-4xl font-bold text-gray-900 mb-3" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Hiragino Sans", "Roboto", "NotoSansJP", Arial, sans-serif' }}>Congratulations!</h3>
              <p className="text-gray-500 mb-8 text-lg" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Hiragino Sans", "Roboto", "NotoSansJP", Arial, sans-serif' }}>
                You won: <span className="text-gray-900 font-bold">{result.value}</span>
              </p>

              <div className="w-full bg-gray-100 p-5 flex items-center justify-between mb-8 border border-gray-200 border-dashed">
                <code className="font-mono text-xl font-bold text-gray-700">LUCKY2024</code>
                <button
                  onClick={handleCopyCoupon}
                  className="text-base flex items-center gap-2 text-gray-500 hover:text-black font-semibold"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Hiragino Sans", "Roboto", "NotoSansJP", Arial, sans-serif' }}
                >
                  <Copy size={16} /> Copy
                </button>
              </div>

              <button
                onClick={handleCopyCoupon}
                className="w-full bg-black text-white py-5 font-bold text-base tracking-wide hover:bg-gray-800 transition-colors shadow-lg"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Hiragino Sans", "Roboto", "NotoSansJP", Arial, sans-serif' }}
              >
                CLAIM REWARD NOW
              </button>

              <button
                onClick={() => {
                  setResult(null)
                  setRotation(0)
                  setShowConfetti(false)
                }}
                className="mt-5 text-sm text-gray-400 underline hover:text-gray-600"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Hiragino Sans", "Roboto", "NotoSansJP", Arial, sans-serif' }}
              >
                Play again for fun
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {!result && (
          <div className="bg-white p-5 text-center border-t border-gray-100">
            <p className="text-xs text-gray-400" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Hiragino Sans", "Roboto", "NotoSansJP", Arial, sans-serif' }}>*Coupon expires in 24 hours. One spin per day.</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes scale-in {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

