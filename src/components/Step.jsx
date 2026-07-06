import { StepIcon, Chevron } from './icons'

export default function Step({ step, totalSteps, open, selectedCount, onToggle, children }) {
  return (
    <section className={`step ${open ? 'step--open' : ''}`}>
      <div className="step__eyebrow">STEP {step.index} OF {totalSteps}</div>
      <button
        type="button"
        className="step__header"
        aria-expanded={open}
        aria-controls={`step-panel-${step.id}`}
        onClick={() => onToggle(step.id)}
      >
        <span className="step__heading">
          <StepIcon name={step.icon} />
          <span className="step__title">{step.title}</span>
        </span>
        <span className="step__state">
          <span className="step__count">{selectedCount} selected</span>
          <Chevron open={open} />
        </span>
      </button>

      {open && (
        <div className="step__panel" id={`step-panel-${step.id}`}>
          {children}
        </div>
      )}
    </section>
  )
}
