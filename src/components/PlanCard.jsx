import { money } from '../utils/format'

export default function PlanCard({ plan, selected, onSelect }) {
  return (
    <button
      type="button"
      className={`plan-card ${selected ? 'plan-card--selected' : ''}`}
      onClick={() => onSelect(plan.id)}
      role="radio"
      aria-checked={selected}
    >
      {plan.recommended && <span className="plan-card__badge">Most popular</span>}
      <span className={`plan-radio ${selected ? 'plan-radio--on' : ''}`} aria-hidden="true" />
      <div className="plan-card__main">
        <h3 className="plan-card__name">{plan.name}</h3>
        <p className="plan-card__tagline">{plan.tagline}</p>
        <ul className="plan-card__features">
          {plan.features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>
      <div className="plan-card__price">
        {plan.compareAt != null && (
          <span className="price__compare">{money(plan.compareAt)}/{plan.period}</span>
        )}
        <span className="plan-card__now">
          {plan.price === 0 ? 'Free' : `${money(plan.price)}/${plan.period}`}
        </span>
      </div>
    </button>
  )
}
