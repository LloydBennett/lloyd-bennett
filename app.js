require('dotenv').config()

const fetch = require('node-fetch');
const express = require('express')
const app = express()
const path = require('path')
const port = 3000

const Prismic = require('@prismicio/client');
const PrismicH = require('@prismicio/helpers');

const routes = [
  {
    type: 'home',
    path: '/',
  },
  {
    type: 'about',
    path: '/about',
  },
  {
    type: 'projects',
    path: '/projects/:uid',
  }
]

const client = Prismic.createClient(process.env.PRISMIC_ENDPOINT, {
  accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  fetch,
  routes,
});

//middleware
app.use((req, res, next) => {
  res.locals.ctx = {
    PrismicH,
  }
  next()
})

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const handleRequest = async api => {
  const meta = await client.getSingle('meta')
  const navigation = await client.getSingle('navigation')

  return {
    meta,
    navigation
  }
}


// Query for the root path.
app.get('/', async (req, res) => {

  const home = await client.getSingle('home')
  const defaults = await handleRequest(req)

  res.render('pages/home', { ...defaults, home })
})

app.get('/about', async (req, res) => {
  const about = await client.getSingle('about')
  const defaults = await handleRequest(req)

  res.render('pages/about', { ...defaults, about })
})

app.get('/projects/:uid', async (req, res) => {
  const uid = req.params.uid
  const project = await client.getByUID('projects', uid)
  const defaults = await handleRequest(req)
  res.render('pages/project', { ...defaults, project })
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})