import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signOut } from '../firebase/auth'
import { getChampionships, deleteChampionship } from '../firebase/championships'
import ChampionshipForm from './ChampionshipForm'
import GalleryAdmin from './GalleryAdmin'
import logo from '../assets/logo.png'
import styles from './AdminDashboard.module.css'

export default function AdminDashboard() {
  const [tab, setTab]                     = useState('championships') // championships | gallery
  const [championships, setChampionships] = useState([])
  const [loading, setLoading]             = useState(true)
  const [view, setView]                   = useState('list') // list | add | edit
  const [editing, setEditing]             = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const navigate = useNavigate()

  const loadData = () => {
    setLoading(true)
    getChampionships()
      .then(setChampionships)
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadData() }, [])

  const handleLogout = async () => {
    await signOut()
    navigate('/admin/login')
  }

  const handleDelete = async id => {
    await deleteChampionship(id)
    setConfirmDelete(null)
    loadData()
  }

  // Championship form views
  if (view === 'add') {
    return (
      <div className={styles.page}>
        <AdminHeader onLogout={handleLogout} tab={tab} onTabChange={t => { setTab(t); setView('list') }} />
        <div className={styles.formWrap}>
          <ChampionshipForm onSaved={() => { setView('list'); loadData() }} onCancel={() => setView('list')} />
        </div>
      </div>
    )
  }

  if (view === 'edit' && editing) {
    return (
      <div className={styles.page}>
        <AdminHeader onLogout={handleLogout} tab={tab} onTabChange={t => { setTab(t); setView('list') }} />
        <div className={styles.formWrap}>
          <ChampionshipForm
            initial={editing}
            champId={editing.id}
            onSaved={() => { setView('list'); loadData() }}
            onCancel={() => setView('list')}
          />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <AdminHeader onLogout={handleLogout} tab={tab} onTabChange={t => { setTab(t); setView('list') }} />

      <div className={styles.content}>
        {tab === 'championships' && (
          <>
            <div className={styles.toolbar}>
              <h2 className={styles.subtitle}>Championships</h2>
              <button className={styles.addBtn} onClick={() => setView('add')}>+ ADD CHAMPIONSHIP</button>
            </div>

            {loading ? (
              <p className={styles.loading}>Loading...</p>
            ) : championships.length === 0 ? (
              <p className={styles.empty}>No championships yet. Add one to get started.</p>
            ) : (
              <div className={styles.table}>
                {championships.map(c => (
                  <div key={c.id} className={styles.row}>
                    <div className={styles.rowInfo}>
                      {c.coverPhoto && <img src={c.coverPhoto} alt={c.name} className={styles.thumb} />}
                      <div>
                        <p className={styles.rowName}>{c.name}</p>
                        <p className={styles.rowMeta}>{c.year} · P{c.position} · {c.track}</p>
                      </div>
                    </div>
                    <div className={styles.rowActions}>
                      <button className={styles.editBtn} onClick={() => { setEditing(c); setView('edit') }}>Edit</button>
                      <button className={styles.deleteBtn} onClick={() => setConfirmDelete(c.id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'gallery' && <GalleryAdmin />}
      </div>

      {confirmDelete && (
        <div className={styles.modal}>
          <div className={styles.modalBox}>
            <p>Delete this championship? This cannot be undone.</p>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className={styles.confirmBtn} onClick={() => handleDelete(confirmDelete)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function AdminHeader({ onLogout, tab, onTabChange }) {
  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <img src={logo} alt="Logo" className={styles.logo} />
        <span className={styles.adminTag}>ADMIN PANEL</span>
      </div>
      <nav className={styles.tabs}>
        <button
          className={`${styles.tabBtn} ${tab === 'championships' ? styles.tabActive : ''}`}
          onClick={() => onTabChange('championships')}
        >
          CHAMPIONSHIPS
        </button>
        <button
          className={`${styles.tabBtn} ${tab === 'gallery' ? styles.tabActive : ''}`}
          onClick={() => onTabChange('gallery')}
        >
          GALLERY
        </button>
      </nav>
      <button className={styles.logoutBtn} onClick={onLogout}>LOGOUT</button>
    </header>
  )
}
