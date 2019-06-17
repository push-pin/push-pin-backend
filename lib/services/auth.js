const { ManagementClient } = require('auth0');

const managementClient = new ManagementClient({
  clientId: process.env.AUTH0_MANAGEMENT_CLIENT_ID,
  clientSecret: process.env.AUTH0_MANAGEMENT_CLIENT_SECRET,
  domain: process.env.AUTH0_DOMAIN,
  audience: process.env.AUTH0_AUDIENCE,
  scope: 'read:users create:users'
});

const createAuth0User = (email, password) => {
  return managementClient.createUser({
    connection: 'Username-Password-Authentication',
    email,
    password
  });
};

module.exports = {
  createAuth0User
};
