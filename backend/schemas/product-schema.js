import zod from 'zod'

const productSchema = zod.object({
  name: zod.string(),
  image: zod.object({
    url: zod.string(),
    alt: zod.string()
  }),
  weight: zod.string()
})

// eslint-disable-next-line space-before-function-paren
export function productValidation(product) {
  return productSchema.safeParse(product)
}

// eslint-disable-next-line space-before-function-paren
export function productPartialValidation(product) {
  return productSchema.partial().safeParse(product)
}
