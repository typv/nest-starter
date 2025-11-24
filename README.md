# Nest Starter

# Getting Started

## Server Requirements

- Node.js 22
- PostgreSQL 16

## Installing preparation

1. Default Application $BASEPATH : `/home/app.user/nest-starter`

2. Copy the .env file from .env.example under $BASEPATH, fill your config in .env file instead of example config

# I. Build the app (manual)

## 1. Dependencies Installation

```bash
  pnpm install
```

## 2. Build

```bash
    pnpm build
```

## 3. Migrate database

### 3.1. Create migration file

```bash
  # Generate a migration script based on entities (recommended)
  pnpm migration:create --name migration_name
  
  # Create blank file
  pnpm migration:createBlank --name migration_name 
  
```

### 3.2. Migrate

```bash
  pnpm migration:up
```

### 3.3. Revert

```bash
  pnpm migration:down
```

## 4. Running the app

```bash
# development
$ pnpm start

# watch mode
$ pnpm start:dev

# production mode
$ pnpm start:prod
```

# II. Build with Docker

## 1. Setup docker

```bash
  docker compose up -d
  docker compose exec node npm i -g @nestjs/cli
  docker compose exec node pnpm install
  docker compose exec node pnpm build
```

## 3. Migrate database

## 3.1. Migrate

```bash
  docker compose exec node pnpm migration:up
```

## 3.2. Revert Migration

```bash
  docker compose exec node pnpm migration:down
```

## 4. Run dev mode

```bash
  docker compose exec node pnpm start:dev
```

### 5. Local url

http://localhost:`APP_PORT`
