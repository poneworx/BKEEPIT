# Getting started
1) docker compose -f docker-compose.dev.yml up -d
2) cd server && copy .env.example .env && npm ci && npm run dev
3) cd ../frontend && copy .env.example .env && npm ci && npm run start
Open MailHog UI at http://localhost:8025 to click verification links.