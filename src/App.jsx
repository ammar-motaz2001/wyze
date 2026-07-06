import { useState } from 'react'
import { useSystemStore } from './state/useSystemStore'
import Step from './components/Step'
import ProductCard from './components/ProductCard'
import PlanCard from './components/PlanCard'
import ReviewPanel from './components/ReviewPanel'

export default function App() {
  const store = useSystemStore()
  const { catalog } = store
  const totalSteps = catalog.steps.length
  const [confirming, setConfirming] = useState(false)

  const handleCheckout = () => {
    setConfirming(true)
    window.setTimeout(() => setConfirming(false), 2600)
  }

  return (
    <div className="page">
      <header className="page__header">
        <h1>Let&apos;s get started!</h1>
      </header>

      <div className="layout">
        <main className="builder">
          {catalog.steps.map((step) => {
            const open = store.openStep === step.id
            return (
              <Step
                key={step.id}
                step={step}
                totalSteps={totalSteps}
                open={open}
                selectedCount={store.selectedCountByStep[step.id]}
                onToggle={store.setOpenStep}
              >
                {step.type === 'plan' ? (
                  <div className="plan-grid">
                    {step.plans.map((plan) => (
                      <PlanCard
                        key={plan.id}
                        plan={plan}
                        selected={store.selectedPlan === plan.id}
                        onSelect={store.selectPlan}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="card-grid">
                    {step.products.map((product) => {
                      const activeVariantId = store.activeVariant[product.id]
                      const counts = store.quantities[product.id] || {}
                      const activeQty = counts[activeVariantId] ?? 0
                      const totalQty = Object.values(counts).reduce((a, b) => a + b, 0)
                      return (
                        <ProductCard
                          key={product.id}
                          product={product}
                          activeVariantId={activeVariantId}
                          activeQty={activeQty}
                          totalQty={totalQty}
                          onIncrement={() => store.stepVariantQty(product.id, activeVariantId, 1)}
                          onDecrement={() => store.stepVariantQty(product.id, activeVariantId, -1)}
                          onSelectVariant={(vid) => store.setActiveVariant(product.id, vid)}
                        />
                      )
                    })}
                  </div>
                )}

                {step.nextLabel && (
                  <div className="step__next-wrap">
                    <button
                      type="button"
                      className="next-btn"
                      onClick={() => {
                        const idx = catalog.steps.findIndex((s) => s.id === step.id)
                        const next = catalog.steps[idx + 1]
                        if (next) store.goToStep(next.id)
                      }}
                    >
                      {step.nextLabel}
                    </button>
                  </div>
                )}
              </Step>
            )
          })}
        </main>

        <ReviewPanel
          reviewGroups={store.reviewGroups}
          plan={store.plan}
          totals={store.totals}
          shipping={catalog.shipping}
          guarantee={catalog.guarantee}
          onLineIncrement={store.stepVariantQty}
          onLineDecrement={store.stepVariantQty}
          onCheckout={handleCheckout}
          onSaveForLater={store.saveForLater}
        />
      </div>

      {confirming && (
        <div className="toast" role="status">
          🎉 Order placed! This is a prototype — no payment was taken.
        </div>
      )}
    </div>
  )
}
