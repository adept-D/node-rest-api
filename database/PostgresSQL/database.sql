create table User(
    uuid serial primary key,
    email varchar(100),
	password varchar(100),
	nickname varchar(30)
);