import { gql } from 'react-apollo'

export const FetchCallsQuery = gql`query fetch_all_calls {
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

export const MyMutation = gql`mutation insert_call($input: CallInput) {
  upsertCall(input: $input) {
    id
    rev
    type
    eskalationen {
      description
    }
  }
}`

export const CallsChangedSubscription = gql`subscription upserted_call {
  upsertedCall {
    id
    rev
    type
    eskalationen {
      id
      description
    }
  }
}`
