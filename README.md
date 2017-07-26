# Node JS Authentication using JWT
- Install the following modules:
    ```sh
    $ npm init
    $ npm install express --save
    $ npm install mongoose --save
    $ npm install morgan --save
    $ npm install body-parser --save
    $ npm install jsonwebtoken --save
    ```
- File structure would be like :
    *  package.json
    *  config.js
    *  server.js
    *  models/user.js
- First comment off the route middleware code
- Then navigate to this route(/api/setup)  in postman, then run this route(/api/authenticate) and copy the token.
- Uncomment the route middleware code.
- Now try to access other routes that is defined.
 ##### This is very simple app just to demonstarte how token works in node.

