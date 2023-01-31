-- Active: 1675187357836@@127.0.0.1@3306
CREATE TABLE videos(
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        title TEXT UNIQUE NOT NULL,
        duration INTEGER NOT NULL,
        upload_data TEXT DEFAULT (DATETIME()) NOT NULL
);
DROP TABLE videos;
INSERT INTO videos (id, title, duration)
VALUES
("v001", "How to get a better performance on Front-End", 1200),
("v002", "Improving on Back-End", 900),
("v003", "video3", 850),
("v004", "video4", 500);

SELECT * FROM videos;