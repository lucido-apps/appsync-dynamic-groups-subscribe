# AWS AppSync Dynamic Groups with Subscriptions and Queries
Dynamic groups seem to be not working with subscriptions on AppSync. This is an example app to demonstrate the issue.

## Steps to reproduce issue (video link: https://youtu.be/UGs-EgPlgk8)
1. Create (signup) two users with usernames: "user1" and "user2"
2. Create "Collaborators" group in Cognito https://console.aws.amazon.com/cognito
3. Assing "user1" and "user2" to "Collaborators" group
4. Log in as "user1" and "user2" on two different browsers
5. Click on "Create Private Task" and "Create Shared Task" for each user

## Expected
Subscriptions for both users should respond to creation on Shared tasks

## Actual Result
Neither "user1" or "user2" respond to subscriptions on newly created shared tasks
