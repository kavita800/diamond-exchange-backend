require('rootpath')();
const express = require('express')

// Sessions can be stored server-side (ex: user auth) or client-side
// (ex: shopping cart). express-session saves sessions in a store, and
// NOT in a cookie. To store sessions in a cookie, use cookie-session.
const session = require('express-session')

// The default in-memory store is not production-ready because it leaks
// memory and doesn't scale beyond once process. For production, we need
// a session store, like Redis, which we can wire up with connect-redis.
const RedisStore = require('connect-redis')(session)

// As of v4, connect-redis no longer ships with a default Redis client.
// You can continue using the redis package or switch to ioredis which
// has more features and better maintenance.
const Redis = require('ioredis')

const app = express()

// Redis is a key-value NoSQL data store. It's perfect for sessions,
// because they can be serialized to JSON and stored temporarily using
// SETEX to auto-expire (i.e. auto-remove) after maxAge in seconds.
const client = new Redis({
  // host: 'localhost', // already the default
  bind:'0.0.0.0',
  password: 'secret'
})

const store = new RedisStore({ client })
 


const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('_helpers/jwt');
const errorHandler = require('_helpers/error-handler');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.set('trust proxy', 1) // trust first proxy
app.use(
    session({
  
    
      store,
  
    
      name: 'sid',
  
     
  
     
      resave: false,
  
  
      
      secret: `quiet, pal! it's a secret!`,
  
    
      
    })
  )
// use JWT auth to secure the api
//app.use(jwt());

// api routes
app.use('/api', require('./users/users.controller'));

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});


