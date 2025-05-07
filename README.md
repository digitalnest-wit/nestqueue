# NESTQueue

An in-house ticket management system.

## Prerequisites

- [go](https://go.dev/doc/install): to build and run the server
- [npm](https://nodejs.org/en/download): to build and run the client
- A [Mongo DB](https://account.mongodb.com/account/login) account and the credentials to a cluster

## Installation

### Download the repository

```sh
git clone https://github.com/digitalnest-wit/nestqueue
```

Navigate to the project directory

```sh
cd nestqueue
```

## Running

### 1. Copy your Mongo DB cluster URI

In the Mongo DB dashboard, click on Connect and find your cluster URI. Place this URI in the server environment file `server/.env`. See `.example.env` for more details.

```env
MONGO_URI='YOUR_URI_HERE'
```

### 2. Start the client

Navigate to the `client` directory and create an environment file with a variable `NEXT_PUBLIC_API_URL`:

```sh
cd client/
echo 'NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1' >> .env
```

Run `make`. The Makefile automatically installs dependencies and runs the client on port `8080`.

```sh
cd client/
make
```

A custom port number may also be specified for the client.

```sh
make PORT=8081
```

### 3. Start the server

Navigate to the `server` directory and run `make`. The Makefile automatically downloads dependencies and runs the server on port `3000`.

```sh
cd server/
make
```

A custom port number may also be specified for the server.

```sh
make PORT=3001
```

> [!DANGER]
> If you specify a custom port number, make sure to _also update the port number in the client_ environment file.
> In `client/.env`:
>
> ```env
> NEXT_PUBLIC_API_URL=http://localhost:YOUR_PORT_NUMBER/api/v1
> ```
