import { useEffect, useState, useRef } from 'react'
import { uploadFile, deleteFile } from '../firebase/storage'
import {
  getGalleryPhotos, addGalleryPhoto, deleteGalleryPhoto, nextGalleryStoragePath,
  getQuotes, addQuote, deleteQuote,
} from '../firebase/gallery'
import styles from './GalleryAdmin.module.css'

// ─── Add Photo Form ────────────────────────────────────────────────────────
function AddPhotoForm({ onSaved, onCancel }) {
  const [file, setFile]       = useState(null)
  const [preview, setPreview] = useState(null)
  const [caption, setCaption] = useState('')
  const [progress, setProgress] = useState(0)
  const [saving, setSaving]   = useState(false)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  const pickFile = f => {
    setFile(f)
    const reader = new FileReader()
    reader.onload = e => setPreview(e.target.result)
    reader.readAsDataURL(f)
  }

  const handleDrop = e => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) pickFile(f)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!file) return
    setSaving(true)
    try {
      const path = await nextGalleryStoragePath(file.name)
      const url  = await uploadFile(path, file, p => setProgress(p))
      await addGalleryPhoto({ url, caption: caption.trim() || '', storagePath: path })
      onSaved()
    } catch (err) {
      console.error('Upload failed:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h3 className={styles.formTitle}>ADD PHOTO</h3>

      <div
        className={`${styles.dropzone} ${dragging ? styles.dragging : ''}`}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        {preview
          ? <img src={preview} alt="preview" className={styles.dropPreview} />
          : <span>Drag & drop photo here or <u>click to browse</u></span>
        }
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className={styles.hidden}
          onChange={e => e.target.files[0] && pickFile(e.target.files[0])}
        />
      </div>

      {saving && (
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress * 100}%` }} />
        </div>
      )}

      <div className={styles.field}>
        <label className={styles.fieldLabel}>Caption (optional)</label>
        <input
          type="text"
          value={caption}
          onChange={e => setCaption(e.target.value)}
          placeholder="e.g. Regional Championship 2024"
          className={styles.input}
        />
      </div>

      <div className={styles.formActions}>
        <button type="button" className={styles.cancelBtn} onClick={onCancel}>CANCEL</button>
        <button type="submit" className={styles.saveBtn} disabled={!file || saving}>
          {saving ? `UPLOADING ${Math.round(progress * 100)}%` : 'SAVE PHOTO'}
        </button>
      </div>
    </form>
  )
}

// ─── Add Quote Form ────────────────────────────────────────────────────────
function AddQuoteForm({ onSaved, onCancel }) {
  const [quote, setQuote]           = useState('')
  const [attribution, setAttribution] = useState('')
  const [saving, setSaving]         = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    if (!quote.trim()) return
    setSaving(true)
    try {
      await addQuote({ quote: quote.trim(), attribution: attribution.trim() })
      onSaved()
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h3 className={styles.formTitle}>ADD QUOTE</h3>

      <div className={styles.field}>
        <label className={styles.fieldLabel}>Quote</label>
        <textarea
          value={quote}
          onChange={e => setQuote(e.target.value)}
          placeholder="The kart doesn't lie — only the stopwatch tells the truth."
          rows={4}
          className={styles.input}
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.fieldLabel}>Author</label>
        <input
          type="text"
          value={attribution}
          onChange={e => setAttribution(e.target.value)}
          placeholder="Yusuf Usmanov"
          className={styles.input}
        />
      </div>

      <div className={styles.formActions}>
        <button type="button" className={styles.cancelBtn} onClick={onCancel}>CANCEL</button>
        <button type="submit" className={styles.saveBtn} disabled={!quote.trim() || saving}>
          {saving ? 'SAVING...' : 'SAVE QUOTE'}
        </button>
      </div>
    </form>
  )
}

// ─── Main GalleryAdmin ─────────────────────────────────────────────────────
export default function GalleryAdmin() {
  const [photos, setPhotos]       = useState([])
  const [quotes, setQuotes]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [mode, setMode]           = useState(null) // null | 'photo' | 'quote'
  const [confirmDel, setConfirmDel] = useState(null) // { type, item }

  const load = () => {
    setLoading(true)
    Promise.all([getGalleryPhotos(), getQuotes()])
      .then(([p, q]) => { setPhotos(p); setQuotes(q) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async () => {
    const { type, item } = confirmDel
    try {
      if (type === 'photo') {
        if (item.storagePath) await deleteFile(item.storagePath)
        await deleteGalleryPhoto(item.id)
      } else {
        await deleteQuote(item.id)
      }
    } catch (err) {
      console.error(err)
    }
    setConfirmDel(null)
    load()
  }

  if (mode === 'photo') {
    return <AddPhotoForm onSaved={() => { setMode(null); load() }} onCancel={() => setMode(null)} />
  }
  if (mode === 'quote') {
    return <AddQuoteForm onSaved={() => { setMode(null); load() }} onCancel={() => setMode(null)} />
  }

  return (
    <div className={styles.wrap}>
      {/* Action buttons */}
      <div className={styles.toolbar}>
        <button className={styles.addBtn} onClick={() => setMode('photo')}>+ ADD PHOTO</button>
        <button className={styles.addBtnOutline} onClick={() => setMode('quote')}>+ ADD QUOTE</button>
      </div>

      {loading ? (
        <p className={styles.empty}>Loading...</p>
      ) : (
        <>
          {/* Photos grid */}
          <div className={styles.sectionLabel}>
            PHOTOS
            <span className={styles.count}>{photos.length}</span>
          </div>
          {photos.length === 0 ? (
            <p className={styles.empty}>No photos yet.</p>
          ) : (
            <div className={styles.grid}>
              {photos.map(item => (
                <div key={item.id} className={styles.thumb}>
                  <img src={item.url} alt={item.caption} loading="lazy" />
                  <div className={styles.thumbOverlay}>
                    <span className={styles.thumbCaption}>{item.caption || '—'}</span>
                    <button className={styles.delBtn} onClick={() => setConfirmDel({ type: 'photo', item })}>×</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quotes list */}
          <div className={styles.sectionLabel} style={{ marginTop: 32 }}>
            QUOTES
            <span className={styles.count}>{quotes.length}</span>
          </div>
          {quotes.length === 0 ? (
            <p className={styles.empty}>No quotes yet.</p>
          ) : (
            <div className={styles.quoteList}>
              {quotes.map(item => (
                <div key={item.id} className={styles.quoteRow}>
                  <div className={styles.quoteBody}>
                    <p className={styles.quoteText}>"{item.quote}"</p>
                    <p className={styles.quoteAttr}>— {item.attribution}</p>
                  </div>
                  <button className={styles.delBtnInline} onClick={() => setConfirmDel({ type: 'quote', item })}>×</button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Confirm delete modal */}
      {confirmDel && (
        <div className={styles.modal}>
          <div className={styles.modalBox}>
            <p>Delete this {confirmDel.type}? This cannot be undone.</p>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setConfirmDel(null)}>Cancel</button>
              <button className={styles.confirmBtn} onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
