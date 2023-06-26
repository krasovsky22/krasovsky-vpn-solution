| PK       | SK       | ID  | **TYPE**               | FirstName | LastName | S3Path  | GSI1PK   | GSI1SK  | dimensions |
| -------- | -------- | --- | ---------------------- | --------- | -------- | ------- | -------- | ------- | ---------- |
| PERSON#1 | PERSON#1 | 1   | PERSON                 | user1     | adams    |         |          |         |            |
| PERSON#2 | PERSON#2 | 2   | PERSON                 | user2     | simson   |         |          |         |            |
| PHOTO#1  | PHOTO#1  | 1   | PHOTO                  |           |          | /test/1 |          |         |            |
| PHOTO#2  | PHOTO#2  | 2   | PHOTO                  |           |          | /test/2 |          |         |            |
| PHOTO#1  | PERSON#1 |     | PHOTO_PERSON_CONNECTOR |           |          |         | PERSON#1 | PHOTO#1 | {top/left} |

# Queries

getPersonsById(id = 1): Person => PERSON#1, PERSON#1
getPhotoById(id = 1): Photo => PHOTO#1, PHOTO#1

getPhotoByPerson(personId = 1): Person => query by GSI1PK/PERSON#1
getPeopleByPhoto(photoId = 1): Photo => Query by PK/PHOTO#1
