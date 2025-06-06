# architecturediagrams

front end to start

go to directory on your local  ~/ArchitectureDiagrams/frontend/src
npm start


Backend server to start

go to directory on your local 
~/ArchitectureDiagrams/backend
node server.js

How to test

http://localhost:3000/

enter the string in the format below:

User to CloudFront
CloudFront to Route53
Route53 to APIGateway
APIGateway to Lambda
APIGateway to AuthService
AuthService to DynamoDB
Lambda to SQS Queue
Lambda to S3 Bucket
SQS Queue to Lambda
S3 Bucket to DataLake
DataLake to Redshift
Redshift to ReportingService
ReportingService to CloudFront
APIGateway to MonitoringService
MonitoringService to LogStorage
MonitoringService to AlertingSystem
AlertingSystem to OpsDashboard

Output:
You will get a flow diagram


# archtecture_project
