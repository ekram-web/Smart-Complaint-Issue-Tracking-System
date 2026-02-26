// Back to Top Button Component
import { useState, useEffect } from 'react'

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down 300px
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)

    return () => {
      window.removeEventListener('scroll', toggleVisibility)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  if (!isVisible) return null

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-slate-900 dark:bg-slate-700 text-white rounded-full shadow-lg hover:bg-slate-800 dark:hover:bg-slate-600 transition-all hover:scale-110 active:scale-95"
      aria-label="Back to top"
    >
      <span className="material-symbols-outlined">arrow_upward</span>
    </button>
  )
}
