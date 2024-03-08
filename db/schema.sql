-- schema
DROP DATABASE IF EXISTS movies_db;
CREATE DATABASE movies_db;
USE movies_db;

DROP TABLE IF EXISTS movies;
DROP TABLE IF EXISTS reviews;
CREATE TABLE movies (
    id INT AUTO_INCREMENT PRIMARY KEY ,
    movie_name VARCHAR(100)
);
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    movie_id INT,
    review TEXT,
    FOREIGN KEY (movie_id) REFERENCES movies(id)
);

-- seeds
INSERT INTO movies (movie_name) VALUES 
    ('Star Wars'),
    ('Indiana Jones'),
    ('Lord of the Rings');
INSERT INTO reviews (movie_id, review) VALUES 
    (1, 'Could have used more stars.'),
    (2, 'Would have appreciated more snakes.'),
    (3, 'More rings please.'),
    (3, 'Too many rings!');

