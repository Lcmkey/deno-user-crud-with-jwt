### How to Run

    $ make run

---
__Get All Users__

    $ curl http://localhost:4000/user/users | jq

__Create new User__

    $ curl -X POST -H "Content-Type: Application/json" -d '{"email": "sam.leung@test.com", "password": "12345678"}' http://localhost:4000/user/register

__Login__

    $ curl -X POST -H "Content-Type: Application/json" -d '{"email": "sam.leung@test.com", "password": "12345678"}' http://localhost:4000/user/login | jq

__Update User__

    $ curl -X PATCH -H "Content-Type: Application/json" -d '{"email": "sam.leung_update@test.com", "password": "12345678_update"}' http://localhost:4000/user/update/5efa670b002dd16000439174

__Delete User__

    $ curl -X DELETE http://localhost:4000/user/delete/5efa670b002dd16000439174