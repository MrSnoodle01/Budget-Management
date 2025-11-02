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

Returns all of the currently logged in user's transactions and the user's email
```
{
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
    ],
    email: user.email
}

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