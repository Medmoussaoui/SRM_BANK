CREATE TABLE withdrawRecords(
    recordId INT NOT NULL AUTO_INCREMENT,
    accountId INT NOT NULL,
    badget FLOAT NOT NULL,
    operationDate DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    bankId INT,
    PRIMARY KEY (recordId),
    FOREIGN KEY(accountId) REFERENCES clients(accountId)
);

CREATE TABLE Recievedrecords (
    recordId INT NOT NULL AUTO_INCREMENT,
    accountId INT NOT NULL,
    badget FLOAT NOT NULL,
    operationDate DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    bankId INT,
    senderId INT NOT NULL,
    PRIMARY KEY (recordId),
    FOREIGN KEY(accountId) REFERENCES clients(accountId),
    FOREIGN KEY(senderId) REFERENCES clients(accountId)
);

CREATE TABLE depositRecords(
    recordId INT NOT NULL AUTO_INCREMENT,
    accountId INT NOT NULL,
    badget FLOAT NOT NULL,
    operationDate DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    bankId INT,
) 