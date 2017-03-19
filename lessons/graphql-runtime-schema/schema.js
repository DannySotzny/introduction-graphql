const fs = require('fs');
const path = require('path');
const graphqlTools = require('graphql-tools');
const definition = fs.readFileSync(path.join(__dirname, 'schema.graphql'));

module.exports = graphqlTools.makeExecutableSchema({
  typeDefs: definition.toString(),
  resolvers: resolve(),
});

function resolve () {
    return resolvers = {
      Escalation: {
        id: (source, args, context, info) => source.id,
        description: (source, args, context, info) => source.description,
      },
      Call: {
        eskalationen: (source, args, context, info) => context.loader('eskalationen').findByCallId(source.id),
      },
      Query: {
        allCalls: (source, args, context, info) => context.loader('calls').find(),
      },
      Mutation: {
        upsertCall: (source, args, context, info) => context.loader('calls').upsert(args.input),
        deleteCall: (source, args, context, info) => context.loader('calls').remove(args.input),
      },
      Subscription: {
        upsertedCall: {
          
        }
      }
    };
}

function fetchEscalationsByCallId(data, callId) {
  return Promise.resolve(data.filter(x => x.callId === callId));
}