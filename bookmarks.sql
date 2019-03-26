drop table if exists bookmarks; 

create table bookmarks (
    id INTEGER PRIMARY KEY, 
    title text NOT NULL, 
    link text NOT NULL, 
    rating numeric(1, 0) DEFAULT NULL,    
    descript text DEFAULT NULL
); 

insert into bookmarks (title, link, rating, descript)
values 
    ('Github', 'http://www.github.com', 4, 'brings together the largest community of developers.'), 
    ('Youtube', 'http://www.youtube.com', 4, 'Enjoy the videos and music you love, upload original content, and share it all with friends, family, and the world on YouTube.'), 
    ('Gmail', 'http://www.gmail.com', 4, 'Gmail is email that is intuitive, efficient, and useful.'), 
    ('Codeacademy', 'http://www.codeacademy.com', DEFAULT, DEFAULT), 
    ('LinkedIn', 'http://www.linkedin.com', DEFAULT, DEFAULT), 
    ('DarkSky', 'https://darksky.net', 5, 'Dark Sky is the most accurate source of hyperlocal weather information'), 
    ('Thinkful', 'https://dashboard.thinkful.com', 5, DEFAULT), 
    ('Slack', 'https://slack.com', DEFAULT, DEFAULT), 
    ('Google Drive', 'https://drive.google.com', DEFAULT, DEFAULT), 
    ('Trello', 'https://trello.com/en', DEFAULT, DEFAULT), 
    ('Washington Post', 'https://www.washingtonpost.com', DEFAULT, DEFAULT); 

SELECT * FROM bookmarks; 