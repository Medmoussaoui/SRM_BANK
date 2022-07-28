CREATE TABLE PullAndPutRecords( 
    recordId INT NOT NULL ,
    accountId INT NOT NULL,
    badget FLOAT NOT NULL,
    bandkId INT NOT NULL,
    PRIMARY KEY(recordId),
    FOREIGN KEY(accountId) REFERENCES clients(accountId)
);

CREATE TABLE SendTransferRecords (
    recordId INT NOT NULL AUTO_INCREMENT,
    senderId INT NOT NULL,
    recieverId INT NOT NULL,
    badget FLOAT NOT NULL,
    PRIMARY KEY (recordId),
    FOREIGN KEY(senderId) REFERENCES clients(accountId),
    FOREIGN KEY(recieverId) REFERENCES clients(accountId)
);

CREATE TABLE ReceiveTransferRecords (
    recordId INT NOT NULL AUTO_INCREMENT, 
    recieverId INT NOT NULL,
    senderId INT NOT NULL,
    badget FLOAT NOT NULL,
    PRIMARY KEY (recordId),
    FOREIGN KEY(senderId) REFERENCES clients(accountId),
    FOREIGN KEY(recieverId) REFERENCES clients(accountId)
);

CREATE TABLE Notifications(
    notifyId INT NOT NULL AUTO_INCREMENT,
    recordId INT NOT NULL,
    accountId INT NOT NULL,
    date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    recordType VARCHAR(20) NOT NULL,
    isVisit TINYINT NOT NULL DEFAULT 0,
    PRIMARY KEY(notifyId),
    FOREIGN KEY(recordId) REFERENCES SendTransferRecords(recordId),
    FOREIGN KEY(recordId) REFERENCES ReceiveTransferRecords(recordId),
    FOREIGN KEY(recordId) REFERENCES PullAndPutRecords(recordId),
    FOREIGN KEY(accountId) REFERENCES clients(accountId)
);