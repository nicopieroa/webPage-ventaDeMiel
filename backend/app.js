import express, { json } from 'express'
import { randomUUID } from 'node:crypto'
import cors from 'cors'

import {
  productValidation,
  productPartialValidation
} from './schemas/productSchema.js'

// Handle import json

// Future way to import json
// import products from './ventaDeMiel.json' with { type: 'json' }

// A way to import json is using fs file system
// import fs from 'node:fs'
// const products = JSON.parse(fs.readFileSync('./ventaDeMiel.json', 'utf-8'))

// Recomended way to impor json is using require
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const products = require('./ventaDeMiel.json')

const app = express()

const PORT = process.env.PORT ?? 1234

app.disable('x-powered-by')
app.use(json())
app.use(cors())

// Handle routes
app.get('/', (req, res) => {
  res.send('<h1>Mi web</h1>')
})

app.get('/productos', (req, res) => {
  res.send(products)
})

app.get('/productos/:id', (req, res) => {
  const { id } = req.params
  const product = products.find((product) => product.id === id)

  if (product) return res.json(product)

  res.status(404).json({ message: 'Producto no encontrado' })
})

app.post('/productos', (req, res) => {
  const reqValidation = productValidation(req.body)

  if (reqValidation.error) {
    return res
      .status(400)
      .json({ error: JSON.parse(reqValidation.error.message) })
  }

  const newProduct = {
    id: randomUUID(),
    ...reqValidation.data

    // reqValidation son los datos que queremos crear ya validados
    // que es distinto a req.body que son los datos enviados en la req
    // lo cual no han sido validados.
  }

  // Al utilizar el método push estamos guardando los datos en memoría,
  // va en contra de los principios de una api rest. Es algo provisorio.
  products.push(newProduct)

  res.status(201).json(newProduct)
})

app.patch('/productos/:id', (req, res) => {
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

app.delete('/productos/:id', (req, res) => {
  const { id } = req.params
  const productIndex = products.findIndex((product) => product.id === id)

  if (productIndex < 0) {
    res.status(404).json({ message: 'Producto no encontrado' })
  }

  products.splice(productIndex, 1)

  return res.json({ message: 'Producto borrado' })
})

// Handle error
app.use((req, res) => {
  res.status(404).send('<h1>404</h1>')
})

app.listen(PORT, () => {
  console.log(`server listening on por http://localhost:${PORT}`)
})
