import { useRef, useState } from 'react'
import styles from './PhotoUploader.module.css'

export default function PhotoUploader({ label = 'Photos', multiple = true, onUploaded }) {
  const [files, setFiles]       = useState([])
  const [previews, setPreviews] = useState([])
  const [progress, setProgress] = useState({})
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const processFiles = newFiles => {
    const arr = Array.from(newFiles)
    setFiles(prev => [...prev, ...arr])
    arr.forEach(f => {
      const reader = new FileReader()
      reader.onload = e => setPreviews(prev => [...prev, { name: f.name, url: e.target.result, file: f }])
      reader.readAsDataURL(f)
    })
    if (onUploaded) onUploaded(arr)
  }

  const handleDrop = e => {
    e.preventDefault()
    setDragging(false)
    processFiles(e.dataTransfer.files)
  }

  const handleRemove = name => {
    setPreviews(prev => prev.filter(p => p.name !== name))
    setFiles(prev => prev.filter(f => f.name !== name))
  }

  return (
    <div className={styles.wrap}>
      <p className={styles.label}>{label}</p>
      <div
        className={`${styles.dropzone} ${dragging ? styles.dragging : ''}`}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <span>Drag & drop files here or <u>click to browse</u></span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          className={styles.hidden}
          onChange={e => processFiles(e.target.files)}
        />
      </div>

      {previews.length > 0 && (
        <div className={styles.previews}>
          {previews.map(p => (
            <div key={p.name} className={styles.thumb}>
              <img src={p.url} alt={p.name} />
              {progress[p.name] !== undefined && progress[p.name] < 1 && (
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${progress[p.name] * 100}%` }} />
                </div>
              )}
              <button className={styles.remove} onClick={e => { e.stopPropagation(); handleRemove(p.name) }}>×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
