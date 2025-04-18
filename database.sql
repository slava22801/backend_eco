create TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    surname VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    role VARCHAR(255)
);

CREATE TABLE refresh_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  token TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

create TABLE products(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    price INTEGER,
    content TEXT,
    img TEXT
);

CREATE TABLE revoked_tokens (
  id SERIAL PRIMARY KEY,
  token TEXT UNIQUE,
  revoked_at TIMESTAMP DEFAULT NOW()
);