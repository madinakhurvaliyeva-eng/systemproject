const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data.json');

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function createInitialData() {
  return {
    counters: {
      users: 3,
      passwordResets: 0,
    },
    users: [
      {
        id: 1,
        full_name: 'Project Owner Demo',
        email: 'owner@madinaga.demo',
        password: '$2a$10$0xHEYxkQv/DZwqRQF6YfzOJGTFipWKDUKFhq5zGMviNIJbpSVXC4a',
        created_at: '2026-04-05T10:00:00.000Z',
      },
      {
        id: 2,
        full_name: 'Collaborator One Demo',
        email: 'collab1@madinaga.demo',
        password: '$2a$10$LRlOHa14.mF/9BDoxGxhXuzRK4MizevoWtaLb0216Fl4l.CGA3dA2',
        created_at: '2026-04-05T10:00:00.000Z',
      },
      {
        id: 3,
        full_name: 'Collaborator Two Demo',
        email: 'collab2@madinaga.demo',
        password: '$2a$10$2kW.cqC.IuOdjGkuc9e22evAMktPQV8W5Wrs9OAyDcXSfNYMbAMj6',
        created_at: '2026-04-05T10:00:00.000Z',
      },
    ],
    passwordResets: [],
  };
}

function ensureDataFile() {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify(createInitialData(), null, 2));
  }
}

function readData() {
  ensureDataFile();

  const raw = fs.readFileSync(dbPath, 'utf8');
  if (!raw.trim()) {
    const initialData = createInitialData();
    fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
    return initialData;
  }

  const parsed = JSON.parse(raw);

  return {
    counters: {
      users: Number(parsed?.counters?.users || 0),
      passwordResets: Number(parsed?.counters?.passwordResets || 0),
    },
    users: Array.isArray(parsed?.users) ? parsed.users : [],
    passwordResets: Array.isArray(parsed?.passwordResets) ? parsed.passwordResets : [],
  };
}

function writeData(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

function mutateData(mutator) {
  const data = readData();
  const result = mutator(data);
  writeData(data);
  return result;
}

function getNextId(data, counterKey) {
  data.counters[counterKey] += 1;
  return data.counters[counterKey];
}

function createUserRecord(fullName, email, hashedPassword) {
  const normalizedEmail = normalizeEmail(email);

  return mutateData((data) => {
    const existingUser = data.users.find((user) => user.email === normalizedEmail);
    if (existingUser) {
      const error = new Error('User with this email already exists.');
      error.code = 'DUPLICATE_EMAIL';
      throw error;
    }

    const user = {
      id: getNextId(data, 'users'),
      full_name: fullName,
      email: normalizedEmail,
      password: hashedPassword,
      created_at: new Date().toISOString(),
    };

    data.users.push(user);
    return user;
  });
}

function findUserByEmail(email) {
  const normalizedEmail = normalizeEmail(email);
  return readData().users.find((user) => user.email === normalizedEmail);
}

function findUserById(id) {
  return readData().users.find((user) => user.id === Number(id));
}

function savePasswordReset(email, token, expiresAt) {
  const normalizedEmail = normalizeEmail(email);

  return mutateData((data) => {
    data.passwordResets = data.passwordResets.filter((record) => record.email !== normalizedEmail);

    const passwordReset = {
      id: getNextId(data, 'passwordResets'),
      email: normalizedEmail,
      token,
      expires_at: expiresAt,
      used: 0,
      created_at: new Date().toISOString(),
    };

    data.passwordResets.push(passwordReset);
    return passwordReset;
  });
}

function findPasswordResetByToken(token) {
  return readData().passwordResets.find((record) => record.token === token && record.used === 0);
}

function updateUserPasswordByEmail(email, hashedPassword) {
  const normalizedEmail = normalizeEmail(email);

  return mutateData((data) => {
    const user = data.users.find((entry) => entry.email === normalizedEmail);
    if (!user) {
      return undefined;
    }

    user.password = hashedPassword;
    return user;
  });
}

function markPasswordResetUsed(token) {
  return mutateData((data) => {
    const record = data.passwordResets.find((entry) => entry.token === token);
    if (!record) {
      return undefined;
    }

    record.used = 1;
    return record;
  });
}

module.exports = {
  createUserRecord,
  findPasswordResetByToken,
  findUserByEmail,
  findUserById,
  markPasswordResetUsed,
  savePasswordReset,
  updateUserPasswordByEmail,
};
