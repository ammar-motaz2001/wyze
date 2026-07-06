import { useCallback, useMemo, useState } from 'react'
import catalog from '../data/catalog.json'

const STORAGE_KEY = 'wyze-system-builder:v1'

const productSteps = catalog.steps.filter((s) => s.type === 'products')
const planStep = catalog.steps.find((s) => s.type === 'plan')

const PRODUCT_INDEX = {}
for (const step of productSteps) {
  for (const product of step.products) {
    PRODUCT_INDEX[product.id] = { product, step }
  }
}

export const getProduct = (id) => PRODUCT_INDEX[id]?.product ?? null
export const getPlan = (id) => planStep.plans.find((p) => p.id === id) ?? null

function variantKeys(product) {
  return product.variants.length ? product.variants.map((v) => v.id) : ['default']
}
//
function buildSeedState() {
  const quantities = {}
  const activeVariant = {}
  for (const { product } of Object.values(PRODUCT_INDEX)) {
    const counts = {}
    for (const key of variantKeys(product)) counts[key] = 0
    for (const [key, qty] of Object.entries(product.seed || {})) {
      if (key in counts) counts[key] = qty
    }
    quantities[product.id] = counts
    activeVariant[product.id] = product.defaultVariant
  }
  return {
    quantities,
    activeVariant,
    selectedPlan: planStep.defaultPlan,
    openStep: catalog.steps[0].id,
  }
}

function hydrate(saved) {
  const seed = buildSeedState()
  if (!saved) return seed
  const state = { ...seed }
  if (saved.selectedPlan && getPlan(saved.selectedPlan)) {
    state.selectedPlan = saved.selectedPlan
  }
  for (const { product } of Object.values(PRODUCT_INDEX)) {
    const keys = variantKeys(product)
    const savedCounts = saved.quantities?.[product.id]
    if (savedCounts) {
      for (const key of keys) {
        const n = Number(savedCounts[key])
        state.quantities[product.id][key] = Number.isFinite(n) && n > 0 ? n : 0
      }
    }
    const savedVariant = saved.activeVariant?.[product.id]
    if (savedVariant && keys.includes(savedVariant)) {
      state.activeVariant[product.id] = savedVariant
    }
  }
  return state
}

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function useSystemStore() {
  const [state, setState] = useState(() => hydrate(loadSaved()))
  const { quantities, activeVariant, selectedPlan, openStep } = state

  const stepVariantQty = useCallback((productId, variantId, delta) => {
    setState((s) => {
      const current = s.quantities[productId]?.[variantId] ?? 0
      return {
        ...s,
        quantities: {
          ...s.quantities,
          [productId]: {
            ...s.quantities[productId],
            [variantId]: Math.max(0, current + delta),
          },
        },
      }
    })
  }, [])

  const setActiveVariant = useCallback((productId, variantId) => {
    setState((s) => ({
      ...s,
      activeVariant: { ...s.activeVariant, [productId]: variantId },
    }))
  }, [])

  const selectPlan = useCallback((planId) => {
    setState((s) => ({ ...s, selectedPlan: planId }))
  }, [])

  const setOpenStep = useCallback((stepId) => {
    setState((s) => ({ ...s, openStep: s.openStep === stepId ? null : stepId }))
  }, [])

  const goToStep = useCallback((stepId) => {
    setState((s) => ({ ...s, openStep: stepId }))
  }, [])

  const saveForLater = useCallback(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ quantities, activeVariant, selectedPlan })
      )
      return true
    } catch {
      return false
    }
  }, [quantities, activeVariant, selectedPlan])

  const selectedCountByStep = useMemo(() => {
    const counts = {}
    for (const step of catalog.steps) {
      if (step.type === 'plan') {
        counts[step.id] = selectedPlan ? 1 : 0
      } else {
        counts[step.id] = step.products.filter((p) =>
          variantKeys(p).some((k) => (quantities[p.id]?.[k] ?? 0) > 0)
        ).length
      }
    }
    return counts
  }, [quantities, selectedPlan])

  const reviewGroups = useMemo(() => {
    const groups = []
    for (const step of productSteps) {
      const lines = []
      for (const product of step.products) {
        const activeVariants = product.variants.filter(
          (v) => (quantities[product.id]?.[v.id] ?? 0) > 0
        )
        const showVariantLabel = activeVariants.length > 1
        for (const key of variantKeys(product)) {
          const qty = quantities[product.id]?.[key] ?? 0
          if (qty <= 0) continue
          const variant = product.variants.find((v) => v.id === key)
          lines.push({
            key: `${product.id}::${key}`,
            productId: product.id,
            variantId: key,
            name: product.name,
            variantLabel: showVariantLabel && variant ? variant.label : null,
            image: product.image,
            qty,
            price: product.price,
            compareAt: product.compareAt,
            required: !!product.required,
            lineTotal: product.price * qty,
            lineCompare: (product.compareAt ?? product.price) * qty,
          })
        }
      }
      if (lines.length) groups.push({ label: step.reviewGroup, lines })
    }
    return groups
  }, [quantities])

  const plan = getPlan(selectedPlan)

  const totals = useMemo(() => {
    let total = 0
    let compare = 0
    for (const group of reviewGroups) {
      for (const line of group.lines) {
        total += line.lineTotal
        compare += line.lineCompare
      }
    }
    if (plan) {
      total += plan.price
      compare += plan.compareAt ?? plan.price
    }
    const savings = Math.max(0, compare - total)
    const financing = total / (catalog.financingDivisor || 10)
    return { total, compare, savings, financing }
  }, [reviewGroups, plan])

  return {
    catalog,
    quantities,
    activeVariant,
    selectedPlan,
    plan,
    openStep,
    stepVariantQty,
    setActiveVariant,
    selectPlan,
    setOpenStep,
    goToStep,
    saveForLater,
    selectedCountByStep,
    reviewGroups,
    totals,
  }
}
