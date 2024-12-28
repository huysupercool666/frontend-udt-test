import express from 'express'
import React from 'react'
import { renderToString } from 'react-dom/server'
import App from '../client/App'

const server = express()
const Port = 3000
server.use(express.static('dist'))

server.get('/', (req, res) => {
  const appString = renderToString(<App />)
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>My App</title>
        <link rel="stylesheet" href="app.css">
      </head>
      <body>
        <div id="root">${appString}</div>
        <script src="script.js"></script>
      </body>
    </html>
  `)
})

server.listen(Port, () => {
  console.log('Server is running on port 3000')
})
