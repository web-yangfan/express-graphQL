const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const Event = require('./models/events')

const {
  buildSchema
} = require('graphql');

const app = express();

app.use(bodyParser.json());

app.use(
  '/graphql',
  graphqlHttp({
    schema: buildSchema(`

    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    input EventInput {
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    type RootQuery {
      events: [Event!]!
    }

    type RootMutation {
      createEvent(eventInput: EventInput): Event
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
    rootValue: {
      events: () => {
        return Event.find()
          .then(events => {
            return events.map(evnet => {
              return {
                ...evnet._doc
              }
            })
          })
          .catch(err => {
            throw err;
          })
      },
      createEvent: (args) => {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date)
        })
        return event
          .save()
          .then(result => {
            return {
              ...result._doc
            };
          })
          .catch(err => {
            console.log(err);
            throw err
          });
      }
    },
    graphiql: true
  }));

mongoose.connect('mongodb://localhost/graphQL_DB2', {
  useNewUrlParser: true
}).then(() => {
  app.listen(4000, () => {
    console.log('http://localhost:4000')
  })
}).catch(err => {
  console.log(err);
})



/* 
测试语句
mutation {
  createEvent (eventInput: {
    title: "测试商品三",
    description: "这是第三个测试商品",
    price: 229.99,
    date: "2019-04-30T21:03:17.123Z"
  }) {
  	title,
    description,
    price,
    date
  }
}



query {
  events {
    title
    _id
  }
}

*/