# OpenClaw

You've installed OpenClaw — an AI agent gateway that can chat with you and manage your StartOS server on your behalf. Before you use it, read the **Security** section below: this service is powerful and is intended for development and experimentation only.

## Documentation

- [OpenClaw upstream docs](https://docs.openclaw.ai/) — general OpenClaw usage and features.
- [OpenClaw upstream repo](https://github.com/openclaw/openclaw) — the project this package runs.

## What you get on StartOS

- **A token-authenticated Web UI** (the gateway control panel and WebChat) for talking to your AI agent.
- **Direct StartOS server management** — the agent bundles `start-cli` and, once you log it in, can query server state, manage packages, and run commands on your server.
- **A persistent workspace** — your agent's identity, memory, and customizations live on the backed-up `main` volume and survive updates.
- **Optional messaging channels** — connect Telegram or WhatsApp to chat with the agent outside the Web UI.

## Security

**Use ONLY with EXTREME caution.**

- Do **not** install on a server holding important services or data.
- Do **not** install on a server with Bitcoin keys (LND, CLN, etc.).
- OpenClaw uses an LLM that executes commands based on your prompts. It can run destructive commands, uninstall services, or brick your server.
- "Login to StartOS" grants this package **root access** to your server.
- Your prompts are sent to external AI providers (Anthropic/OpenAI) — there are privacy implications.

This package is intended for **development and experimentation only**.

## Getting set up

Two setup tasks are created for you on install and must be completed before the agent is fully usable:

1. **Configure API Credentials** — open this action and enter an LLM provider key. Choose Anthropic (Claude) or OpenAI, and authenticate with either an API key or an OAuth token from a Claude Pro/Max or ChatGPT Plus subscription.
2. **Login to StartOS** — open this action and enter your StartOS master password so the agent's `start-cli` can manage your server. (Skip this if you do not want the agent to have server access.)

Then:

3. Open OpenClaw's **Dashboard** tab and click the **Web UI** interface. The URL carries an authentication token as a query parameter — treat that link as a secret.
4. Optionally, run **Connect Telegram** or **Connect WhatsApp** (under the *Channels* group) to reach the agent from a messaging app.

## Limitations

- Only **Telegram** and **WhatsApp** can be connected through Actions. Other channels (Slack, Discord, Signal, Matrix) require manual configuration.
- **Voice features** (Voice Wake, Talk Mode) are not available — they require companion apps.
- **Browser automation** is limited without display access.
- All prompts are sent to external AI providers; nothing is processed locally.
