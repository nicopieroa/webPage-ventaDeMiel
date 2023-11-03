const express = require('express')
const app = express()

const PORT = process.env.PORT ?? 1234

app.disable('x-powered-by')

// Handle middlewares
app.use((req, res, next) => {
  if (req.method !== 'POST') return next()
  if (req.header['content-type'] !== 'application/json') return next()

  let body = ''

  req.on('data', (chunk) => {
    body += chunk.toString()
  })

  req.on('end', () => {
    const data = JSON.parse(body)
    data.timestamp = Date.now()
    res.status(201).json(data)
  })
})

// Handle routes
app.get('/', (req, res) => {
  res.send('Mi web')
})

app.post('/pokemon', (req, res) => {
  res.status(201).json(req.body)
})

// Handle error
app.use((req, res) => {
  res.status(404).send('<h1>404</h1>')
})

app.listen(PORT, () => {
  console.log(`server listening on por http://localhost:${PORT}`)
})
