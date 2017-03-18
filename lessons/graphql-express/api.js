const express = require('express');
const expressCORS = require('cors');
const expressGraphQL = require('express-graphql');
const schema = require('../graphql-runtime-schema/schema');
const uuid = require('uuid');
const PouchDB = require('pouchdb');
const stephan = new PouchDB('stephan');

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
      upsert: input => stephan.put(Object.assign({_id: input.id || uuid.v1(), _rev: input.rev}, input)).then(data => Object.assign(data, input)),
      remove: input => stephan.remove({_id: input.id, _rev: input.rev}).then(data => input),
      find: () => stephan.allDocs({include_docs: true}).then(data => data.rows.map(x => mapToReal(x.doc))),
    },
    eskalationen: Promise.resolve([
      {id: 1, description: 'foo', callId: 45},
      {id: 2, description: 'bar', callId: 1},
    ]),
  };

  return database[partition] || Promise.resolve([]);
}

app.use('/graphql', expressGraphQL({
  schema: schema,
  graphiql: true,
  pretty: true,
  context: { loader },
}));

let server = undefined;
module.exports = () => ({
  start: ({port}) => new Promise(resolve => server = app.listen(port, () => resolve(server))),
  stop: () => new Promise(resolve => server.close(() => resolve())),
});