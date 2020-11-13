const { assert } = require('chai');

const { getUserByEmail } = require('../helperFunctions/getUserByEmail.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {

    const user = getUserByEmail("user@example.com", testUsers);

    const expectedOutput = { id: "userRandomID", email: "user@example.com", password: "purple-monkey-dinosaur" };

    assert.deepEqual(user, expectedOutput);
  });

  it('should return a undefined if no e-mail in the data base', function() {

    const user = getUserByEmail("user3@example.com", testUsers);

    const expectedOutput = undefined;
    
    assert.deepEqual(user, expectedOutput);
  });

  it('should return undefined if no e-mail is passed', function() {

    const user = getUserByEmail("", testUsers);
    
    const expectedOutput = undefined;
    
    assert.deepEqual(user, expectedOutput);
  });
});
