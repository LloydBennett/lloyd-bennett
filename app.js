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
app.set('view engine', 'ejs');

const handleRequest = async api => {
  const meta = await client.getSingle('meta')
  const navigation = await client.getSingle('navigation')
  const projects = await client.getAllByType('projects')
  const footer = await client.getSingle('footer')
  const about = await client.getSingle('about')
  const floatingPoster = await client.getSingle('floating_poster');


  return {
    meta,
    navigation,
    projects,
    footer,
    about,
    floatingPoster
  }
}


// Query for the root path.
app.get('/', async (req, res) => {
  const pageType = 'home'
  const document = await client.getSingle('home')
  const defaults = await handleRequest(req)
  let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

  res.render('base', { ...defaults, document, pageType, fullUrl })
})

app.get('/about', async (req, res) => {
  const pageType = 'about'
  const document = await client.getSingle('about')
  const defaults = await handleRequest(req)
  let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

  res.render('base', { ...defaults, document, pageType, fullUrl })
})

app.get('/projects/:uid', async (req, res) => {
  const uid = req.params.uid
  const pageType = 'project'
  const document = await client.getByUID('projects', uid)
  const defaults = await handleRequest(req)
  let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

  res.render('base', { ...defaults, document, pageType, fullUrl })
})

app.get('*', async (req, res) => {
  let pageType = "error"
  
  let document = {
    data: { title: "Page can’t be found" }
  }
  const defaults = await handleRequest(req)
  let fullUrl = req.protocol + '://' + req.get('host')

  res.render('base', { ...defaults, document, pageType, fullUrl })
});

app.listen(port, () => {
  console.log(`Lloyd Portfolio listening on port http://localhost:${port}`)
})