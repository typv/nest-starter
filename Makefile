ps:
	docker compose ps
build:
	docker compose up -d --build
up:
	docker compose up -d
down:
	docker compose down
stop:
	docker compose stop
node:
	docker compose exec node sh
db:
	docker compose exec db bash
buildApp:
	docker compose exec node pnpm build
buildCleanApp:
	docker compose exec node pnpm build:clean
install:
	docker compose exec node pnpm install
buildApp:
	docker compose exec node pnpm build
migrate:
	docker compose exec node pnpm migration:up
dev:
	docker compose exec node pnpm start:dev
prod:
	docker compose exec node pnpm start:prod
runCommand:
	docker compose exec node pnpm command:run $(c)
checkTypes:
	docker compose exec node pnpm check-types
