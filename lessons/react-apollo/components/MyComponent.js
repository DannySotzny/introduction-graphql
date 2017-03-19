import clonedeep from 'lodash.clonedeep'
import React from 'react'
import { gql, graphql } from 'react-apollo'
import { FetchCallsQuery, MyMutation, CallsChangedSubscription } from '../queries/CallQueries'

class MyComponent extends React.Component {
  static propTypes = {
    mutate: React.PropTypes.func.isRequired,
  }

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

  componentDidMount () {
    this.props.data.subscribeToMore({
      document: CallsChangedSubscription,
      updateQuery: (previousData, { subscriptionData }) => {
        const result = clonedeep(previousData)
        console.log(JSON.stringify(subscriptionData, null , 4))
        return result
      },
    })
  }

  render () {
    return (
      <div>
        <h1>Simple GraphQL query result with React + Apollo</h1>
        <input type="text" onBlur={e => this.setState({ typeContent: parseInt(e.target.value), })} />
        <button onClick={() => this.doSomething()}>Insert Call!</button>

        {
          this.props.data.allCalls &&
          this.props.data.allCalls.map(x => <div key={x.id}>{x.type}</div>)
        }
        <pre>
          {JSON.stringify(this.props, null, 4)}
        </pre>
      </div>
    )
  }
}

export default graphql(FetchCallsQuery, {options: {pollInterval: 100000}})(graphql(MyMutation)(MyComponent))

