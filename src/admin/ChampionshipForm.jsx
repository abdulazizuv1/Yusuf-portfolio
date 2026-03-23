import { useState } from 'react'
import { uploadFile } from '../firebase/storage'
import { addChampionship, updateChampionship } from '../firebase/championships'
import PhotoUploader from './PhotoUploader'
import styles from './ChampionshipForm.module.css'

const EMPTY = {
  name: '', year: new Date().getFullYear(), date: '',
  track: '', position: 1, bestLapTime: '', totalLaps: '', description: '',
}

export default function ChampionshipForm({ initial, champId, onSaved, onCancel }) {
  const [form, setForm]     = useState(initial || EMPTY)
  const [coverFile, setCoverFile]   = useState(null)
  const [photoFiles, setPhotoFiles] = useState([])
  const [saving, setSaving] = useState(false)
  const [toast, setToast]   = useState('')

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    try {
      const id = champId || Date.now().toString()
      let coverPhoto = form.coverPhoto || ''
      let photos = form.photos || []

      if (coverFile) {
        coverPhoto = await uploadFile(`championships/${id}/cover.jpg`, coverFile)
      }
      if (photoFiles.length > 0) {
        const uploads = photoFiles.map((f, i) =>
          uploadFile(`championships/${id}/photos/${i}_${f.name}`, f)
        )
        const newUrls = await Promise.all(uploads)
        photos = [...photos, ...newUrls]
      }

      const data = { ...form, year: Number(form.year), position: Number(form.position), totalLaps: Number(form.totalLaps), coverPhoto, photos }

      if (champId) {
        await updateChampionship(champId, data)
      } else {
        await addChampionship(data)
      }

      setToast('Championship saved! 🏁')
      setTimeout(() => { setToast(''); onSaved?.() }, 1500)
    } catch (err) {
      console.error(err)
      setToast('Error saving. Check console.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2 className={styles.title}>{champId ? 'EDIT' : 'ADD'} CHAMPIONSHIP</h2>

      {toast && <div className={styles.toast}>{toast}</div>}

      <div className={styles.row}>
        <Field label="Championship Name" name="name"    value={form.name}        onChange={handle} required />
        <Field label="Year"              name="year"    value={form.year}        onChange={handle} type="number" required />
      </div>
      <div className={styles.row}>
        <Field label="Race Date"  name="date"     value={form.date}     onChange={handle} type="date" />
        <Field label="Track Name" name="track"    value={form.track}    onChange={handle} required />
      </div>
      <div className={styles.row}>
        <Field label="Final Position" name="position"    value={form.position}    onChange={handle} type="number" min={1} max={20} required />
        <Field label="Best Lap Time"  name="bestLapTime" value={form.bestLapTime} onChange={handle} placeholder="1:23.456" required />
      </div>
      <div className={styles.row}>
        <Field label="Total Laps" name="totalLaps" value={form.totalLaps} onChange={handle} type="number" />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Description</label>
        <textarea name="description" rows={4} value={form.description} onChange={handle} className={styles.input} />
      </div>

      <PhotoUploader label="Cover Photo" multiple={false} onUploaded={files => setCoverFile(files[0])} />
      <PhotoUploader label="Race Photos" multiple onUploaded={files => setPhotoFiles(prev => [...prev, ...files])} />

      <div className={styles.actions}>
        <button type="button" className={styles.cancelBtn} onClick={onCancel}>CANCEL</button>
        <button type="submit" className={styles.saveBtn} disabled={saving}>
          {saving ? 'SAVING...' : 'SAVE CHAMPIONSHIP'}
        </button>
      </div>
    </form>
  )
}

function Field({ label, name, value, onChange, type = 'text', required, placeholder, min, max }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        min={min}
        max={max}
        className={styles.input}
      />
    </div>
  )
}
