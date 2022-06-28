-- Table containing users and their crypted passwords
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password CHAR(60)
);
-- Contains generated qr codes with link data, views and actual qr code in base64 format
CREATE TABLE QRcodes (
  qrId TEXT PRIMARY KEY,
  comment TEXT NOT NULL,
  linksTo TEXT NOT NULL,
  created TIMESTAMP NOT NULL DEFAULT now(),
  updated TIMESTAMP,
  ownedBy SERIAL,
  qrCode TEXT NOT NULL,
  views INT DEFAULT 0,
  FOREIGN KEY (ownedBy) REFERENCES users(id) ON DELETE CASCADE
);
-- Table with recording of each qr code click and date of click
CREATE TABLE viewsHistory (
  id SERIAL PRIMARY KEY,
  qrId TEXT,
  viewedAt TIMESTAMP NOT NULL DEFAULT now(),
  FOREIGN KEY (qrId) REFERENCES QRcodes(qrId) ON DELETE CASCADE
);
-- Table with recording of each edit to the QR code
CREATE TABLE editHistory (
  id SERIAL PRIMARY KEY,
  qrId TEXT,
  linksTo TEXT,
  comment TEXT,
  fromDate TIMESTAMP NOT NULL DEFAULT now(),
  toDate TIMESTAMP NOT NULL DEFAULT now(),
  FOREIGN KEY (qrId) REFERENCES QRcodes(qrId) ON DELETE CASCADE
);