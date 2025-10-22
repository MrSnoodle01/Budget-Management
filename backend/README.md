# Backend api reference

## PATCH /api/addTransaction

Adds a transaction for the user

Expects a json body with
```
    transactions: [{
        id: dateId.getTime(),
        transactionType,
        transactionCategory,
        categoryType,
        subCategoryType,
        amount,
        date,
    }]
```

Returns an array of updated transaction objects
```
transactions: [
    {
        id: number
        transactionType: string
        transactionCategory?: string
        categoryType?: string
        subCategoryType?: string
        amount: number
        date: string
    }, 
]
```

## GET /api/getUserTransactions

Returns all of the currently logged in user's transactions
```
transactions: [
    {
        id: number
        transactionType: string
        transactionCategory?: string
        categoryType?: string
        subCategoryType?: string
        amount: number
        date: string
    },
]
```

## DELETE /api/deleteTransaction

Deletes a transaction from user

Expects a ```transactionId``` int parameter

Returns an array of updated transaction objects
```
transactions: [
    {
        id: number
        transactionType: string
        transactionCategory?: string
        categoryType?: string
        subCategoryType?: string
        amount: number
        date: string
    }, 
]
```

## PATCH /api/editTransaction

Edits a certain transaction

Expects a ```transactionId``` int parameter

Returns an array of updated transaction objects
```
transactions: [
    {
        id: number
        transactionType: string
        transactionCategory?: string
        categoryType?: string
        subCategoryType?: string
        amount: number
        date: string
    }, 
]
```

## POST /api/registerUser

Creates a new row in the database for the user

Expects a json body with
```
{
    email: string
    password: string
}
```

## POST /api/login

Logs in a user based on email and password

Expects a json body with
```
{
    email: string
    password: string
}
```

Returns a json with user information and new access_token
```
{
    "access_token": token,
    "user":{
        "id": user.id,
        "username": user.username,
        "email": user.email,
    }
}
```