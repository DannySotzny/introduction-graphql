import React, { PropTypes } from 'react'
import { render } from 'react-dom'
import { ApolloProvider, ApolloClient, createNetworkInterface } from 'react-apollo'
import MyComponent from './components/MyComponent'

const client = new ApolloClient({
  networkInterface: createNetworkInterface({ uri: 'http://localhost:8888/graphql' }),
})

render(
  <ApolloProvider client={client}>
    <MyComponent />
  </ApolloProvider>,
  document.getElementById('root')
)