import ProductImage from './ProductImage'
import VariantSelector from './VariantSelector'
import QuantityStepper from './QuantityStepper'
import { money } from '../utils/format'

export default function ProductCard({
  product,
  activeVariantId,
  activeQty,
  totalQty,
  onIncrement,
  onDecrement,
  onSelectVariant,
}) {
  const hasVariants = product.variants.length > 0
  const selected = totalQty > 0

  return (
    <article className={`card ${selected ? 'card--selected' : ''}`}>
      {product.badge && <span className="card__badge">{product.badge}</span>}

      <div className="card__media">
        <ProductImage image={product.image} alt={product.name} />
      </div>

      <div className="card__body">
        <h3 className="card__title">{product.name}</h3>
        <p className="card__desc">
          {product.description}{' '}
          <a className="learn-more" href={product.learnMoreUrl}>Learn More</a>
        </p>

        {hasVariants && (
          <VariantSelector
            variants={product.variants}
            activeId={activeVariantId}
            onSelect={onSelectVariant}
          />
        )}

        <div className="card__footer">
          <QuantityStepper
            qty={activeQty}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
            label={product.name}
          />
          <div className="price">
            {product.compareAt != null && (
              <span className="price__compare price__compare--card">{money(product.compareAt)}</span>
            )}
            <span className="price__now">{money(product.price)}</span>
          </div>
        </div>
      </div>
    </article>
  )
}
