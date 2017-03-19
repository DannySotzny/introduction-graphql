import React, { PropTypes } from 'react'
import { render } from 'react-dom'
import { ApolloProvider, ApolloClient, createNetworkInterface } from 'react-apollo'
import { gql, graphql } from 'react-apollo'

const client = new ApolloClient({
  networkInterface: createNetworkInterface({ uri: 'http://localhost:8888/graphql' }),
})

class MyComponent extends React.Component {
  state = {
    typeContent: 0,
  }

  doSomething () {
    this.props.mutate({
      variables: { input: { type: this.state.typeContent } },
      refetchQueries: [{ query: FetchCallsQuery }],
    })
    .then((data) => alert('done'))
    .catch(error => alert('there was an error sending the query', error));
  }

  render () {
    return (
      <div>
        <h1>Simple GraphQL query result with React + Apollo</h1>
        <input type="text" onBlur={e => this.setState({ typeContent: parseInt(e.target.value), })} />
        <button onClick={() => this.doSomething()}>Insert Call!</button>
        <pre>
          {JSON.stringify(this.props, null, 4)}
        </pre>
      </div>
    )
  }
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

const MyMutation = gql`mutation insert_call($input: CallInput) {
  upsertCall(input: $input) {
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