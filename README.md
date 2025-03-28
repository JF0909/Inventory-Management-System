# Inventory-Management-System
track products, stock levels, and suppliers

An application designed to help keeping track of an inventory. Aimed at avoid overstocking or understocking, minimize the holding cost, through maintaining accurate records to efficient the inventory management.

Features

1. Sign up
2. Login
3. Auth
4. Manage products(add, update, getall, getbyId, delete)
5. Track products

Project Develop Logic:
1. Confirm the 2 main feature: manage user and products
2. Configure db and create models for user and products
3. Server.js
4. Set routes, controller for user and products
5. Middleware For Authentication
6. Write test file with Mocha, chai, sinon for testing the CRUD in my project
7. Test passed, setup  yml file for CI/CD test
8. Configure the AWS EC2
9. Install Nginx,reverse proxy
10. Use PM2 restart, manage node.js project


Technologies

1.JIRA board URL: https://636-jingwen-f07u.atlassian.net/jira/software/projects/IMS/boards/5/backlog?selectedIssue=IMS-8&atlOrigin=eyJpIjoiN2FmMWM0NmVkOTdlNGI5NDljMmM5MzRjNDM5ZGM5MGUiLCJwIjoiaiJ9

2.Requirement SysML diagram

3.Backend (node, express, MongoDB)

4.Frontend(CRA, Mantine)

5.CI/CD pipeline details: configure EC2 on AWS, use nginx pm2 deploy the server, setup GitHub action environment, use github action runner to test CI.

EC2 instance ID: :  i-080474915705aa243;   name: n11886609;

6.Git repository:https://github.com/JF0909/Inventory-Management-System.git