'use strict';

const supergoose = require('@code-fellows/supergoose');
const server = require('../src/server.js');
const request= supergoose(server.app);

describe('Post to /signup should work', () => {
  it('Should create a new user', async()=> {
    let newEntry = {
      username: 'davee',
      password: 'daveesPassword',
    };
    let response = await request.post('/signup').send(newEntry);
    expect(response.status).toEqual(201);
  });
});

describe('Post to /signin should work', () => {
  it('Post to /signin should work with correct authorization', async() => {
    let newEntry = {
      username: 'davee',
      password: 'daveesPassword',
    };
    let firstSignUp = await request.post('/signup').send(newEntry);
    
  });
});