import { useEffect, useRef, useState, useId, useCallback } from 'react'
import { useLocationSearch } from '../../hooks/useLocationSearch'

export default function LocationAutocomplete({ label, value, onChange, placeholder = 'City or airport', disabled, preferCountry, limit }) {
  const { query, setQuery, suggestions, loading, error } = useLocationSearch('', { preferCountry, limit })
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const containerRef = useRef(null)
  const inputId = useId()
  const listId = `${inputId}-listbox`

  // Keep input display in sync when parent value changes
  useEffect(() => {
    // Always reflect external value (empty string clears the field)
    setQuery(value || '')
    if (!value) setOpen(false)
  }, [value, setQuery])

  useEffect(() => {
    function onDocClick(e) {
      if (!containerRef.current) return
      if (!containerRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  useEffect(() => {
    // Reset active item when list changes
    setActiveIndex(suggestions?.length ? 0 : -1)
  }, [suggestions])

  function handleInput(e) {
    const v = e.target.value
    setQuery(v)
    setOpen(true)
  }

  function select(item) {
    onChange?.(item.code)
    setQuery(item.code)
    setOpen(false)
  }

  const onKeyDown = useCallback((e) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      setOpen(true)
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min((i < 0 ? -1 : i) + 1, (suggestions?.length || 1) - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max((i < 0 ? 0 : i) - 1, 0))
    } else if (e.key === 'Enter') {
      if (open && activeIndex >= 0 && suggestions[activeIndex]) {
        e.preventDefault()
        select(suggestions[activeIndex])
      }
    } else if (e.key === 'Escape') {
      if (open) {
        e.preventDefault()
        setOpen(false)
      }
    }
  }, [open, activeIndex, suggestions])

  const showList = open && suggestions?.length

  const optionId = (idx) => `${listId}-opt-${idx}`

  // Status text for screen readers
  const srStatus = loading
    ? 'Searching'
    : error
      ? 'Search failed'
      : showList
        ? `${suggestions.length} result${suggestions.length > 1 ? 's' : ''}`
        : ''

  return (
    <div className="position-relative" ref={containerRef}>
      {label && <label className="form-label" htmlFor={inputId}>{label}</label>}
      <input
        id={inputId}
        className="form-control"
        placeholder={placeholder}
        disabled={disabled}
        value={query}
        onChange={handleInput}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={!!showList}
        aria-controls={listId}
        aria-activedescendant={activeIndex >= 0 && showList ? optionId(activeIndex) : undefined}
      />
      {showList ? (
        <ul
          id={listId}
          role="listbox"
          className="list-group position-absolute w-100"
          style={{ zIndex: 10, maxHeight: 260, overflowY: 'auto' }}
          aria-label={`${label || 'Suggestions'}`}
        >
          {suggestions.map((s, idx) => (
            <li
              key={s.code + '-' + idx}
              id={optionId(idx)}
              role="option"
              aria-selected={activeIndex === idx}
              className={`list-group-item list-group-item-action ${activeIndex === idx ? 'active' : ''}`}
              onClick={() => select(s)}
              onMouseEnter={() => setActiveIndex(idx)}
              style={{ cursor: 'pointer' }}
            >
              <div className="d-flex justify-content-between">
                <div>
                  <strong>{s.code}</strong> — {s.name}{s.city ? `, ${s.city}` : ''}
                </div>
                <small className="text-muted">{s.country}</small>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
      {loading && <div className="form-text">Searching…</div>}
      {error && <div className="text-danger small">{error}</div>}
      <div className="visually-hidden" aria-live="polite">{srStatus}</div>
    </div>
  )
}
