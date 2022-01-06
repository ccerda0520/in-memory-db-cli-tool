#! /usr/bin/env node

const readline = require('readline');
const Database = require('./database');

const db = new Database();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', function(cmd) {
  exec(cmd.match(/\S+/g) || []);
});

function prompt() {
  var arrow    = '>> ', 
  length = arrow.length;

  rl.setPrompt(arrow, length);
  rl.prompt();
}

function exec(cmd) {
  const action = cmd[0];
  if(action) {
    action.toLowerCase();
  }

  switch (action) {
    case 'get':
      if (cmd.length !== 2) {
        console.log('Incorrect use of GET. enter "help" for more assistance.')
        break;
      }

      var value;
      if(db.transactionBlocks.length !== 0) {
        value = db.getActive(cmd[1]);
      } else {
        value = db.get(cmd[1]);
      }

      if(typeof(value) === 'undefined' || value === null) {
        console.log('NULL');
        break;
      }

      console.log(value);
      break;
    case 'set':
      if (cmd.length !== 3) {
        console.log('Incorrect use of SET. enter "help" for more assistance.')
        break;
      }
      
      if(db.transactionBlocks.length !== 0) {
        db.assign(cmd[1], cmd[2]);
      } else {
        db.set(cmd[1], cmd[2]);
      }
      
      break;
    case 'delete':
      if (cmd.length !== 2) {
        console.log('Incorrect use of DELETE. enter "help" for more assistance.')
        break;
      }
      
      if(db.transactionBlocks.length !== 0) {
        db.assign(cmd[1], null);
      } else {
        db.delete(cmd[1]);
      }
      
      break;
    case 'begin':
      if (cmd.length !== 1) {
        console.log('Incorrect use of BEGIN. enter "help" for more assistance.')
        break;
      }
      
      db.begin();
      break;
    case 'rollback':
      if (cmd.length !== 1) {
        console.log('Incorrect use of ROLLBACK. enter "help" for more assistance.')
        break;
      }
      
      const rollbackSuccess = db.rollback();
      if(!rollbackSuccess) {
        console.log('TRANSACTION NOT FOUND');
      }
      break;
    case 'commit':
      if (cmd.length !== 1) {
        console.log('Incorrect use of COMMIT. enter "help" for more assistance.')
        break;
      }
      
      db.commit();
      break;
    case 'count':
      if (cmd.length !== 2) {
        console.log('Incorrect use of COUNT. enter "help" for more assistance.')
        break;
      }
      
      var count = db.count(cmd[1]);

      console.log(count);
      break;
    case 'end': 
      rl.close();
      process.exit(0);
      break;
    case 'help':
      console.log(`List of commands:
      SET [name] [value] // Sets the name in the database to the given value
      GET [name] // Prints the value for the given name. If the value is not in the database, prints NULL
      DELETE [name] // Deletes the value from the database
      COUNT [value] // Returns the number of names that have the given value assigned to them. If that value is not assigned anywhere, prints 0
      END // Exits the database
      BEGIN // Begins a new transaction
      ROLLBACK // Rolls back the most recent transaction. If there is no transaction to rollback, prints TRANSACTION NOT FOUND
      COMMIT // Commits all of the open transactions`);  
      break;
    default:
      console.log('Enter a valid command.');
  }
  
  prompt();
}

prompt();