const http = require('node:http')

const desirePort = process.env.PORT ?? 1234

// routing
const dittoJSON = require('./pokemon-ditto.json')

const processRequest = (req, res) => {
  const { method, url } = req

  switch (method) {
    case 'GET':
      switch (url) {
        case '/pokemon/ditto':
          res.setHeader('ContentType', 'application/json; charset=utf-8')
          return res.end(JSON.stringify(dittoJSON))
        default:
          res.statusCode = 404
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          return res.end('<h1>404</h1>')
      }

    case 'POST':
      switch (url) {
        case '/pokemon': {
          let body = ''

          req.on('data', (chunk) => {
            body += chunk.toString()
          })

          req.on('end', () => {
            const data = JSON.parse(body)
            // Codigo para corroborar y ver la informacion recibida
            res.writeHead(201, {
              'Content-Type': 'application/json; charset=utf-8'
            })
            data.timestamp = Date.now()
            res.end(JSON.stringify(data))
          })

          break
        }
        default:
          res.statusCode = 404
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          return res.end('<h1>404</h1>')
      }
  }
}
// routing

// const processRequest = (req, res) => {
//   if (req.url === '/') {
//     res.statusCode = 200
//     res.setHeader('Content-Type', 'text/html; charset=utf-8')
//     res.end('<h1>Request processed... Home page!!!</h1>')
//   } else if (req.url === '/contact') {
//     res.statusCode = 200
//     res.setHeader('Content-Type', 'text/html; charset=utf-8')
//     res.end('<h1>Request processed... Contact page!!!</h1>')
//   } else {
//     res.statusCode = 400
//     res.end('<h1>Eror 404, page not found.</h1>')
//   }
// }

const server = http.createServer(processRequest)

server.listen(desirePort, () => {
  console.log(`server listening on port http://localhost:${desirePort}`)
})
