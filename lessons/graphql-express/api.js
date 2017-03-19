const express = require('express');
const expressGraphQLSubscriptionsWebSocketTransport = require('subscriptions-transport-ws');
const expressCORS = require('cors');
const expressGraphQL = require('express-graphql');
const schema = require('../graphql-runtime-schema/schema');
const uuid = require('uuid');
const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
const stephan = new PouchDB('stephan');
stephan
.sync('http://138.68.102.192:5984/stephan', {live: true, continuous: true})
.on('change', msg => console.log(msg));

const app = express();
app.use(expressCORS());

const mapToReal = doc => {
  const result = Object.assign({}, doc);
  result.id = doc._id;
  result.rev = doc._rev;  
  return result;
}

const loader = (partition) => {
  const database = {
    calls: {
      upsert: input => stephan.put(Object.assign({_id: input.id || uuid.v1(), _rev: input.rev, $type: 'Call'}, input)).then(data => Object.assign(data, input)),
      remove: input => stephan.remove({_id: input.id, _rev: input.rev}).then(data => input),
      find: () => stephan.find({selector: {$type: 'Call'}}).then(data => data.docs.map(mapToReal)),
    },
    eskalationen: {
      find: () => stephan.find({selector: {$type: 'Escalation'}}).then(data => data.docs.map(mapToReal)),
      findByCallId: callId => stephan.find({selector: {$type: 'Escalation', callId }}).then(data => data.docs.map(mapToReal)),
    },
  };

  return database[partition] || Promise.resolve([]);
}

app.use('/graphql', expressGraphQL({
  schema: schema.schema,
  graphiql: true,
  pretty: true,
  context: { loader },
}));

let server = undefined;
module.exports = () => ({
  start: ({port}) => {
    return new Promise(resolve => {
      server = app.listen(port, () => {      
        new expressGraphQLSubscriptionsWebSocketTransport.SubscriptionServer({
          onSubscribe: (msg, params) => Object.assign({}, params, { context: { loader } }),
          subscriptionManager: schema.subscriptionManager,
          }, { server, path: '/graphql', }
        );
        resolve(server);
      });
    });
  },
  stop: () => new Promise(resolve => server.close(() => resolve())),
});


