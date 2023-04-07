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


// Query for the root path.
app.get('/', async (req, res) => {

  const document = await client.getSingle('home')
  res.render('pages/home', { document })
})

app.get('/about', async (req, res) => {
  const document = await client.getSingle('about')
  console.log(document);
  res.render('pages/about', { document })
})

app.get('/projects/:uid', async (req, res) => {
  const uid = req.params.uid
  const document = await client.getByUID('projects', uid)
  res.render('pages/project', { document })
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})