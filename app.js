const express = require('express')
const fetch = require('node-fetch')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000

app.use(express.static('public'))

app.get('/data', async (req, res) => {
  // define GraphQL query
  const query = `
  { 
    search(query: "stars:>50000", type: REPOSITORY, first: 10) {
      repositoryCount
      edges {
        node {
          ... on Repository {
            name
            owner {
              login
            }
            stargazers {
              totalCount
            }
          }
        }
      }
    }
  }`

  // store GraphQL API endpoint
  const url = 'https://api.github.com/graphql'

  // options to perform connection to the server
  const options = {
    method: 'post',
    headers: {
      'content-type': 'application/json',
      'authorization': 'bearer ' + process.env.APIKEY
    },
    body: JSON.stringify({ 'query': query }),
  }

  let response
  try {
    response = await fetch(url, options)
  } catch (err) {
    console.error(err);
  }
  const data = await response.json()
  console.log(data)

  res.json(data)
  })



app.listen(port, () => console.log(`App listening on port ${port}!`))