| Title                       | Method | Endpoint                                                                  | Data required               | Notes                              |
| --------------------------- | ------ | ------------------------------------------------------------------------- | --------------------------- | ---------------------------------- |
| Get users                   | `GET`  | `https://coded-projects-api.herokuapp.com/api/auth/v3/users`              | `no data required`          | NA                                 |
| Login                       | `POST` | `https://coded-projects-api.herokuapp.com/api/auth/v3/login`              | `username password image`   | NA                                 |
| Register                    | `POST` | `https://coded-projects-api.herokuapp.com/api/auth/v3/register`           | `username password`         | NA                                 |
| Get User Profile            | `GET`  | `https://coded-projects-api.herokuapp.com/api/auth/v3/profile`            | `no data required`          | NA                                 |
| Update Profile              | `PUT`  | `https://coded-projects-api.herokuapp.com/api/auth/v3/profile`            | `password or image or both` | NA                                 |
| Logged-in user Balance      | `GET`  | `https://coded-projects-api.herokuapp.com/api/bank/v3/balance`            | `no data required`          | NA                                 |
| Logged-in user Transactions | `GET`  | `https://coded-projects-api.herokuapp.com/api/bank/v3/transactions`       | `no data required`          | NA                                 |
| Deposit                     | `POST` | `https://coded-projects-api.herokuapp.com/api/bank/v3/deposit`            | `amount`                    | NA                                 |
| Withdrawal                  | `POST` | `https://coded-projects-api.herokuapp.com/api/bank/v3/withdrawal`         | `amount`                    | NA                                 |
| Transfer amount             | `POST` | `https://coded-projects-api.herokuapp.com/api/bank/v3/transfer/:username` | `amount`                    | `route param username is required` |
