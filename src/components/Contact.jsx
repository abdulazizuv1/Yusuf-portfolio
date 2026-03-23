import { useRef, useState } from 'react'
import { gsap } from 'gsap'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'
import styles from './Contact.module.css'

export default function Contact() {
  const [form, setForm]       = useState({ name: '', email: '', message: '' })
  const [status, setStatus]   = useState('idle') // idle | sending | sent | error
  const btnRef                = useRef(null)
  const btnTextRef            = useRef(null)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const sendToTelegram = ({ name, email, message }) => {
    const token  = import.meta.env.VITE_TG_TOKEN
    const chatId = import.meta.env.VITE_TG_CHAT_ID
    const text   = `🏁 *New message from portfolio*\n\n👤 *Name:* ${name}\n📧 *Email:* ${email}\n\n💬 *Message:*\n${message}`
    return fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (status === 'sending' || status === 'sent') return
    setStatus('sending')

    try {
      await Promise.all([
        addDoc(collection(db, 'contacts'), { ...form, createdAt: serverTimestamp() }),
        sendToTelegram(form),
      ])
      setStatus('sent')
      gsap.to(btnRef.current, { backgroundColor: '#1a7a1a', duration: 0.3 })
      gsap.to(btnTextRef.current, {
        opacity: 0, y: -10, duration: 0.2,
        onComplete: () => {
          if (btnTextRef.current) btnTextRef.current.textContent = 'SENT ✓'
          gsap.to(btnTextRef.current, { opacity: 1, y: 0, duration: 0.3 })
        }
      })
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className={styles.section}>
      <div className={styles.inner}>
        {/* Left */}
        <div className={styles.left}>
          <h2 className={styles.title}>LET'S<br />TALK</h2>
          <p className={styles.desc}>
            Available for sponsorship enquiries, media requests, and collaboration opportunities.
          </p>
          <div className={styles.socials}>
            <a href="https://www.instagram.com/yusa.usm/" className={styles.social} target="_blank" rel="noreferrer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              <span>@yusufusmanov</span>
            </a>
            <a href="mailto:usmanov.yusuf0607@gmail.com" className={styles.social} rel="noreferrer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              <span>usmanov.yusuf0607@gmail.com</span>
            </a>
            <a href="tel:++998991424042" className={styles.social} rel="noreferrer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">        <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
              <span>Yusuf Usmanov Telephone Number</span>
            </a>
          </div>
        </div>

        {/* Right — form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
              value={form.name}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
          <div className={styles.field}>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              required
              value={form.email}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
          <div className={styles.field}>
            <textarea
              name="message"
              placeholder="Your Message"
              required
              rows={5}
              value={form.message}
              onChange={handleChange}
              className={styles.input}
            />
          </div>
          {status === 'error' && (
            <p className={styles.errorMsg}>Something went wrong. Please try again.</p>
          )}
          <button ref={btnRef} type="submit" className={styles.submitBtn} disabled={status === 'sent'}>
            <span ref={btnTextRef}>{status === 'sending' ? 'SENDING...' : 'SEND MESSAGE'}</span>
          </button>
        </form>
      </div>
    </section>
  )
}
