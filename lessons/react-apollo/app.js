import React, { PropTypes } from 'react'
import { render } from 'react-dom'
import { ApolloProvider, ApolloClient, createNetworkInterface } from 'react-apollo'
import { gql, graphql } from 'react-apollo'

const client = new ApolloClient({
  networkInterface: createNetworkInterface({ uri: 'http://localhost:8888/graphql' }),
})

const MyComponent = props => {

  const doSomething = props => {
    props.mutate({ variables: { input: 'Hello World' } })
    .then(({data}) => alert(`got data ${data.upsertCall}`))
    .catch(error => alert('there was an error sending the query', error));
  }

  return (
    <div>
      <h1>Simple GraphQL query result with React + Apollo</h1>
      <button onClick={() => doSomething(props)}>Insert Call!</button>
      <pre>
        {JSON.stringify(props, null, 4)}
      </pre>
    </div>
  )
}

const FetchCallsQuery = gql`query fetch_all_calls {
  allCalls {
		id
    rev
    type
    eskalationen {
      id
      description
    }
  }
}`
const MyComponentWithData = graphql(FetchCallsQuery)(MyComponent)

const MyMutation = gql`mutation insert_call {
  upsertCall(input: {type: 9999}) {
    id
    rev
    type
    eskalationen {
      description
    }
  }
}`
const MyComponentWithMutation = graphql(MyMutation)(MyComponent)

const MyComponentWithDataAndMutation = graphql(FetchCallsQuery)(graphql(MyMutation)(MyComponent))

MyComponentWithMutation.propTypes = {
  mutate: PropTypes.func.isRequired,
}

render(
  <ApolloProvider client={client}>
    <MyComponentWithDataAndMutation />
  </ApolloProvider>,
  document.getElementById('root')
)