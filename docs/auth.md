# Laundery API Specification

## Authentication & Authorization

### Login

#### Http url 
`POST` /api/auth/login

#### Request Body

```json 
{
    "username": "admin",
    "password": "12345"
}
```

#### Response

##### Response Success 200

```json
{
    "data": {
        "username": "Indriansyah",
        "email": "indriansyah@gmail.com",
        "profile": "/img/indriansyah.png"
    }
}
```

##### Response Error 500

```json
{
    "error": {
        "message": "Internal Server Error"
    }
}
```

##### Response Error Bad Request 400

```json
{
    "error": {
        "message": "Invalid Username and Password",
    }
}
```