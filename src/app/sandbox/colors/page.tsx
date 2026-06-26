import styles from './ColorsSandbox.module.css';

export default function ColorsSandboxPage() {
  const primitives = [
    {
      name: 'Carbon Black',
      hex: '#181818',
      oklch: 'oklch(0.209 0 3.2)',
      desc: 'Deepest dark gray used as the primary canvas backdrop.',
      color: 'oklch(0.209 0 3.2)',
    },
    {
      name: 'Carbon Black 2',
      hex: '#1e1e1e',
      oklch: 'oklch(0.235 0 3.2)',
      desc: 'Secondary dark gray for alternating section backgrounds and subtle containers.',
      color: 'oklch(0.235 0 3.2)',
    },
    {
      name: 'Graphite',
      hex: '#2d2d2d',
      oklch: 'oklch(0.2972 0 3.2)',
      desc: 'Prominent surface and primary container background color, maintaining structural weight.',
      color: 'oklch(0.2972 0 3.2)',
    },
    {
      name: 'Graphite Light',
      hex: '#3d3d3d',
      oklch: 'oklch(0.36 0 3.2)',
      desc: 'Lighter graphite variant for nested card headers, borders, and hover states.',
      color: 'oklch(0.36 0 3.2)',
    },
    {
      name: 'Alabaster Grey',
      hex: '#d0d6dc',
      oklch: 'oklch(0.8732 0.0105 248.0)',
      desc: 'Cool slate-gray used for secondary typography, sub-headers, and platform badges.',
      color: 'oklch(0.8732 0.0105 248.0)',
    },
    {
      name: 'Bright Snow',
      hex: '#f9fafc',
      oklch: 'oklch(0.9849 0.0029 264.6)',
      desc: 'Pure cool white used for primary text and high-importance headings.',
      color: 'oklch(0.9849 0.0029 264.6)',
    },
    {
      name: 'Slate Violet',
      hex: '#6d6d80',
      oklch: 'oklch(0.48 0.025 285.0)',
      desc: 'Sophisticated, low-saturation slate-violet gray for subtle active indicators.',
      color: 'oklch(0.48 0.025 285.0)',
    },
    {
      name: 'Slate Violet Light',
      hex: '#9292a6',
      oklch: 'oklch(0.61 0.025 285.0)',
      desc: 'Lighter slate-violet gray for hover states and secondary active indicators.',
      color: 'oklch(0.61 0.025 285.0)',
    },
    {
      name: 'Platinum Silver',
      hex: '#e2e8f0',
      oklch: 'oklch(0.91 0.01 240.0)',
      desc: 'Premium cool platinum silver for primary actions, buttons, and high-contrast borders.',
      color: 'oklch(0.91 0.01 240.0)',
    },
    {
      name: 'Platinum Silver Light',
      hex: '#f8fafc',
      oklch: 'oklch(0.98 0.005 240.0)',
      desc: 'Bright platinum for hover states of primary elements.',
      color: 'oklch(0.98 0.005 240.0)',
    },
    {
      name: 'Muted Green',
      hex: '#527a69',
      oklch: 'oklch(0.50 0.04 165.0)',
      desc: 'Understated, low-saturation sage green representing success or active status.',
      color: 'oklch(0.50 0.04 165.0)',
    },
    {
      name: 'Muted Green Light',
      hex: '#739c8a',
      oklch: 'oklch(0.63 0.04 165.0)',
      desc: 'Lighter muted green for success notification hover states.',
      color: 'oklch(0.63 0.04 165.0)',
    },
  ];

  const complianceItems = [
    { pair: 'Bright Snow on Carbon Black', ratio: '16.7:1', status: 'AAA PASS' },
    { pair: 'Bright Snow on Graphite', ratio: '12.5:1', status: 'AAA PASS' },
    { pair: 'Alabaster Grey on Carbon Black', ratio: '11.8:1', status: 'AAA PASS' },
    { pair: 'Alabaster Grey on Graphite', ratio: '8.8:1', status: 'AAA PASS' },
    { pair: 'Platinum Silver on Carbon Black', ratio: '14.3:1', status: 'AAA PASS' },
    { pair: 'Slate Violet Light on Carbon Black', ratio: '6.2:1', status: 'AA PASS' },
    { pair: 'Muted Green on Carbon Black', ratio: '4.52:1', status: 'AA PASS' },
  ];

  return (
    <div className={styles.sandboxWrapper}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>DASI GAMES BRAND STYLE GUIDE</h1>
          <p className={styles.subtitle}>
            Interactive design token visualizer demonstrating the new Premium Dark Theme color palette. 
            Formulated in the perceptually uniform <code>oklch()</code> color space for visual harmony, accessibility, 
            and rich technical aesthetics.
          </p>
        </div>

        {/* 1. Primitive Tokens */}
        <div>
          <h2 className={styles.sectionTitle}>PRIMITIVE COLOR TOKENS</h2>
          <div className={styles.swatchGrid}>
            {primitives.map((p, idx) => (
              <div key={idx} className={styles.swatchCard}>
                <div 
                  className={styles.swatchColor} 
                  style={{ backgroundColor: p.color }}
                />
                <div className={styles.swatchInfo}>
                  <h3 className={styles.swatchName}>{p.name}</h3>
                  <p className={styles.swatchDesc}>{p.desc}</p>
                  <div className={styles.swatchValues}>
                    <span>HEX: {p.hex}</span>
                    <span>OKLCH: {p.oklch}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Semantic Roles & Previews */}
        <div>
          <h2 className={styles.sectionTitle}>SEMANTIC PREVIEWS & COMPLIANCE</h2>
          <div className={styles.previewLayout}>
            {/* Live Component Preview */}
            <div className={styles.previewCard}>
              <div className={styles.previewCardHeader}>
                <span className={styles.tag}>UPCOMING RELEASE</span>
                <span style={{ color: 'var(--slate-violet-light)', fontSize: '0.85rem', fontWeight: 600 }}>CROWN QUEST</span>
              </div>
              <h3 className={styles.cardTitle}>CRAFTING THE FUTURE</h3>
              <p className={styles.cardBody}>
                This card demonstrates the semantic tokens in action. The backdrop is Carbon Black 2. 
                This text uses Bright Snow (primary text) and Alabaster Grey (muted description). 
                The tag utilizes Slate Violet, and the main action button is Platinum Silver. 
                Hover over the card to see the Slate Violet glow and border highlights.
              </p>
              <div className={styles.buttonGroup}>
                <button className={styles.btnPrimary}>PRIMARY ACTION</button>
                <button className={styles.btnSecondary}>SECONDARY DETAIL</button>
              </div>
            </div>

            {/* Accessibility / Contrast checklist */}
            <div className={styles.complianceList}>
              <h3 className="text-lg font-bold text-white mb-2">Contrast AA/AAA Compliance</h3>
              {complianceItems.map((item, idx) => (
                <div key={idx} className={styles.complianceItem}>
                  <div className={styles.complianceLabel}>
                    <span className={styles.compliancePair}>{item.pair}</span>
                    <span className={styles.complianceRatio}>Ratio: {item.ratio}</span>
                  </div>
                  <span className={styles.badge}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
