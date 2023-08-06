
# Serverless ToDo App
###  https://dev.d1zjksvlrju47y.amplifyapp.com/

![Todo-App](https://github.com/teliVighnesh04/serverless-todo-app/blob/main/images/ToDo-App.png)

"Todo App" is a simple yet interactive web application that allows users to efficiently manage their tasks. With a clean and intuitive interface, users can easily add new tasks by providing a title and description, which are then seamlessly integrated into the backend through API requests. The app fetches and displays the list of todos using GET requests, offering a comprehensive view of the tasks at hand. For enhanced usability, each task is equipped with "Update" and "Delete" buttons that allow users to modify and remove tasks with ease. The project combines AWS Serverless services to create a seamless and dynamic task management experience.


## Architecture
![Architecture](https://github.com/teliVighnesh04/serverless-todo-app/blob/main/images/Architecture.png)

## Deployment Steps Performed
Here are the steps I followed to deploy the "ToDo" app:

* Created a DynamoDB table with following configuration
```
Table Name : Todo
Partition Key : Sno (data-type : String)
``` 
* Created a lambda function with below configuration and created a backend code (backend/lambda_function.py)
```
Author from scratch
Function name : Todo-backend
Runtime : Python 3.10
Architecture : x86_64
```
* Added below inline policy in role created by lambda function to get the access of dynamodb table
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "dynamodb:PutItem",
                "dynamodb:DeleteItem",
                "dynamodb:GetItem",
                "dynamodb:Scan",
                "dynamodb:UpdateItem",
                "dynamodb:GetRecords"
            ],
            "Resource": DynamoDB table ARN
        }
    ]
}
```
* Developed REST API endpoints using AWS API Gateway through the following configuration:
```
Integration Type : Lambda Function
Use Lambda Proxy Integration : Enable
Lambda Region : Lambda function region name 
Lambda Function : lambda funtion name --> Todo-backend
```
*Note* : Enable CORS for all the endpoints

*API Endpoints Structure*
```
/ 
  GET
  OPTIONS
  POST

/delete
  DELETE
  OPTIONS

/update 
  OPTIONS
  UPDATE
```
* Established a frontend application and seamlessly integrated it with the API Gateway URL. Deployed the zip file of frontend/ into AWS Amplify. 



## ToDo-App backend API Documentation
### URL : https://84wa9bme79.execute-api.ap-south-1.amazonaws.com/prod

### ToDo Endpoints :
GET /
```
Returns all the ToDo's
E.g.,
[
    {
        "Title" : "task_name",
        "Sno" : "1",
        "Description" : "task Description",
        "Created_on" : "Sat, 05 Aug 2023 10:17:07 +0000"
    }
]
```
POST /
```
To add the ToDo
E.g.,
{
    "title" : "task_name",
    "desc" : "task Description"
}
```
PUT /update/sno=user_sno
```
To update the ToDo by sno
E.g.,
/update/sno=1
{
    "title" : "Updated task_name",
    "desc" : "Updated Description"
}
```
DELETE /delete/sno=user_sno
```
To delete the ToDo by sno
E.g.,
/delete/sno=1
```
