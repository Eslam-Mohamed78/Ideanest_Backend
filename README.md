IDEANEST_PROJECT
Eslam Mohamed Hamed (Backend Engineer)
Technologies: AWS - Redis - MongoDB - NestJS - Typescript - Docker & Docker Compose
Links:
•
•
•
Github-repo: https://github.com/Eslam-Mohamed78/Ideanest_Backend
Deploy-link: http://13.48.249.89:8080
Postman-docs: https://documenter.getpostman.com/view/26617775/2sAY4sjjiu
Bonus Tasks:
•
•
•
•
Redis Integration (Revoke Refresh Token Route)
AWS EC2 Cloud Deployment > http://13.48.249.89:8080
Database Schema Documentation
Localization:
1. Arabic : x-lang = ar “in the request headers”
2. English : x-lang= en “in the request headers”
Entities and Attributes
1. User
o_id (ObjectId): Unique identifier for each user.
oname (string): User's name.
oemail (string): User's email, unique.
opassword (string): Hashed password for security.
oaccess_level (string): Enum [ read_only, full_access ]
2. Organization
o_id (ObjectId): Unique identifier for each organization.
oname (string): Name of the organization.
odescription (string): Description of the organization.
oOrganization_members ( [ ObjectId ] ): Ref to the User Entity.
Relationships
•User to Organization: M to 1 relationship, as each organization can have multiple members
•Redis is used to store & handle token revocation efficiently, particularly for managing and
checking revoked tokens.
