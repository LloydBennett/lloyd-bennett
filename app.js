require('dotenv').config()

const fetch = require('node-fetch');
const express = require('express')
const app = express()
const path = require('path')
const port = 3000

const Prismic = require('@prismicio/client');
const PrismicH = require('@prismicio/helpers');

app.use(express.static(path.join(__dirname, 'public')));

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

  const document = await client.getSingle('home')
  const defaults = await handleRequest(req)

  res.render('pages/home', { ...defaults, document })
})

app.get('/about', async (req, res) => {
  const document = await client.getSingle('about')
  const defaults = await handleRequest(req)

  res.render('pages/about', { ...defaults, document })
})

app.get('/projects/:uid', async (req, res) => {
  const uid = req.params.uid
  const document = await client.getByUID('projects', uid)
  const defaults = await handleRequest(req)
  console.log(document.data)
  res.render('pages/project', { ...defaults, document })
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})