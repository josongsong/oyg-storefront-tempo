import { motion } from 'framer-motion'

const BRAND_COLORS = ['#00C73C', '#7DD321', '#00D98F']

interface Polygon {
  id: number
  color: string
  size: number
  x: number
  y: number
  rotation: number
  duration: number
  delay: number
  sides: number
}

// Generate random polygons
export const generatePolygons = (count: number): Polygon[] => {
  return Array.from({ length: count }, (_, i) => {
    const isRightSide = Math.random() > 0.3
    const x = isRightSide ? 50 + Math.random() * 50 : Math.random() * 50

    return {
      id: i,
      color: BRAND_COLORS[Math.floor(Math.random() * BRAND_COLORS.length)],
      size: Math.random() * 120 + 40,
      x,
      y: Math.random() * 100,
      rotation: Math.random() * 360,
      duration: Math.random() * 4 + 2,
      delay: Math.random() * 0.8,
      sides: Math.floor(Math.random() * 3) + 3,
    }
  })
}

const PolygonShape = ({ sides, size, color }: { sides: number; size: number; color: string }) => {
  const points = Array.from({ length: sides }, (_, i) => {
    const angle = (i * 2 * Math.PI) / sides - Math.PI / 2
    const x = 50 + 50 * Math.cos(angle)
    const y = 50 + 50 * Math.sin(angle)
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <polygon points={points} fill={color} opacity="0.15" />
    </svg>
  )
}

interface FooterAnimationProps {
  polygons: Polygon[]
  isInView: boolean
}

export function FooterAnimation({ polygons, isInView }: FooterAnimationProps) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {polygons.map((polygon) => (
        <motion.div
          key={polygon.id}
          initial={{
            opacity: 0,
            x: `${polygon.x}%`,
            y: `${polygon.y}%`,
            rotate: polygon.rotation,
            scale: 0.5,
          }}
          animate={
            isInView
              ? {
                  opacity: [0, 0.8, 0.8],
                  x: `${polygon.x + (Math.random() - 0.5) * 20}%`,
                  y: `${polygon.y + (Math.random() - 0.5) * 20}%`,
                  rotate: polygon.rotation + 360,
                  scale: [0.5, 1, 0.8, 1],
                }
              : {
                  opacity: 0,
                  scale: 0.3,
                }
          }
          transition={{
            duration: polygon.duration,
            delay: polygon.delay,
            repeat: isInView ? Infinity : 0,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
          }}
        >
          <PolygonShape sides={polygon.sides} size={polygon.size} color={polygon.color} />
        </motion.div>
      ))}
    </div>
  )
}

