# Backend API

## Running project

You need to have installed Node.js and MongoDB 

DataBase: mongodb://localhost:27017/bbali in Development Environment

DataBase: mongodb://bblia-user:Mlab-database111@ds125021.mlab.com:25021/bblia in Production Environment

### Install dependencies 

To install dependencies enter project folder and run following command:
```
npm install
```

### Run server on local

To run server on local execute:
```
npm start 
```

To run cron job for sending email to admin daily
```
npm run cron
```

### Run server on heroku

To run server on heroku, please follow below steps:
```
1. Create account at (https://dashboard.heroku.com/apps)
2. Install Heroku CLI [guide](https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up)
3. Execute followings inside folder, where Node app is located, on Terminal for Mac or Command Line for Windows
	- `heroku login` (enter your heroku crendentials)
	- Create app
	  * login heroku account and create app in UI. 
	  * heroku create (once execute this command, local repository is connected to created app repository in heroku, please confirm by execute `git remote`)
	- `git push heroku master`
	- `heroku ps:scale web=1` (check it app is running or not.)
	- `heroku logs` (check logs)
```

### Endpoints Description and sample payload

***** signup: New User Create API
```
http POST /api/v1/user/

form parameters: {
	"firstName": "James",
	"lastName": "Bond",
	"email": "devkingdom@aol.com",  Email should be valid email address.
	"phoneNumber": "",  phoneNumber is optional.
	"password": "Admin1234",  The password should contain a minimum of 8 characters, including at least 1 uppercase letter and 1 number
	"role": "1"  1: admin, 0: user, default: 0
}

return:
SUCCESS
{
    "error": false,
    "data": "success"
}

FAILURE
{
    error: true,
    data: {
        message: error message
    }
}
```

***** login: login API
```
http POST /api/v1/user/login

form parameters: {
	"email": "devkingdom@aol.com",
	"password": "Admin1234"
}

return:
SUCCESS
{
	error: false,
	data:{
		token: token
	}
}

FAILURE
{
    error: true,
    data: {
        message: error message
    }
}
```

***** Create Category endpoint
```
http POST /api/v1/category/create  Authorization:'PUT_YOUR_TOKEN_HERE' in header

payload:
{
	"name": "Book"
}

return:
SUCCESS
{
    "error": false,
    "data": "Success"
}

FAILURE
{
    error: true,
    data: {
        message: error message
    }
}
```

***** Create Product endpoint
```
http POST /api/v1/create  Authorization:'PUT_YOUR_TOKEN_HERE' in header

payload:
{
	"productImage": product image file,
	"name": product name,
	"price": product price,
	"description": product description,
	"category name": category name  this is should be one created by `/api/v1/category/create` endpint

}

return:
If success, send the email contains the link(/change-password/token) to the email address.

SUCCESS
{
    "error": false,
    "data": "Success"
}

FAILURE
{
	error: true,
	data: {
		message: error message
	}
}
```

***** List Product endpoint with pagination, simple filtering by category and search by product title
```
http POST /api/v1/create  Authorization:'PUT_YOUR_TOKEN_HERE' in header

payload:
{
	"pageNum": 1,
	"limit": 10,
	"filter" : category name ,
	"searchKey": product name
}

return:
If success, send the email contains the link(/change-password/token) to the email address.

SUCCESS
{
    "error": false,
    "data": [
        {
            "name": "V-shirt",
            "imageUrl": "",
            "price": "120",
            "description": "Fashion",
            "category": {
                "name": "Shirt",
                "_id": "5b3fa298a0608c62655262ee"
            }
        },
        {
            "name": "V-shirt1",
            "imageUrl": "V-shirt1-1531118248354.jpg",
            "price": "120",
            "description": "Fashion",
            "category": {
                "name": "Shirt",
                "_id": "5b3fa298a0608c62655262ee"
            }
        }
    ]
}

FAILURE
{
	error: true,
	data: {
		message: error message
	}
}
```

***** Create Order endpoint
```
http POST /api/v1/order/create  Authorization:'PUT_YOUR_TOKEN_HERE' in header

payload:
{
	"productName": product name
}

return:
If success, sent the email contains product details to user.

SUCCESS
{
    "error": false,
    "data": "Success"
}

FAILURE
{
	error: true,
	data: {
		message: error message
	}
}
```

***** List Order endpoint for only admin
```
http GET /api/v1/order/  Authorization:'PUT_YOUR_TOKEN_HERE' in header

SUCCESS
{
    "error": false,
    "data": [
        {
            "product": {
                "category": {
                    "_id": "5b3fa298a0608c62655262ee",
                    "name": "Shirt"
                },
                "description": "Fashion",
                "price": "120",
                "imageUrl": "",
                "name": "V-shirt"
            },
            "user": {
                "role": 1,
                "phoneNumber": "",
                "email": "test@gmail.com",
                "lastName": "Bond",
                "firstName": "James"
            }
        },
        {
            "product": {
                "category": {
                    "_id": "5b3fa298a0608c62655262ee",
                    "name": "Shirt"
                },
                "description": "Fashion",
                "price": "120",
                "imageUrl": "",
                "name": "V-shirt"
            },
            "user": {
                "role": 1,
                "phoneNumber": "",
                "email": "test@gmail.com",
                "lastName": "Bond",
                "firstName": "James"
            }
        }
    ]
}

FAILURE
{
	error: true,
	data: {
		message: error message
	}
}
```