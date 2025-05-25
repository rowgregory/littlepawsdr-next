import React, { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'

interface Confetti3DProps {
  trigger?: boolean
  duration?: number
}

interface ConfettiUserData {
  velocity: {
    x: number
    y: number
    z: number
  }
  rotationSpeed: {
    x: number
    y: number
    z: number
  }
  gravity: number
  life: number
  fadeSpeed: number
}

export const Confetti3D: React.FC<Confetti3DProps> = ({ trigger = false, duration = 3000 }) => {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const animationIdRef = useRef<number | null>(null)
  const confettiPiecesRef = useRef<THREE.Mesh[]>([])
  const [isActive, setIsActive] = useState<boolean>(false)

  useEffect(() => {
    const mountElement = mountRef.current // Capture the ref value
    if (!mountElement) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    mountElement.appendChild(renderer.domElement)

    sceneRef.current = scene
    rendererRef.current = renderer
    camera.position.set(0, 0, 5)

    // Animation loop
    const animate = (): void => {
      animationIdRef.current = requestAnimationFrame(animate)

      // Update confetti pieces
      confettiPiecesRef.current.forEach((piece, index) => {
        const userData = piece.userData as ConfettiUserData
        if (!userData) return

        // Apply physics
        userData.velocity.y += userData.gravity

        // Update position
        piece.position.x += userData.velocity.x
        piece.position.y += userData.velocity.y
        piece.position.z += userData.velocity.z

        // Update rotation
        piece.rotation.x += userData.rotationSpeed.x
        piece.rotation.y += userData.rotationSpeed.y
        piece.rotation.z += userData.rotationSpeed.z

        // Add some air resistance and wobble
        userData.velocity.x *= 0.998
        userData.velocity.z *= 0.998
        piece.position.x += Math.sin(Date.now() * 0.001 + index) * 0.002

        // Fade out over time
        userData.life -= userData.fadeSpeed
        const material = piece.material as THREE.MeshBasicMaterial
        material.opacity = Math.max(0, userData.life)

        // Remove when off screen or faded
        if (piece.position.y < -8 || userData.life <= 0) {
          scene.remove(piece)
          confettiPiecesRef.current.splice(index, 1)
        }
      })

      renderer.render(scene, camera)
    }

    // Handle window resize
    const handleResize = (): void => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)
    animate()

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize)

      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }

      // Clean up confetti pieces
      confettiPiecesRef.current.forEach((piece) => {
        if (scene) scene.remove(piece)
        piece.geometry.dispose()
        ;(piece.material as THREE.Material).dispose()
      })
      confettiPiecesRef.current = []

      if (mountElement && renderer.domElement && mountElement.contains(renderer.domElement)) {
        mountElement.removeChild(renderer.domElement)
      }

      renderer.dispose()
    }
  }, []) // Empty dependency array - setup only once

  // Separate effect for triggering confetti
  useEffect(() => {
    if (trigger && !isActive && sceneRef.current) {
      setIsActive(true)

      // Create initial burst
      const newConfetti = createConfetti(150)
      confettiPiecesRef.current.push(...newConfetti)

      // Add extra bursts with delays
      const timeout1 = setTimeout(() => {
        const burst1 = createConfetti(100)
        confettiPiecesRef.current.push(...burst1)
      }, 200)

      const timeout2 = setTimeout(() => {
        const burst2 = createConfetti(80)
        confettiPiecesRef.current.push(...burst2)
      }, 400)

      // Reset after duration
      const resetTimeout = setTimeout(() => {
        setIsActive(false)
      }, duration)

      // Cleanup timeouts
      return () => {
        clearTimeout(timeout1)
        clearTimeout(timeout2)
        clearTimeout(resetTimeout)
      }
    }
  }, [trigger, isActive, duration])

  // Helper function to create confetti (moved outside useEffect for reuse)
  const createConfetti = (count: number = 100): THREE.Mesh[] => {
    if (!sceneRef.current) return []

    const scene = sceneRef.current
    const colors: number[] = [
      0xff0080, 0x00ff80, 0x8000ff, 0xff8000, 0x0080ff, 0xff0040, 0x40ff00, 0x8040ff, 0xff4080, 0x80ff40, 0x4080ff, 0xff8040
    ]

    const confettiPieces: THREE.Mesh[] = []

    for (let i = 0; i < count; i++) {
      const geometry = new THREE.PlaneGeometry(0.15, 0.08)
      const material = new THREE.MeshBasicMaterial({
        color: colors[Math.floor(Math.random() * colors.length)],
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 1.0
      })

      const confetti = new THREE.Mesh(geometry, material)

      // Random initial position
      confetti.position.x = (Math.random() - 0.5) * 12
      confetti.position.y = 6 + Math.random() * 3
      confetti.position.z = (Math.random() - 0.5) * 4

      // Random rotation
      confetti.rotation.x = Math.random() * Math.PI * 2
      confetti.rotation.y = Math.random() * Math.PI * 2
      confetti.rotation.z = Math.random() * Math.PI * 2

      // Physics properties
      const userData: ConfettiUserData = {
        velocity: {
          x: (Math.random() - 0.5) * 0.04,
          y: -0.03 - Math.random() * 0.02,
          z: (Math.random() - 0.5) * 0.03
        },
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.2,
          y: (Math.random() - 0.5) * 0.2,
          z: (Math.random() - 0.5) * 0.2
        },
        gravity: -0.0012,
        life: 1.0,
        fadeSpeed: 0.005
      }

      confetti.userData = userData
      scene.add(confetti)
      confettiPieces.push(confetti)
    }

    return confettiPieces
  }

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999
      }}
    />
  )
}
