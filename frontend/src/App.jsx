import { useState, useRef } from "react"
import axios from "axios"

const PAGE = { HOME: "home", CLASSIFY: "classify" }

export default function App() {
  const [page, setPage] = useState(PAGE.HOME)
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef()

  const handleFile = (file) => {
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
    setResult(null)
    setError(null)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  const handlePredict = async () => {
    if (!image) return
    setLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append("file", image)
      const res = await axios.post("http://localhost:8000/api/predict", formData)
      setResult(res.data)
    } catch {
      setError("Prediction failed! Make sure backend is running.")
    }
    setLoading(false)
  }

  const sorted = result
    ? Object.entries(result.all_predictions).sort((a, b) => b[1] - a[1])
    : []

  const classEmojis = {
    daisy: "🌼", dandelion: "🌱", rose: "🌹",
    sunflower: "🌻", tulip: "🌷", male: "👨", female: "👩"
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

        :root {
          --navy: #0d1117;
          --navy2: #161b22;
          --border: rgba(255,255,255,0.08);
          --blue: #4f8ef7;
          --blue2: #1f6feb;
          --text: #e6edf3;
          --muted: #8b949e;
          --accent: #58a6ff;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: var(--navy); font-family: 'Sora', sans-serif; color: var(--text); min-height: 100vh; overflow-x: hidden; }

        .grid-bg {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image: linear-gradient(rgba(79,142,247,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(79,142,247,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .glow-top {
          position: fixed; top: -200px; left: 50%; transform: translateX(-50%);
          width: 800px; height: 400px;
          background: radial-gradient(ellipse, rgba(31,111,235,0.15) 0%, transparent 70%);
          pointer-events: none; z-index: 0;
        }

        nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 40px; height: 64px;
          background: rgba(13,17,23,0.85); backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
        }
        .nav-logo { display: flex; align-items: center; gap: 10px; font-weight: 700; font-size: 17px; cursor: pointer; }
        .nav-logo-icon { width: 32px; height: 32px; border-radius: 8px; background: linear-gradient(135deg, var(--blue2), var(--accent)); display: flex; align-items: center; justify-content: center; font-size: 16px; }
        .nav-links { display: flex; align-items: center; gap: 8px; }
        .nav-btn { padding: 8px 18px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; font-family: 'Sora', sans-serif; transition: all 0.2s; }
        .nav-ghost { background: transparent; border: 1px solid var(--border); color: var(--text); }
        .nav-ghost:hover { border-color: var(--accent); color: var(--accent); }
        .nav-primary { background: var(--blue2); border: 1px solid var(--blue); color: white; }
        .nav-primary:hover { background: var(--accent); }

        .home { position: relative; z-index: 1; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 100px 24px 60px; }

        .badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(31,111,235,0.1); border: 1px solid rgba(31,111,235,0.3); color: var(--accent); padding: 6px 16px; border-radius: 100px; font-size: 12px; font-weight: 500; letter-spacing: 1px; margin-bottom: 32px; animation: fadeDown 0.6s ease; }
        .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

        .hero-title { font-size: clamp(3rem, 7vw, 5.5rem); font-weight: 800; line-height: 1.05; letter-spacing: -2px; margin-bottom: 8px; animation: fadeDown 0.7s ease 0.1s both; }
        .hero-accent { background: linear-gradient(135deg, var(--accent), #79c0ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; display: block; }
        .hero-sub { color: var(--muted); font-size: 16px; max-width: 500px; line-height: 1.7; margin: 24px auto 48px; animation: fadeDown 0.7s ease 0.2s both; }

        .hero-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; animation: fadeDown 0.7s ease 0.3s both; margin-bottom: 64px; }
        .btn-primary { padding: 14px 32px; border-radius: 10px; background: var(--blue2); border: 1px solid var(--blue); color: white; font-size: 15px; font-weight: 600; font-family: 'Sora', sans-serif; cursor: pointer; transition: all 0.2s; }
        .btn-primary:hover { background: var(--accent); box-shadow: 0 0 30px rgba(88,166,255,0.3); transform: translateY(-2px); }
        .btn-ghost { padding: 14px 32px; border-radius: 10px; background: transparent; border: 1px solid var(--border); color: var(--text); font-size: 15px; font-weight: 500; font-family: 'Sora', sans-serif; cursor: pointer; transition: all 0.2s; }
        .btn-ghost:hover { border-color: var(--muted); }

        .stats-row { display: flex; border: 1px solid var(--border); border-radius: 16px; overflow: hidden; max-width: 560px; width: 100%; animation: fadeDown 0.7s ease 0.4s both; }
        .stat-box { flex: 1; padding: 22px; text-align: center; border-right: 1px solid var(--border); }
        .stat-box:last-child { border-right: none; }
        .stat-num { font-size: 1.8rem; font-weight: 800; color: var(--accent); font-family: 'JetBrains Mono', monospace; }
        .stat-lbl { font-size: 11px; color: var(--muted); margin-top: 4px; text-transform: uppercase; letter-spacing: 1px; }

        .features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; max-width: 860px; width: 100%; margin-top: 64px; animation: fadeDown 0.7s ease 0.5s both; }
        @media(max-width:600px) { .features { grid-template-columns: 1fr; } }
        .feat-card { background: var(--navy2); border: 1px solid var(--border); border-radius: 14px; padding: 22px; text-align: left; transition: border-color 0.2s; }
        .feat-card:hover { border-color: rgba(88,166,255,0.3); }
        .feat-icon { font-size: 26px; margin-bottom: 12px; }
        .feat-title { font-size: 14px; font-weight: 600; margin-bottom: 6px; }
        .feat-desc { font-size: 13px; color: var(--muted); line-height: 1.5; }

        @keyframes fadeDown { from{opacity:0;transform:translateY(-16px)} to{opacity:1;transform:translateY(0)} }

        .classify-page { position: relative; z-index: 1; min-height: 100vh; padding: 96px 40px 60px; max-width: 1100px; margin: 0 auto; }
        .classify-header { margin-bottom: 36px; }
        .classify-title { font-size: 2.2rem; font-weight: 800; letter-spacing: -1px; margin-bottom: 8px; }
        .classify-title span { color: var(--accent); }
        .classify-sub { color: var(--muted); font-size: 15px; }

        .classify-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        @media(max-width:768px) { .classify-grid { grid-template-columns: 1fr; } }

        .panel { background: var(--navy2); border: 1px solid var(--border); border-radius: 16px; padding: 26px; }
        .panel-label { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: var(--muted); margin-bottom: 18px; }

        .upload-zone { border: 1.5px dashed var(--border); border-radius: 12px; cursor: pointer; transition: all 0.2s; min-height: 250px; display: flex; align-items: center; justify-content: center; margin-bottom: 14px; overflow: hidden; }
        .upload-zone:hover, .upload-zone.drag { border-color: var(--accent); background: rgba(88,166,255,0.03); }
        .upload-ph { text-align: center; padding: 28px; }
        .upload-ico { font-size: 36px; margin-bottom: 10px; }
        .upload-txt { font-size: 14px; color: var(--muted); margin-bottom: 4px; }
        .upload-sub { font-size: 12px; color: rgba(139,148,158,0.4); }
        .preview-img { width: 100%; height: 250px; object-fit: cover; }

        .submit-btn { width: 100%; padding: 13px; background: var(--blue2); border: 1px solid var(--blue); color: white; border-radius: 10px; font-size: 14px; font-weight: 600; font-family: 'Sora', sans-serif; cursor: pointer; transition: all 0.2s; }
        .submit-btn:hover:not(:disabled) { background: var(--accent); box-shadow: 0 0 20px rgba(88,166,255,0.2); }
        .submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        .spinner { display: inline-block; width: 13px; height: 13px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; margin-right: 8px; vertical-align: middle; }
        @keyframes spin { to{transform:rotate(360deg)} }

        .err { background: rgba(248,81,73,0.08); border: 1px solid rgba(248,81,73,0.3); color: #f85149; padding: 12px 16px; border-radius: 8px; font-size: 13px; margin-top: 12px; }

        .res-empty { height: 100%; min-height: 340px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: rgba(139,148,158,0.25); text-align: center; }
        .res-empty-ico { font-size: 44px; margin-bottom: 10px; }
        .res-empty-txt { font-size: 13px; }

        .res-content { animation: fadeIn 0.4s ease; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }

        .res-top { display: flex; align-items: center; gap: 14px; padding: 18px; border-radius: 12px; background: rgba(31,111,235,0.08); border: 1px solid rgba(31,111,235,0.2); margin-bottom: 22px; }
        .res-emoji { font-size: 2.5rem; }
        .res-lbl { font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: var(--muted); }
        .res-cls { font-size: 1.8rem; font-weight: 800; text-transform: capitalize; color: var(--accent); letter-spacing: -0.5px; }
        .res-badge { margin-left: auto; background: rgba(88,166,255,0.1); border: 1px solid rgba(88,166,255,0.2); padding: 8px 14px; border-radius: 8px; text-align: center; }
        .res-pct { font-family: 'JetBrains Mono', monospace; font-size: 1.4rem; font-weight: 700; color: var(--accent); }
        .res-pct-lbl { font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; }

        .bars-lbl { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: var(--muted); margin-bottom: 12px; }
        .bar-row { margin-bottom: 10px; }
        .bar-meta { display: flex; justify-content: space-between; margin-bottom: 5px; }
        .bar-name { font-size: 13px; color: var(--text); text-transform: capitalize; }
        .bar-pct { font-size: 12px; color: var(--muted); font-family: 'JetBrains Mono', monospace; }
        .bar-track { height: 4px; background: rgba(255,255,255,0.05); border-radius: 4px; overflow: hidden; }
        .bar-fill { height: 100%; border-radius: 4px; transition: width 0.8s cubic-bezier(0.16,1,0.3,1); }
        .bar-on { background: linear-gradient(90deg, var(--blue2), var(--accent)); }
        .bar-off { background: rgba(255,255,255,0.07); }

        footer { position: relative; z-index: 1; text-align: center; padding: 28px; color: var(--muted); font-size: 12px; border-top: 1px solid var(--border); }
      `}</style>

      <div className="grid-bg" />
      <div className="glow-top" />

      <nav>
        <div className="nav-logo" onClick={() => setPage(PAGE.HOME)}>
          <div className="nav-logo-icon">🌸</div>
          VisionAI
        </div>
        <div className="nav-links">
          <button className="nav-btn nav-ghost" onClick={() => setPage(PAGE.HOME)}>Home</button>
          <button className="nav-btn nav-primary" onClick={() => setPage(PAGE.CLASSIFY)}>Try Classifier →</button>
        </div>
      </nav>

      {page === PAGE.HOME && (
        <div className="home">
          <div className="badge"><div className="badge-dot" />GLS University AML Project 2025–26</div>
          <h1 className="hero-title">
            AI-Powered
            <span className="hero-accent">Image Classifier</span>
          </h1>
          <p className="hero-sub">VGG16 transfer learning for real-time image classification across 7 categories with 85%+ accuracy.</p>
          <div className="hero-btns">
            <button className="btn-primary" onClick={() => setPage(PAGE.CLASSIFY)}>Launch Classifier →</button>
            <button className="btn-ghost">View on GitHub</button>
          </div>
          <div className="stats-row">
            <div className="stat-box"><div className="stat-num">7</div><div className="stat-lbl">Classes</div></div>
            <div className="stat-box"><div className="stat-num">85%</div><div className="stat-lbl">Accuracy</div></div>
            <div className="stat-box"><div className="stat-num">6K+</div><div className="stat-lbl">Images</div></div>
            <div className="stat-box"><div className="stat-num">VGG16</div><div className="stat-lbl">Model</div></div>
          </div>
          <div className="features">
            <div className="feat-card"><div className="feat-icon">🧠</div><div className="feat-title">Transfer Learning</div><div className="feat-desc">VGG16 pretrained on ImageNet, fine-tuned for 7 custom classes</div></div>
            <div className="feat-card"><div className="feat-icon">⚡</div><div className="feat-title">FastAPI Backend</div><div className="feat-desc">High-performance REST API with real-time inference pipeline</div></div>
            <div className="feat-card"><div className="feat-icon">📊</div><div className="feat-title">Confidence Scores</div><div className="feat-desc">Detailed probability breakdown across all prediction classes</div></div>
          </div>
        </div>
      )}

      {page === PAGE.CLASSIFY && (
        <div className="classify-page">
          <div className="classify-header">
            <h2 className="classify-title">Image <span>Classification</span></h2>
            <p className="classify-sub">Upload an image to get instant AI-powered predictions</p>
          </div>
          <div className="classify-grid">
            <div className="panel">
              <div className="panel-label">Upload Image</div>
              <div
                className={`upload-zone ${dragging ? "drag" : ""}`}
                onClick={() => fileRef.current.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
              >
                {preview
                  ? <img src={preview} alt="preview" className="preview-img" />
                  : <div className="upload-ph"><div className="upload-ico">📁</div><div className="upload-txt">Drop image here or click to browse</div><div className="upload-sub">JPG, PNG, WEBP</div></div>
                }
                <input ref={fileRef} type="file" accept="image/*" onChange={(e) => handleFile(e.target.files[0])} style={{ display: "none" }} />
              </div>
              <button className="submit-btn" onClick={handlePredict} disabled={!image || loading}>
                {loading ? <><span className="spinner" />Analyzing...</> : "Classify Image →"}
              </button>
              {error && <div className="err">⚠ {error}</div>}
            </div>

            <div className="panel">
              <div className="panel-label">Prediction Results</div>
              {!result
                ? <div className="res-empty"><div className="res-empty-ico">🔬</div><div className="res-empty-txt">Results will appear here after classification</div></div>
                : <div className="res-content">
                    <div className="res-top">
                      <div className="res-emoji">{classEmojis[result.predicted_class] || "🔍"}</div>
                      <div><div className="res-lbl">Top Prediction</div><div className="res-cls">{result.predicted_class}</div></div>
                      <div className="res-badge"><div className="res-pct">{result.confidence}%</div><div className="res-pct-lbl">confidence</div></div>
                    </div>
                    <div className="bars-lbl">All class probabilities</div>
                    {sorted.map(([cls, prob]) => (
                      <div className="bar-row" key={cls}>
                        <div className="bar-meta">
                          <span className="bar-name">{classEmojis[cls] || "•"} {cls}</span>
                          <span className="bar-pct">{prob}%</span>
                        </div>
                        <div className="bar-track">
                          <div className={`bar-fill ${cls === result.predicted_class ? "bar-on" : "bar-off"}`} style={{ width: `${prob}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
              }
            </div>
          </div>
        </div>
      )}

      <footer>VisionAI — VGG16 Image Classifier · GLS University Project 2025–26</footer>
    </>
  )
}