export default function VariantSelector({ variants, activeId, onSelect }) {
  return (
    <div className="variants" role="radiogroup" aria-label="color">
      {variants.map((v) => {
        const active = v.id === activeId
        return (
          <button
            type="button"
            key={v.id}
            role="radio"
            aria-checked={active}
            className={`variant-chip ${active ? 'variant-chip--active' : ''}`}
            onClick={() => onSelect(v.id)}
          >
            <span
              className="variant-swatch"
              style={{ background: v.swatch }}
            />
            <span className="variant-label">{v.label}</span>
          </button>
        )
      })}
    </div>
  )
}
