# Task-App

Users Endpoints ======================
create user-sign Up (POST) => /users 
user login-signIn (POST) => /users/login
user logout (POST) => /users/logout
User Profile (GET) => /users/me
Update the user (PATCH) => /users/me
Delete the user (DELETE) => /users/:id


Task Endpoints =========================
create a task (POST) => /tasks
get all task by priority (GET) => /tasks/priority
get loggedIn(current) user tasks (GET) => /tasks/priority/me
get single task (GET) => /tasks/:id
Update the task (PATCH) => /tasks/:id
Assign task to users(developers) (POST) => /tasks/addCollaborators/:id
Delete the task (DELETE) => /tasks/:id

All the task endpoints are behind authentication, loggedIn user only able to perform this above all operations.
