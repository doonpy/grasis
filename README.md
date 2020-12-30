![CI](https://github.com/doonpy/grasis/workflows/CI/badge.svg)
# Graduation thesis 2020 Project
## Overview
### Topic
BUILD A GRADUATE THESIS MANAGEMENT SYSTEM FOR FACULITY FOR HIGH QUALITY TRAINING

### Instructor
Master Luong Vi Minh

### Students
16110186 - Nguyen Duy Poon
    
## The overall system architecture
Updating

## Technical stacks
Updating

## Directory structure
```
.
├── api
│   ├── config
│   ├── data
│   ├── orm-configs
│   ├── src
│   │   ├── auth
│   │   │   ├── guards
│   │   │   └── strategies
│   │   ├── avatar
│   │   ├── aws
│   │   ├── comment
│   │   ├── common
│   │   │   ├── decorators
│   │   │   ├── guards
│   │   │   └── pipes
│   │   ├── council
│   │   │   ├── guards
│   │   │   └── pipes
│   │   ├── database
│   │   ├── defense
│   │   │   └── guards
│   │   ├── download
│   │   ├── lecturer
│   │   ├── migration
│   │   │   └── v1.0.0
│   │   ├── progress-report
│   │   │   └── guards
│   │   ├── refresh
│   │   ├── result
│   │   ├── review
│   │   │   └── guards
│   │   ├── student
│   │   ├── thesis
│   │   │   ├── pipes
│   │   │   ├── thesis-lecturer
│   │   │   └── thesis-student
│   │   ├── topic
│   │   │   ├── entities
│   │   │   ├── guards
│   │   │   ├── pipes
│   │   │   ├── topic-state
│   │   │   └── topic-student
│   │   ├── upload
│   │   │   ├── interceptors
│   │   │   └── multer
│   │   └── user
│   │       ├── guards
│   │       └── pipes
│   └── types
├── deploy
├── docs
│   └── diagrams
├── tools
│   └── script
│       ├── mysql
│       └── redis
└── web
    ├── src
    │   ├── assets
    │   │   ├── css
    │   │   │   ├── components
    │   │   │   │   ├── breadcrumb
    │   │   │   │   ├── copyright
    │   │   │   │   ├── layout
    │   │   │   │   ├── sider
    │   │   │   │   └── thesis
    │   │   │   └── pages
    │   │   │       └── login
    │   │   ├── img
    │   │   ├── svg
    │   │   │   └── regular
    │   │   └── terminology
    │   ├── components
    │   │   ├── Avatar
    │   │   ├── Breadcrumb
    │   │   ├── Comment
    │   │   ├── Common
    │   │   ├── Copyright
    │   │   ├── Council
    │   │   ├── Header
    │   │   ├── Layout
    │   │   ├── Lecturer
    │   │   ├── Sider
    │   │   ├── Student
    │   │   ├── Thesis
    │   │   ├── Topic
    │   │   │   └── State
    │   │   │       ├── Defense
    │   │   │       ├── ProgressReport
    │   │   │       ├── Result
    │   │   │       └── Review
    │   │   ├── Upload
    │   │   └── User
    │   ├── libs
    │   │   ├── api
    │   │   ├── avatar
    │   │   ├── comment
    │   │   ├── common
    │   │   ├── council
    │   │   ├── datetime
    │   │   ├── defense
    │   │   ├── download
    │   │   ├── jwt
    │   │   ├── lecturer
    │   │   ├── progress-report
    │   │   ├── result
    │   │   ├── review
    │   │   ├── student
    │   │   ├── thesis
    │   │   │   ├── thesis-lecturer
    │   │   │   └── thesis-student
    │   │   ├── topic
    │   │   │   ├── topic-state
    │   │   │   └── topic-student
    │   │   ├── upload
    │   │   └── user
    │   │       └── instance
    │   └── pages
    │       ├── error
    │       ├── lecturer
    │       │   ├── [id]
    │       │   └── admin
    │       │       └── [id]
    │       ├── student
    │       │   ├── [id]
    │       │   └── admin
    │       │       └── [id]
    │       └── thesis
    │           ├── [thesisId]
    │           │   └── topic
    │           │       └── [topicId]
    │           └── admin
    │               └── [id]
    └── types

```

## Install and deploy
### Required libraries and softwares
|No|Library/Software|Download link|
|---|---|---|
|1|NodeJS 14.x or later (include Yarn 1.0.2)|[https://nodejs.org](https://nodejs.org)|
|2|MySQL Community Server 5.7|[https://downloads.mysql.com/archives/community](https://downloads.mysql.com/archives/community)|
|3|Redis 6.0.9 or later|[https://redis.io](https://redis.io)|
|4|Docker (optional)|[https://www.docker.com/get-started](https://www.docker.com/get-started)|
### Deploy
#### Not use Docker
* Step 1: Crete database with name “grasis” in MySQL Community Server.
* Step 2: Open file `api/config/production.env` and config following params:
    * `JAWSDB_URL`: Database connection string.
    * `REDISCLOUD_URL`: Redis connection string.
    * `AWS_REGION`: AWS region (default us-east-1).
    * `AWS_ACCESS_KEY_ID`: AWS access key for AWS S3 service.
    * `AWS_SECRET_ACCESS_KEY`: AWS secret access key for AWS S3 service.
    * `AWS_BUCKET_NAME`: Bucket name of AWS S3 service.
* Step 3: Open file `web/.env.production` and config following params:
    * `API_SERVER_PRODUCTION`: API sever address.
* Step 4: Run shell script file `deploy/production.sh` to deploy.
#### Use Docker
* Step 1: Run shell script file `tools/script/mysql/main.sh` 
    * Select `1` to create MySQL container or select `2` to run existed container.
* Step 2: Run shell script file `tools/script/redis/main.sh` 
    * Select `1` to create Redis container or select `2` to run existed container.
* Step 3: Open file `api/config/production.env` and config following params:
    * `JAWSDB_URL`: Database connection string.
    * `REDISCLOUD_URL`: Redis connection string.
    * `AWS_REGION`: AWS region (default us-east-1).
    * `AWS_ACCESS_KEY_ID`: AWS access key for AWS S3 service.
    * `AWS_SECRET_ACCESS_KEY`: AWS secret access key for AWS S3 service.
    * `AWS_BUCKET_NAME`: Bucket name of AWS S3 service.
* Step 4: Open file `web/.env.production` and config following params:
    * `API_SERVER_PRODUCTION`: API sever address. 
* Step 5: Run shell script file `deploy/production.sh` to deploy.
## Document
Ref: [https://github.com/doonpy/grasis/tree/1.0.0/docs](https://github.com/doonpy/grasis/tree/1.0.0/docs)

## Support and Contact
- Issue: [https://github.com/doonpy/gravis/issues](https://github.com/doonpy/gravis/issues)
- Contact: 
    - Email: 16110186@student.hcmute.edu.vn (Poon)
