CREATE TABLE users
(
  "userid" serial PRIMARY KEY,
  "username" varchar NOT NULL CHECK ( username  <> ''),
  "firstname" varchar NOT NULL CHECK ( firstname  <> ''),
  "lastname" varchar NOT NULL CHECK ( lastname  <> ''),
  "profilephoto" varchar NOT NULL,
  UNIQUE ( username )
);

SELECT setval('users_userid_seq', 1, false);
-- SELECT setval('users_userid_seq', max(userid))
-- FROM users;

CREATE TABLE events
(
  "eventid" SERIAL PRIMARY KEY,
  "eventtitle" varchar NOT NULL CHECK ( eventtitle  <> ''),
  "eventdate" date NOT NULL,
  "eventstarttime" time NOT NULL,
  "eventendtime" time NOT NULL,
  -- EVENTLOCATION INCLUDES INGREDIENTS
  "eventlocation" varchar NOT NULL CHECK ( eventlocation  <> ''),
  "eventdetails" varchar NOT NULL CHECK ( eventdetails  <> ''),
  "eventownerid" bigint NOT NULL,
  "eventownerusername" varchar NOT NULL,
  -- "eventattendees" varchar ARRAY,
  "eventmessages" varchar
  ARRAY,
  "eventtype" varchar NOT NULL,
  UNIQUE
  ( eventtitle ),
  FOREIGN KEY
  (eventownerid) REFERENCES users
  (userid),
  FOREIGN KEY
  (eventownerusername) REFERENCES users
  (username)
);
  SELECT setval('events_eventid_seq', 1, false);
  -- SELECT setval('events_eventid_seq', max(eventid))
  -- FROM events;


  CREATE TABLE usersandevents
  (
    "uselessid" serial PRIMARY KEY,
    "userid" bigint NOT NULL,
    "username" varchar NOT NULL,
    "eventid" bigint NOT NULL,
    "eventtitle" varchar NOT NULL,
    "eventdate" varchar NOT NULL,
    "eventstarttime" varchar NOT NULL,
    "eventendtime" varchar NOT NULL,
    "eventdetails" varchar NOT NULL,
    "eventlocation" varchar NOT NULL,
    UNIQUE (username, eventtitle),
    FOREIGN KEY ( userid ) REFERENCES users ( userid ),
    FOREIGN KEY ( username ) REFERENCES users( username ),
    FOREIGN KEY ( eventid ) REFERENCES events ( eventid ),
    FOREIGN KEY ( eventtitle ) REFERENCES events ( eventtitle )
  );
  SELECT setval('usersandevents_uselessid_seq', 1, false);


  CREATE TABLE eventsandmessages
  (
    "uselessid" serial PRIMARY KEY,
    "userid" bigint NOT NULL,
    "username" varchar NOT NULL,
    "eventid" bigint NOT NULL,
    "eventtitle" varchar NOT NULL,
    "messagetext" varchar,
    "messagedate" date NOT NULL,
    "messagetime" time NOT NULL,
    FOREIGN KEY ( userid ) REFERENCES users ( userid ),
    FOREIGN KEY ( username ) REFERENCES users ( username ),
    FOREIGN KEY ( eventid ) REFERENCES events ( eventid ),
    FOREIGN KEY ( eventtitle ) REFERENCES events ( eventtitle )
  );
  SELECT setval('eventsandmessages_uselessid_seq', 1, false);

  CREATE TABLE recipes
  (
    "uselessid" serial PRIMARY KEY,
    "recipename" varchar NOT NULL,
    "recipeid" bigint NOT NULL,
    "recipeimage" varchar,
    UNIQUE (recipeid)
  );
  SELECT setval('recipes_uselessid_seq', 1, false);


  CREATE TABLE ingredients
  (
    "uselessid" serial PRIMARY KEY,
    "ingredientname" varchar NOT NULL,
    "ingredientid" bigint NOT NULL,
    "ingredientimage" varchar,
    "recipeid" bigint NOT NULL,
    UNIQUE (ingredientid),
    FOREIGN KEY ( recipeid ) REFERENCES recipes (recipeid)
  );
  SELECT setval('ingredients_uselessid_seq', 1, false);


  -- CREATE TABLE recipesandingredients
  -- (
  --   "uselessid" serial PRIMARY KEY,
  --   "recipeid" bigint NOT NULL,
  --   "recipename" varchar NOT NULL,
  --   "recipeimage" varchar,
  --   "ingredientid" bigint NOT NULL,
  --   "ingredientname" varchar NOT NULL,
  --   "ingredientimage" varchar,
  --   UNIQUE (recipeid, ingredientid),
  --   FOREIGN KEY ( recipeid ) REFERENCES recipes ( recipeid ),
  --   FOREIGN KEY ( ingredientid ) REFERENCES ingredients ( ingredientid ),
  -- );
  -- SELECT setval('recipesandingredients_uselessid_seq', 1, false);

-- DROP TABLE EVENTSANDMESSAGES;
-- DROP TABLE USERSANDEVENTS;
-- DROP TABLE EVENTS;
-- DROP TABLE USERS;