// load modules
const express = require('express')
const cds = require('@sap/cds')
const proxy = require('@sap/cds-odata-v2-adapter-proxy')

// config
const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 4004
const csn = 'srv/csn.json'

;(async () => {
  // create new app
  const app = express()

  await cds.connect('db') // ensure database is connected!

  // serve odata v4
  await cds
    .serve('AdminService')
    .from(csn)
    .in(app)

  await cds
    .serve('CatalogService')
    .from(csn)
    .with('cat-service.js')
    .in(app)

  app.use(
    proxy({
      // app
      path: 'v2',
      model: csn,
      // target
      port: port
    })
  )

  // start server
  const server = app.listen(port, host, () =>
    console.info(`app is listing at ${host}:${port}`)
  )
  server.on('error', error => console.error(error.stack))
})()