# AWS AppSync Dynamic Groups with Subscriptions and Queries
Dynamic groups seem to be not working with subscriptions or queries on AppSync. This is an example app to demonstrate the issue.

## Steps to reproduce issue (video link: https://youtu.be/UGs-EgPlgk8)
1. Create (signup) two users with usernames: "user1" and "user2"
2. Create "Collaborators" group in Cognito https://console.aws.amazon.com/cognito
3. Assing "user1" and "user2" to "Collaborators" group
4. Log in as "user1" and "user2" on two different browsers
5. Click on "Create Private Task" and "Create Shared Task" for each user

## Expected
1. Shared tasks (with dynamic group "Collaborators") should be queried by both users
2. Subscriptions for both users should respond to creation on Shared tasks

## Actual Result
1. Neither "user1" or "user2" get shared tasks when queried
2. Neither "user1" or "user2" respond to subscriptions on newly created shared tasks

## Cross Check
1. Login to AppSync console https://console.aws.amazon.com/appsync
2. Run the following query
    ```
    query {
      listTasks {
        items {
          title
          myGroups
          owner
        }
      }
    }
    ```
3. Shared tasks are queried successfully here but not through js api in App.js
