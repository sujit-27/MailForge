# 📬 MailForge — Event-Driven Microservices Email Platform

![Java](https://img.shields.io/badge/Java-17+-orange)
![Spring Boot](https://img.shields.io/badge/SpringBoot-Microservices-green)
![Kafka](https://img.shields.io/badge/Apache-Kafka-black)
![gRPC](https://img.shields.io/badge/gRPC-Internal%20RPC-blue)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED)
![Azure](https://img.shields.io/badge/Cloud-Azure-blue)
![Architecture](https://img.shields.io/badge/Architecture-Event--Driven-purple)

MailForge is a scalable, cloud-deployed **microservices-based email platform** built using event-driven architecture, asynchronous messaging, and containerized services. It is designed to handle transactional email workflows with high reliability, modular service boundaries, and distributed processing.

The platform demonstrates real-world distributed system practices using **Spring Boot, Apache Kafka, gRPC, Docker, and Azure**.

---

# 🚀 Live Demo

**Frontend Demo:**  
https://mail-forge-plum.vercel.app

⚠️ This demo runs on a limited-resource development cloud environment. Backend services may be paused during off-hours to conserve credits. A live walkthrough can be requested via the Contact page in the app.

---

# 🎯 Project Purpose

MailForge was built to practically demonstrate:

- Microservices architecture implementation
- Event-driven processing pipelines
- Kafka-based asynchronous workflows
- gRPC internal service communication
- Template-driven email generation
- API Gateway routing pattern
- Containerized deployment model
- Cloud VM infrastructure hosting
- Production-style service separation

---

# 🏗 Architecture Overview

MailForge follows a **distributed event-driven microservices architecture**.

### Core Design Principles

- Service isolation by responsibility
- Loose coupling through Kafka events
- High-performance internal RPC using gRPC
- Gateway-only external exposure
- Stateless processing where possible
- Container-first deployment
- Failure isolation across services

---

# 🧩 Core Services

## API Gateway
- Single public entry point
- Routes client requests
- Validates authentication tokens
- Shields internal services from exposure

## Auth Service
- OAuth2 authentication
- Token validation
- Access control handling

## Template Service
- Email template storage
- Dynamic placeholder rendering
- Template CRUD operations

## Mail Service
- Consumes Kafka email events
- Renders templates with variables
- Sends transactional emails
- Publishes delivery status events

## Metrics / Tracking Service
- Tracks delivery outcomes
- Records send statistics
- Aggregates usage metrics

---

# 🔄 Communication Model

MailForge uses a **hybrid communication strategy**.

## Synchronous Communication
- REST APIs → Client to Gateway
- gRPC → Internal service-to-service calls

## Asynchronous Communication
Apache Kafka is used for:

- Email send events
- Template workflow triggers
- Delivery status updates
- Metrics aggregation

### Benefits

- Service decoupling
- Higher reliability
- Fault tolerance
- Better throughput handling
- Retry-safe processing

---

# 📨 Email Processing Flow

1. Client sends request to Gateway
2. Gateway validates authentication
3. Template is resolved
4. Event published to Kafka topic
5. Mail service consumes event
6. Template rendered with variables
7. Email dispatched
8. Status event published
9. Metrics service records outcome

---

# ⚙️ Technology Stack

## Backend
- Java 17+
- Spring Boot
- Spring Cloud
- gRPC
- REST APIs

## Messaging
- Apache Kafka

## Infrastructure
- Docker
- Azure Virtual Machine deployment

## Frontend
- React
- Tailwind CSS
- Redux

## Security
- OAuth2 authentication
- JWT

---

# 🐳 Containerization

Each microservice runs as an independent Docker container.

### Advantages

- Environment consistency
- Independent deployment
- Easier scaling
- Cloud portability
- Faster setup

---

# ☁️ Cloud Deployment

MailForge backend services are deployed on:

**Azure Virtual Machine**

Deployment characteristics:

- Dockerized microservices
- Kafka containerized broker
- Gateway exposed via domain
- Reverse proxy routing
- Cloud network configuration
- Development-budget resource model

---

# 📂 Repository Structure

MailForge/
├── gateway/
├── auth-service/
├── template-service/
├── mail-service/
├── metrics-service/
├── proto/ # gRPC contracts
├── docker/
├── frontend/
└── docs/


---

# 🔐 Security Model

- OAuth2 authentication
- Gateway-level token validation
- No direct internal service exposure
- Service trust boundaries enforced
- Token-based request flow

---

# 📊 Reliability Strategies

- Event-driven decoupling
- Retry-safe Kafka consumers
- Idempotent processing patterns
- Template fallback handling
- Async workflow isolation

---

# 🧪 Local Development Setup

## Prerequisites

- Java 17+
- Docker
- Node.js
- Kafka
- Maven or Gradle

---

# 🐳 Running MailForge Locally

## Run with Docker (Recommended)

The easiest way to start the full MailForge stack is using Docker Compose. This will start all required services and dependencies in the correct configuration.

```bash
docker-compose up --build

```

👤 Author
Sujit Kumar Shaw
B.Tech IT — Microservices & Cloud Systems Builder

GitHub: https://github.com/sujit-27
Email send requests

Delivery and status tracking

API documentation is available at:

