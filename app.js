const express = require('express')
const app = express()
const path = require('path')
const port = 3000

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.render('pages/home')
})

app.get('/about', (req, res) => {
  res.render('pages/about')
})

app.get('/projects/:id', (req, res) => {
  res.render('pages/project')
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})
