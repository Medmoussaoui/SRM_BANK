CREATE TABLE clients (
    accountId INT NOT NULL AUTO_INCREMENT,
    email VARCHAR(40) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY(accountId)
);

CREATE TABLE accountInfo(
    accountId INT NOT NULL,
    registerDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    fullname VARCHAR(30) NOT NULL,
    birthDay DATE NOT NULL,
    address VARCHAR(255),
    balance FLOAT DEFAULT 0.0,
    PRIMARY KEY(accountId),
    FOREIGN KEY(accountId) REFERENCES clients(accountId)
);

CREATE TABLE contactInfo (
    contactId INT NOT NULL AUTO_INCREMENT,
    accountId INT NOT NULL,
    contactName VARCHAR(20),
    contactValue VARCHAR(20),
    PRIMARY KEY(contactId),
    FOREIGN KEY(accountId) REFERENCES clients(accountId)
);

CREATE TABLE creditCards (
    accountId INT NOT NULL,
    cardNumber VARCHAR(16) NOT NULL,
    cvcCode VARCHAR(3) NOT NULl,
    exprerationDate DATE NOT NULL,
    PRIMARY KEY(cardNumber),
    FOREIGN KEY(accountId) REFERENCES clients(accountId)
)