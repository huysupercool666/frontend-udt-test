import express from 'express'
import React from 'react'
import { renderToString } from 'react-dom/server'
import AppCalculator from '../client/appCalculator/AppCalculator'
import HistoryPage from '../client/historyPage/HistoryPage'
import { Server } from 'http'
import path from 'path'

const server = express()
const calculatorPort = 3001

server.use(express.static('dist'))

server.get('/', (request, response) => {
  const calculatorHtmlString = renderToString(<AppCalculator />)
  response.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Calculator</title>
        <link rel="stylesheet" href="app.css">
      </head>
      <body>
        <div id="root">${calculatorHtmlString}</div>
        <script src="script.js"></script>
      </body>
    </html>
  `)
})

const httpServer = server.listen(calculatorPort, () => {
  console.log('Calculator server is running on port ' + calculatorPort)
})

server.get('/HistoryPage', (request, response) => {
  const historyHtmlString = renderToString(<HistoryPage />)
  response.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>History</title>
        <link rel="stylesheet" href="app.css">
      </head>
      <body>
        <div id="root">${historyHtmlString}</div>
        <script src="script.js"></script>
      </body>
    </html>
  `)
})

server.get('/3000', (request, response) => {
  response.sendFile(path.join(__dirname, '../../dist/index.html'))
})
