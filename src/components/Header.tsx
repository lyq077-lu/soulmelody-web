export function Header() {
  return (
    <header style={{ 
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      borderBottom: '1px solid rgba(57, 255, 20, 0.3)',
      padding: '16px 24px'
    }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* 音乐符号图标 */}
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #39ff14 0%, #00ff41 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(57, 255, 20, 0.5)'
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a1a2e" strokeWidth="2">
              <path d="M9 18V5l12-3v13" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="6" cy="18" r="3"/>
              <circle cx="18" cy="15" r="3"/>
            </svg>
          </div>
          
          <div>
            {/* 音灵AI - 荧光绿艺术字 */}
            <h1 style={{
              fontSize: '42px',
              fontWeight: '900',
              background: 'linear-gradient(135deg, #39ff14 0%, #00ff41 50%, #7fff00 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 30px rgba(57, 255, 20, 0.5), 0 0 60px rgba(57, 255, 20, 0.3)',
              letterSpacing: '4px',
              fontFamily: '"Arial Black", "Helvetica Neue", sans-serif',
              lineHeight: '1'
            }}>
              音灵AI
            </h1>
            <p style={{
              fontSize: '14px',
              color: '#39ff14',
              opacity: 0.8,
              marginTop: '4px',
              letterSpacing: '2px'
            }}>
              SoulMelody · AI歌曲生成平台
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
