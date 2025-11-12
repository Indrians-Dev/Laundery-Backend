# Laundery API Specification

# Authentication Endpoints

# Register

## HTTP Request
`POST` /api/auth/register

### Request Body

```json 
{
  "username": "xxxx",
  "password": "xxxx",
  "confirm_password": "xxx",
  "email": "xxxx@example.com",
  "nohp": "optional"
}
```

## Responses

### Response Success 201
```json
{
  "success": true,
  "message": "Registration successful. Please check your email for OTP verification.",
  "data": {
    "user_id": 1,
    "username": "xxxx",
    "email": "xxxx@example.com"
  }
}
```
### Response Error 400
#### Validation Error
```json
{
  "success": false,
  "errors": "username is required, password must be at least 6 characters, confirm_password must match password"
}

```
#### Jika username atau email sudah ada 
```json
{
  "success": false,
  "errors": "Username or email already exists"
}
```

### Response Error 500
#### Jika gagal mengirimkan email
```json
{
  "success": false,
  "errors": "Failed to send OTP"
}
```
#### Response Internal Server Error
```json
{
    "success": false,
    "errors": "Internal Server Error"
}

```

# Verifikasi OTP

## HTTP Request
`POST` /api/auth/verify-otp
### Request Body 
```json 
{
  "email": "xxxx@example.com",
  "otp": "xxxxx"
}
```
## Responses
### Response Success 200
```json 
{
  "success": true,
  "message": "Account verified successfully",
  "user": {
    "user_id": 1,
    "username": "xxxx",
    "email": "xxxx@example.com",
    "is_verified": true
  }
}
```

### Response Error 400
#### Jika otp tidak Valid
```json
{
  "success": false,
  "errors": "email must be a valid email, otp must be 6 digits"
}

```
#### user not found
```json
{
  "success": false,
  "errors": "User not found"
}
```

####  user sudah verifikasi
```json
{
  "success": false,
  "errors": "User already verified"
}
```

### Response Error 401
####  invalid otp
```json
{
  "success": false,
  "errors": "Invalid OTP code"
}
```

### Response Error 401
#### otp expired
```json
{
  "success": false,
  "errors": "OTP has expired"
}
```



# resendOtp

## HTTP Request
`POST` /api/auth/resend-otp
### Request Body
```json 
{
  "success": true,
  "message": "New OTP sent successfully",
  "email": "xxxx@example.com"
}
```

## Responses
### Response success 200
```json 
{
  "success": true,
  "message": "New OTP sent successfully",
  "email": "xxxx@example.com"
}
```


### Response Error 400
#### User Not Found
```json 
{
  "success": false,
  "errors": "User not found"
}
```

#### user sudah terverifikasi
```json 
{
  "success": false,
  "errors": "User already verified"
}
```

### Response Error 500
#### gagal kirim email
```json 
{
  "success": false,
  "errors": "Failed to send new OTP"
}
```


# Login
## HTTP Request
`POST` /api/auth/login
### Request Body

```json 
{
  "username": "xxxx",
  "password": "xxxx"
}
```
## Responses

### Response success 200
```json 
{
  "success": true,
  "data": {
    "user_id": 1,
    "username": "xxxx",
    "email": "xxxxx@example.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```


### Response error 400
#### Validation Error
```json
{
  "success": false,
  "errors": "username is required, password must be at least 6 characters"
}
```

#### invalid credential
```json
{
  "success": false,
  "errors": "Username or password is wrong"
}
```

#### Not Verified
```json
{
  "success": false,
  "errors": "Please verify your email first"
}
```


# Forgot Password

## HTTP Request
`POST` /api/auth/forgot-password
### Request Body
```json
{
  "email": "xxxx@example.com"
}
```
## Responses

### Response success 200
```json
{
  "success": true,
  "message": "Password reset link sent to your email"
}
```

### Response error 400
#### Validation Error
```json
{
  "success": false,
  "errors": "email must be a valid email"
}
```

#### user not found
```json
{
  "success": false,
  "errors": "User not found"
}
```

### Response error 500
#### Gagal kirim email
```json
{
  "success": false,
  "errors": "Failed to send reset email"
}
```


# Reset Password

## HTTP Request
`POST` /api/auth/reset-password
### Request Body
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "new_password": "xxxx",
  "confirm_password": "xxxx"
}
```
## Response
### Response success 200
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

### Response error 400
#### Validation Error
```json
{
  "success": false,
  "errors": "new_password must be at least 6 characters, confirm_password must match new_password"
}
```

### Response error 401
#### Invalid Token
```json
{
  "success": false,
  "errors": "Invalid or expired reset token"
}
```

#### Invalid Tipe Token
```json
{
  "success": false,
  "errors": "Invalid token type"
}
```

# Dashboard

## Http Request
`GET` /dashboard
### Headers
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json


## Responses
### Response success 200
```json
{
  "success": true,
  "data": {
    "user_id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

### Response error 401
#### Missing Token
```json
{
  "success": false,
  "errors": "Access token required"
}
```

#### Invalid Token
```json
{
  "success": false,
  "errors": "Invalid token"
}
```

#### Token Expired
```json
{
  "success": false,
  "errors": "Token expired"
}
```


