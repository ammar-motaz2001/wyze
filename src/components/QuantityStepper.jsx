export default function QuantityStepper({
  qty,
  onIncrement,
  onDecrement,
  disabled = false,
  size = 'md',
  label = 'quantity',
}) {
  const minusDisabled = disabled || qty <= 0
  return (
    <div className={`stepper stepper--${size} ${disabled ? 'stepper--locked' : ''}`}>
      <button
        type="button"
        className="stepper__btn"
        onClick={onDecrement}
        disabled={minusDisabled}
        aria-label={`decrease ${label}`}
      >
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8h9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
      </button>
      <span className="stepper__value" aria-live="polite">{qty}</span>
      <button
        type="button"
        className="stepper__btn"
        onClick={onIncrement}
        disabled={disabled}
        aria-label={`increase ${label}`}
      >
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3.5v9M3.5 8h9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
      </button>
    </div>
  )
}
