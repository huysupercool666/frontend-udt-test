import express from 'express'
import React from 'react'
import { renderToString } from 'react-dom/server'
import AppCalculator from '../client/appCalculator/AppCalculator'
import { Server } from 'http'

const server = express()
const port = 3001
server.use(express.static('dist'))

server.get('/', (request, response) => {
  const calculatorHtmlString = renderToString(<AppCalculator />)
  response.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>My App</title>
        <link rel="stylesheet" href="app.css">
      </head>
      <body>
        <div id="root">${calculatorHtmlString}</div>
        <script src="script.js"></script>
      </body>
    </html>
  `)
})

const httpServer = server.listen(port, () => {
  console.log('Server is running on port ' + port)
})
