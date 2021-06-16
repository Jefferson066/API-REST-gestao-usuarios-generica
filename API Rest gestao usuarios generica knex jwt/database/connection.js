const knex = require('knex')({
    client: 'mysql2',
    connection: {
      host : '127.0.0.1', // seu host
      user : 'root', // seu user
      password : '', //sua senha 
      database : 'apiusers'
    }
  });

module.exports = knex