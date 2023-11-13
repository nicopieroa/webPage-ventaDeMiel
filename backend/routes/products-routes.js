import { Router } from 'express'
import { randomUUID } from 'node:crypto'

import { readJSON } from '../utilsJsonsReader.js'

import {
  productValidation,
  productPartialValidation
} from '../schemas/product-schema.js'

const products = readJSON('./ventaDeMiel.json')

export const productsRouter = Router()

productsRouter.get('/', (req, res) => {
  res.send(products)
})

productsRouter.get('/:id', (req, res) => {
  const { id } = req.params
  const product = products.find((product) => product.id === id)

  if (product) return res.json(product)

  res.status(404).json({ message: 'Producto no encontrado' })
})

productsRouter.post('/', (req, res) => {
  const reqValidation = productValidation(req.body)

  if (reqValidation.error) {
    return res
      .status(400)
      .json({ error: JSON.parse(reqValidation.error.message) })
  }

  const newProduct = {
    id: randomUUID(),
    ...reqValidation.data
  }

  // Al utilizar el método push estamos guardando los datos en memoría,
  // va en contra de los principios de una api rest. Es algo provisorio.
  products.push(newProduct)

  res.status(201).json(newProduct)
})

productsRouter.patch('/:id', (req, res) => {
  const reqValidation = productPartialValidation(req.body)

  if (reqValidation.error) {
    return res
      .status(400)
      .json({ error: JSON.parse(reqValidation.error.message) })
  }

  const { id } = req.params
  const productIndex = products.findIndex((product) => product.id === id)

  if (productIndex < 0) {
    res.status(404).json({ message: 'Producto no encontrado' })
  }

  const productUpdated = { ...products[productIndex], ...reqValidation.data }

  products[productIndex] = productUpdated

  return res.json(productUpdated)
})

productsRouter.delete('/:id', (req, res) => {
  const { id } = req.params
  const productIndex = products.findIndex((product) => product.id === id)

  if (productIndex < 0) {
    res.status(404).json({ message: 'Producto no encontrado' })
  }

  products.splice(productIndex, 1)

  return res.json({ message: 'Producto borrado' })
})
