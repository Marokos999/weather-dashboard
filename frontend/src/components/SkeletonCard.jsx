const shimmer = {
  background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite',
  borderRadius: '10px',
}

export default function SkeletonCard() {
  return (
    <>
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }`}</style>

      {/* Current weather skeleton */}
      <div style={{ background: 'rgba(37,99,235,0.1)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <div style={{ ...shimmer, height: '28px', width: '180px', marginBottom: '8px' }} />
            <div style={{ ...shimmer, height: '16px', width: '120px' }} />
          </div>
          <div style={{ ...shimmer, height: '32px', width: '60px' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ ...shimmer, width: '80px', height: '80px', borderRadius: '50%' }} />
          <div>
            <div style={{ ...shimmer, height: '68px', width: '140px', marginBottom: '8px' }} />
            <div style={{ ...shimmer, height: '16px', width: '100px' }} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ ...shimmer, height: '72px', borderRadius: '14px' }} />
          ))}
        </div>
      </div>

      {/* Hourly skeleton */}
      <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '24px' }}>
        <div style={{ ...shimmer, height: '12px', width: '120px', marginBottom: '16px' }} />
        <div style={{ display: 'flex', gap: '8px' }}>
          {[...Array(8)].map((_, i) => (
            <div key={i} style={{ ...shimmer, minWidth: '64px', height: '96px', borderRadius: '16px', flexShrink: 0 }} />
          ))}
        </div>
      </div>

      {/* Weekly skeleton */}
      <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '24px' }}>
        <div style={{ ...shimmer, height: '12px', width: '100px', marginBottom: '16px' }} />
        {[...Array(7)].map((_, i) => (
          <div key={i} style={{ ...shimmer, height: '40px', borderRadius: '10px', marginBottom: '4px' }} />
        ))}
      </div>
    </>
  )
}
