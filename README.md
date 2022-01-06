# In Memory DB Cli Tool

CLI Tool that creates an in-memory database with simple database features.

## Installation/Usage Instructions

This is a node cli application. Make sure you have node installed on your system to be able to run this.

```$xslt
cd in-memory-db-cli-tool

// You have a choice of either calling the index.js file using node directly like this:
npm i
node index.js // starts the cli
// OR install the package globally onto your computer and interact with it this way:
npm i -g
db-cli // starts the cli
```

After you install it using either method and open the application, you can begin interacting with it.

## Commands

The following commands are available in this cli tool:

```$xslt
SET [name] [value] // Sets the name in the database to the given value
GET [name] // Prints the value for the given name. If the value is not in the database, prints NULL
DELETE [name] // Deletes the value from the database
COUNT [value] // Returns the number of names that have the given value assigned to them. If that value is not assigned anywhere, prints 0
END // Exits the database
BEGIN // Begins a new transaction
ROLLBACK // Rolls back the most recent transaction. If there is no transaction to rollback, prints TRANSACTION NOT FOUND
COMMIT // Commits all of the open transactions
```
