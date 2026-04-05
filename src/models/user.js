const {
  createUserRecord,
  findUserByEmail,
  findUserById,
} = require('../db');

function toPublicUser(user) {
  if (!user) {
    return undefined;
  }

  return {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    created_at: user.created_at,
  };
}

function createUser(fullName, email, hashedPassword) {
  const user = createUserRecord(fullName, email, hashedPassword);
  return toPublicUser(user);
}

function findByEmail(email) {
  return findUserByEmail(email);
}

function findById(id) {
  return toPublicUser(findUserById(id));
}

module.exports = {
  createUser,
  findByEmail,
  findById,
};
