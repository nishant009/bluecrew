CREATE TABLE cat
(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR (50) NOT NULL,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    breed VARCHAR(50),
    imageUrl VARCHAR(255),
    addedAt DATE NOT NULL,
    lastSeenAt DATE NOT NULL,
    birthDate DATE,
    weight FLOAT NOT NULL,
    PRIMARY KEY(id),
    INDEX(name),
    INDEX(username)
);
