import React, { PropTypes } from 'react'
import { render } from 'react-dom'
import { ApolloProvider, ApolloClient, createNetworkInterface } from 'react-apollo'
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws'
import MyComponent from './components/MyComponent'

const httpClient = createNetworkInterface({ uri: 'http://localhost:8888/graphql' })
const wsClient = new SubscriptionClient('ws://localhost:8888/graphql')
const client = new ApolloClient({
  networkInterface: addGraphQLSubscriptions(httpClient, wsClient)
})

render(
  <ApolloProvider client={client}>
    <MyComponent />
  </ApolloProvider>,
  document.getElementById('root')
)