const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const {
  buildSchema
} = require('graphql');


const app = express();
app.use(bodyParser.json());

app.use(
  '/graphql',
  graphqlHttp({
    schema: buildSchema(`
    type RootQuery {
      events: [String!]!
    }

    type RootMutation {
      createEvent(name: String): String
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
    rootValue: {
      events: () => {
        return ['艾斯', '路飞', '索罗'];
      },
      createEvent: (args) => {
        const eventName = args.name;
        return eventName;
      }
    },
    graphiql: true
  }));

app.listen(4000, () => {
  console.log('http://localhost:4000')
})

/* 
测试语句
query {
  events
}

mutation {
  createEvent(name: "路飞") 
}


*/