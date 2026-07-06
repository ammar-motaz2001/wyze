import { useState } from 'react'
import ProductImage from './ProductImage'
import QuantityStepper from './QuantityStepper'
import { money, priceOrFree } from '../utils/format'
import { satisfactionBadge, delivery, wyzeLogo } from '../assets'

function ReviewLine({ line, onIncrement, onDecrement }) {
  return (
    <div className="rline">
      <div className="rline__thumb">
        <ProductImage image={line.image} alt={line.name} />
      </div>
      <div className="rline__info">
        <span className="rline__name">{line.name}</span>
        {line.variantLabel && <span className="rline__variant">{line.variantLabel}</span>}
      </div>
      <QuantityStepper
        qty={line.qty}
        size="sm"
        disabled={line.required}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
        label={line.name}
      />
      <div className="rline__price">
        {line.compareAt != null && line.compareAt !== line.price && (
          <span className="price__compare">{money(line.lineCompare)}</span>
        )}
        <span className={`rline__now ${line.lineTotal === 0 ? 'rline__now--free' : ''}`}>
          {priceOrFree(line.lineTotal)}
        </span>
      </div>
    </div>
  )
}

export default function ReviewPanel({
  reviewGroups,
  plan,
  totals,
  shipping,
  guarantee,
  onLineIncrement,
  onLineDecrement,
  onCheckout,
  onSaveForLater,
}) {
  const [justSaved, setJustSaved] = useState(false)

  const handleSave = () => {
    const ok = onSaveForLater()
    if (ok !== false) {
      setJustSaved(true)
      window.setTimeout(() => setJustSaved(false), 2200)
    }
  }

  return (
    <aside className="review">
      <div className="review__main">
      <div className="review__eyebrow">REVIEW</div>
      <h2 className="review__title">Your security system</h2>
      <p className="review__sub">
        Review your personalized protection system designed to keep what matters most safe.
      </p>

      <div className="review__lines">
        {reviewGroups.map((group) => (
          <div className="rgroup" key={group.label}>
            <div className="rgroup__label">{group.label.toUpperCase()}</div>
            {group.lines.map((line) => (
              <ReviewLine
                key={line.key}
                line={line}
                onIncrement={() => onLineIncrement(line.productId, line.variantId, 1)}
                onDecrement={() => onLineDecrement(line.productId, line.variantId, -1)}
              />
            ))}
          </div>
        ))}

        {plan && (
          <div className="rgroup rgroup--plan">
            <div className="rgroup__label">PLAN</div>
            <div className="rline rline--plan">
              <div className="plan-mark">
                <img className="plan-mark__logo" src={wyzeLogo} alt="Wyze" />
                <span className="plan-mark__name">{plan.name}</span>
              </div>
              <div className="rline__price">
                {plan.compareAt != null && (
                  <span className="price__compare">{money(plan.compareAt)}/{plan.period}</span>
                )}
                <span className="rline__now">
                  {plan.price === 0 ? 'Free' : `${money(plan.price)}/${plan.period}`}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="review__shipping">
        <span className="ship-icon">
          <img src={delivery} alt="" />
        </span>
        <span className="ship-label">{shipping.label}</span>
        <span className="rline__price">
          {shipping.compareAt != null && (
            <span className="price__compare">{money(shipping.compareAt)}</span>
          )}
          <span className="rline__now rline__now--free">{priceOrFree(shipping.price)}</span>
        </span>
      </div>
      </div>

      <div className="review__side">
      <div className="review__summary">
        <img className="guarantee-badge" src={satisfactionBadge} alt="100% Wyze satisfaction guarantee" />
        <div className="review__guarantee-copy">
          <strong>{guarantee.title}</strong>
          <span>{guarantee.body}</span>
        </div>
        <div className="review__totals">
          <span className="financing">as low as {money(totals.financing)}/mo</span>
          <div className="grand">
            <span className="grand__compare">{money(totals.compare)}</span>
            <span className="grand__now">{money(totals.total)}</span>
          </div>
        </div>
      </div>

      {totals.savings > 0 && (
        <p className="review__savings">
          Congrats! You're saving {money(totals.savings)} on your security bundle!
        </p>
      )}

      <button type="button" className="checkout-btn" onClick={onCheckout}>
        Checkout
      </button>
      <button type="button" className="save-link" onClick={handleSave}>
        {justSaved ? 'Saved! ✓' : 'Save my system for later'}
      </button>
      </div>
    </aside>
  )
}
