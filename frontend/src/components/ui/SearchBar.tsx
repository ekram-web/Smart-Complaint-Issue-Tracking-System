// Search Bar Component with Keyboard Shortcut (Ctrl+K)
import { useState, useEffect, useRef } from 'react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  onFocus?: () => void
}

export function SearchBar({ value, onChange, placeholder = 'Search...', onFocus }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Keyboard shortcut: Ctrl+K or Cmd+K
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="relative">
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
        search
      </span>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => {
          setIsFocused(true)
          onFocus?.()
        }}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="w-full pl-10 pr-20 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
      />
      {!isFocused && (
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs rounded border border-slate-300 dark:border-slate-600 font-mono">
          Ctrl+K
        </kbd>
      )}
    </div>
  )
}
