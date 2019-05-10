const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
const isAuth = require('./middleware/is-auth');

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');

const {
  buildSchema
} = require('graphql');

const app = express();

app.use(bodyParser.json());

// 允许跨域请求
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(isAuth);


app.use(
  '/graphql',
  graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
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


# resolvers/index_1.js中使用了async/await 报错
# query {
#   events {
#     title
#     date
#     creator {
#       email
#       createdEvents {
#         price
#       }
#     }
#   }
# }


# query {
#   events {
#     title
#     date
#     creator {
#       email
      
#     }
#   }
# }


# 新增商品
# mutation {
#   createEvent(eventInput: { title: "这是第四个商品", description: "第四个商品描述", price: 111.44, date: "2019-05-01T10:14:48.114Z"}) {
#     creator{
#       email
#     }
#   }
# }

# 新增用户
# mutation {
#   createUser(userInput: {email: "bbbbb@qq.com", password: "123456"}) {
#     _id
#   }
# }

*/