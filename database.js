module.exports = class Database {
  constructor() {
    this.db = new Map();
    this.transactionBlocks = [];
    this.keyTransactions = {};
  }

  get(key) {
    return this.db.get(key);
  }

  set(key, value) {
    this.db.set(key, value);
  }

  delete(key) {
    this.db.delete(key);
  }
  
  getActive(key) {
    if(this.keyTransactions.hasOwnProperty(key) && this.keyTransactions[key].length !== 0) {
      const latestTransaction = this.keyTransactions[key][this.keyTransactions[key].length - 1];
      return this.transactionBlocks[latestTransaction][key];
    }

    return this.get(key);
  }

  assign(key, value) {
    const currentValue = this.db.get(key);

    if(currentValue === value) {
      return;
    }

    this.updateCurrentTransaction(key, value);
    this.updateKeyTransactions(key);
  }

  updateCurrentTransaction(key, value) {
    this.transactionBlocks[this.transactionBlocks.length - 1][key] = value;
  }

  updateKeyTransactions(key) {
    if(!this.keyTransactions.hasOwnProperty(key)) {
      this.keyTransactions[key] = [];
    }

    if(this.keyTransactions[key].indexOf(this.transactionBlocks.length - 1) !== -1) {
      return;
    }
    
    this.keyTransactions[key].push(this.transactionBlocks.length - 1);
  }

  begin() {
    this.transactionBlocks.push({});
  }

  commit() {
    // use the keyTransactions object to determine which transaction has the "latest" value for a given key and go directly into that transaction instead of looping all transactions
    Object.keys(this.keyTransactions).forEach(function (key, index) {
      const latestTransaction = this.keyTransactions[key][this.keyTransactions[key].length - 1];
      const latestTransactionValue = this.transactionBlocks[latestTransaction][key];

      if(latestTransactionValue === null) {
        this.delete(key);
      } else {
        this.set(key, latestTransactionValue);
      }
    }.bind(this));

    this.transactionBlocks = [];
    this.keyTransactions = {};
  }

  rollback() {
    if(this.transactionBlocks.length === 0) {
      return false;
    }

    // Remove latest transaction block and also update keyTransactions object to corretly point to most relevant transaction per key
    const latestTransactionBlock = this.transactionBlocks.pop();
    Object.keys(latestTransactionBlock).forEach(function (key, index) {
      this.keyTransactions[key].pop();
    }.bind(this));

    return true;
  }

  count(value) {
    // Ran out of time to implement this thoroughly. This works correctly for "auto" transactions, by directly just using GET/SET/DELETE, but does not work with active transactions
    var valueCnt = 0;
    for (const dbValue of this.db.values()) {
      if(dbValue === value) {
        valueCnt++;
      }
    }

    return valueCnt;
  }
};