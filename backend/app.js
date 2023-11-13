import express, { json } from 'express'
import { corsMiddleware } from './middlewares/cors.js'
import { productsRouter } from './routes/products-routes.js'

const app = express()

const PORT = process.env.PORT ?? 1234

app.disable('x-powered-by')
app.use(json())
app.use(corsMiddleware())

// Handle routes
app.get('/', (req, res) => {
  res.send('<h1>Mi web</h1>')
})

app.use('/productos', productsRouter)

// Handle error
app.use((req, res) => {
  res.status(404).send('<h1>404</h1>')
})

app.listen(PORT, () => {
  console.log(`server listening on por http://localhost:${PORT}`)
})
