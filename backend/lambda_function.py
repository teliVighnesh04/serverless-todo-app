import json
import boto3

from time import gmtime, strftime

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Todo')

def lambda_handler(event, context):
    # Determine the HTTP method of the request
    http_method = event['httpMethod']
    
    # Handle GET request
    if http_method == "GET":
        # Scans the table in specified order
        response = table.scan()
        # Access the scan results and sort them by the "Sno" column
        items = sorted(response['Items'], key=lambda x: int(x['Sno']))
        # print(items)
        output_response = items
        
    # Handle POST request
    elif http_method == "POST":
        # Import the data from User
        try:
            args = event['body']
            response = json.loads(args)
        except Exception as e:
            raise e
        # Generate a timestamp
        now = strftime("%a, %d %b %Y %H:%M:%S +0000", gmtime())
        # insert date into DynamoDB table
        table.put_item(
            Item={
                'Sno': get_max_sr_no(),
                'Title': response['title'],
                'Description': response['desc'],
                'Created_on' : now
                })    
        output_response = "Task Added Successfully!"
        
    # Handle DELETE request
    elif http_method == "DELETE":
         # Take String Parameter from URL
        try:
            id = event["queryStringParameters"]["sno"]
        except Exception as e:
            raise e
        # Delete row by Sno
        table.delete_item(Key={'Sno':id})
        output_response = "Task Deleted Successfully!"
        
    # Handle PUT request
    elif http_method == "PUT":
        # take updated response from user
        try:
            id = event["queryStringParameters"]["sno"]
            response = json.loads(event['body'])
        except Exception as e:
            raise e
        # update the data for sno
        table.update_item(
            Key={
                "Sno" : id
            },
            UpdateExpression="SET Title = :updated_title, Description = :updated_desc",
            ExpressionAttributeValues={
                ":updated_title" : response['title'],
                ":updated_desc" : response['desc']
            })
        output_response = "Task Updated Successfully!" 
        
    else:
        return{
            'statusCode' : 400,
            'body': 'Unsupported HTTP method'
        }
        
    # Return Lambda function response
    return {
        'statusCode' : 200,
        'headers' : {
            'Access-Control-Allow-Headers' : 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Methods' : '*',
            'Access-Control-Allow-Origin' : '*'
        },
        'body' : json.dumps(output_response)
    }
    
def get_max_sr_no():
    # Perform the scan operation to retrieve all elements from the table
    response = table.scan()
    if len(response['Items']) == 0:
        return "1"
    # Initialize the maximum Sno with the first item's value 
    max_sno = int(response['Items'][0]['Sno'])
    # Loop through the items and find the maximum Sno value
    for item in response['Items']:
        if int(item['Sno']) > max_sno:
            max_sno = int(item['Sno'])
    return str(max_sno+1)    
