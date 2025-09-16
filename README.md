# Intervention Studies

A full-stack web application with a **Spring Boot (Java 21)** backend and a **Next.js (React, TypeScript)** frontend. The system supports role-based access for **researchers** and **participants** using JWT authentication.

---

## Prerequisites

Before running the project, ensure you have the following installed:

- **[Git](https://git-scm.com/downloads)**
- **[Java JDK 21](https://www.oracle.com/java/technologies/downloads/)**
- **[Apache Maven](https://maven.apache.org/download.cgi)**
- **[Node.js](https://nodejs.org/en/download)** (includes npm)

Verify installations and check if they are compatible with versions below:

- ```bash
    $ git --version
    git version 2.43.0

    $ java --version
    openjdk 21.0.8 2025-07-15
    OpenJDK Runtime Environment (build 21.0.8+9-Ubuntu-0ubuntu124.04.1)
    OpenJDK 64-Bit Server VM (build 21.0.8+9-Ubuntu-0ubuntu124.04.1, mixed mode, sharing)

    $ mvn --version
    Apache Maven 3.8.7
    Maven home: /usr/share/maven
    Java version: 21.0.8, vendor: Ubuntu, runtime: /usr/lib/jvm/java-21-openjdk-amd64
    Default locale: en_US, platform encoding: UTF-8
    OS name: "linux", version: "6.6.87.2-microsoft-standard-wsl2", arch: "amd64", family: "unix"

    $ node --version
    v22.13.1

    $ npm --version
    11.6.0
  ```

---

## Backend Setup (Spring Boot)

1. **Clone the repository**

   ```bash
   $ git clone https://github.com/Blank-FS/intervention-studies.git
   ```

2. **Configure environment variables**

   ```bash
    $ cd path/to/backend/src/main/resources/certs/

    # create rsa key pair
    $ openssl genrsa -out keypair.pem 2048
    # extract public key
    $ openssl rsa -in keypair.pem -pubout -out public.pem
    # create private key in PKCS#8 format
    $ openssl pkcs8 -topk8 -inform PEM -outform PEM -nocrypt -in keypair.pem -out private.pem
   ```

3. **Build & run backend**

   ```bash
   $ cd path/to/backend/
   $ mvn clean install
   $ mvn spring-boot:run
   ```

The backend will start at: `http://localhost:8080`

---

## Frontend Setup (Next.js)

1. **Navigate to frontend**

   ```bash
   $ cd path/to/frontend
   ```

2. **Install dependencies**

   ```bash
    $ npm install
   ```

3. **Configure environment variables (create .env file in frontend root folder)**

   ```
    NEXT_PUBLIC_API_URL=http://localhost:8080
    # public.pem created in backend
    JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----...-----END PUBLIC KEY-----"
   ```

4. **Run frontend in dev mode**

   ```bash
   $ npm run dev
   ```

The frontend will start at: `http://localhost:3000`

Access the different routes by logging in as different test users:

- Researcher
  - Username: `researcher`
  - Password: `password`
- Participant
  - Username: `participant`
  - Password: `password`

---

## Project structure

    ```bash
    intervention-studies/
    │── backend/          # Spring Boot (REST API, JWT, roles)
    │── frontend/         # Next.js (React UI, middleware auth)
    │── README.md
    ```
