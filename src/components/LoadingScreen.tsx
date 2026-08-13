import { useEffect, useState } from 'react'

interface Props {
  onDone: () => void
}

export default function LoadingScreen({ onDone }: Props) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400)
    const t2 = setTimeout(() => setPhase(2), 1000)
    const t3 = setTimeout(() => onDone(), 2000)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [onDone])

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{
        background: '#1C1916',
        transition: phase === 2 ? 'opacity 0.5s ease' : '',
        opacity: phase === 2 ? 0 : 1,
        pointerEvents: phase === 2 ? 'none' : 'all',
      }}
    >
      <div className="flex flex-col items-center gap-2">
        <div
          className="font-display text-5xl tracking-[0.15em]"
          style={{
            color: '#FAF8F5',
            opacity: phase >= 1 ? 1 : 0,
            transform: phase >= 1 ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          NAZ
        </div>
        <div
          style={{
            width: phase >= 1 ? 60 : 0,
            height: 1,
            background: '#C4A882',
            transition: 'width 0.6s ease 0.3s',
          }}
        />
        <div
          style={{
            color: '#C4A882',
            fontSize: 11,
            letterSpacing: '0.35em',
            fontWeight: 500,
            opacity: phase >= 1 ? 1 : 0,
            transform: phase >= 1 ? 'translateY(0)' : 'translateY(12px)',
            transition: 'opacity 0.7s ease 0.25s, transform 0.7s ease 0.25s',
          }}
        >
          COSMATICES
        </div>
      </div>
    </div>
  )
}
