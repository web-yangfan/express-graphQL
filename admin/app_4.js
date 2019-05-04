const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Event = require('./models/events');
const User = require('./models/user');

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

    type User {
      _id: ID!
      email: String!
      password: String!
    }

    input EventInput {
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    input UserInput {
      email: String!
      password: String!
    }

    type RootQuery {
      events: [Event!]!
      User: [User]!
    }

    type RootMutation {
      createEvent(eventInput: EventInput): Event
      createUser(userInput: UserInput): User
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
          date: new Date(args.eventInput.date),
          creator: '5cc8dc902226ab1ff64b3ae5'
        });
        let createdEvent;
        return event
          .save()
          .then(result => {
            createdEvent = { ...result._doc };
            // 查询这个用户是否存在，并返回结果数据
            return User.findById('5cc8dc902226ab1ff64b3ae5')
          })
          .then(user => {
            // 用户不存在
            if (!user) {
              throw new Error('没有这个用户');
            }
            // 把商品信息 id 保存到 user集合 createEvents 字段中
            user.createEvents.push(event);
            return user.save();
          })
          .then(result => {
            return createdEvent;
          })
          .catch(err => {
            console.log(err);
            throw err
          });
      },
      createUser: (args) => {
        // 检查email是否存在
        return User
          .findOne({
            email: args.userInput.email
          })
          .then(user => {
            if (user) {
              throw new Error('用户已经存在');
            }
            // 不存在返回加密后的密码
            return bcrypt.hash(args.userInput.password, 12);
          })
          .then(hashPasswod => {
            const user = User({
              email: args.userInput.email,
              password: hashPasswod
            });
            return user.save();
          })
          .then(result => {
            return {
              ...result._doc,
              _id: result.id
            };
          })
          .catch(err => {
            throw err
          })

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
  createUser(userInput: {email: "test@qq.com", password: "2222222"}) {
    email
    password
    _id
  }
}

mutation {
  createEvent(eventInput: {title: "测试商品一", description: "这是测试商品", price: 44.99, date: "2019-05-01T00:01:20.377Z"}) {
    title
    description
  	_id,
    date
  }
}
*/