 # IDEANEST_PROJECT

**Author**: Eslam Mohamed Hamed (Backend Engineer)

## Technologies Used
- AWS
- Redis
- MongoDB
- NestJS
- TypeScript
- Docker & Docker Compose

## Links
- **GitHub Repository**: [IDEANEST Backend](https://github.com/Eslam-Mohamed78/Ideanest_Backend)
- **Deployment**: [Live Application](http://13.48.249.89:8080)
- **Postman Documentation**: [API Docs](https://documenter.getpostman.com/view/26617775/2sAY4sjjiu)

## Bonus Tasks
- Redis Integration for token revocation (Revoke Refresh Token Route)
- AWS EC2 Cloud Deployment: [Deployed Link](http://13.48.249.89:8080)
- Database Schema Documentation

## Localization
- **Arabic**: Set `x-lang=ar` in request headers
- **English**: Set `x-lang=en` in request headers

## Entities and Attributes

### 1. User
- `_id` (ObjectId): Unique identifier for each user.
- `name` (string): User's name.
- `email` (string): User's unique email.
- `password` (string): Hashed password for security.
- `access_level` (string): Enum options `[ read_only, full_access ]`.

### 2. Organization
- `_id` (ObjectId): Unique identifier for each organization.
- `name` (string): Name of the organization.
- `description` (string): Description of the organization.
- `Organization_members` (array of ObjectId): References the User entity.

## Relationships
- **User to Organization**: Many-to-One relationship, as each organization can have multiple members.
- **Redis**: Used for token management and efficient handling of revoked tokens.
