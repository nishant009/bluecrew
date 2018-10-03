# BlueCrew Software Development Challenge

## Assumptions:

1. This application is not required to be production grade and hence there are some missing pieces like CI/CD or security best practices.
2. It uses raw SQL as per the requirements hence will have performance issues under load.
3. Its a very basic application to show case understanding of technology and programming.

## Available functionality:

The following endpoints are available:

1. HealthCheck:

```
curl http://localhost:3000/
```

2. Create records:

```
curl -H 'Content-Type: application/json' -d '{"name": "floffy", "username": "ab", "password": "aab12345", "weight": "4.4"}' http://localhost:3000/cat/register
```

Optional input fields: `birthDate`, `breed`, `imageUrl`

3. Login:

```
curl -H 'Content-Type: application/json' -d '{"username": "ab", "password": "aab12345"}' http://localhost:3000/cat/login
```

4. Search:

```
curl -H 'Content-Type: application/json' -H 'authToken: <token>' -d '{"username": "ab"}' http://localhost:3000/cats/
```

Optional criteria fileds: `id`, `name`, `username`

5. Random:

```
curl http://localhost:3000/cats/random
```

## Setup:

1. Make sure you have installed the latest version of docker on your machine.
1. Navigate to the project directory
1. To build the images, run the command: `docker-compose build`
1. To start the project, run the command: `docker-compose up -d`
1. Wait for the containers to start, you can check the status by running the command: `docker-compose ps`
1. Once all containers are reported as running, open your browser and navigate to `http://localhost:3000` to interact with the app
1. To shutdown the app you can run the command `docker-compose down -v --rmi all --remove-orphans` to clean up everything.

## Future Improvements:

- Automate infrastructure deployment using CloudFormation.
- Implement improved CI/CD setup.
- Employ better secrets management for app secrets.
- Improve redis management and add authorization.
- Use a better token management mechanism like JWT.
- Add BDD tests using cucumber.
- Enforce encrypted passwords in input instead of plain text.
- Deligate password requirement validation to client.
- Store encrypted passwords in database.
- Add constraints to detect duplicate entries by creating a composite primary key using id, name, and username.
