# n8n-nodes-picobello

An [n8n](https://n8n.io) community node for interacting with [Picobello](https://picobello.app) workflow executions, steps, and logs via the Picobello API.

## Installation

In your n8n instance, go to **Settings → Community Nodes → Install** and search for `n8n-nodes-picobello`.

Or install manually:

```bash
npm install n8n-nodes-picobello
```

## Credentials

Create a **Picobello API** credential in n8n:

| Field | Description |
|---|---|
| **API Key** | Found in the Picobello admin page under API settings |
| **Base URL** | Defaults to `https://picobello.app` — change only for self-hosted instances |

## Operations

### Execution

| Operation | Description | Required Fields |
|---|---|---|
| **Get** | Retrieve all data, steps, and logs for an execution | Execution ID |
| **Rename** | Set a new display name for an execution | Execution ID, Name |
| **Trigger** | Start a new execution for a workflow via API | Workflow ID, Data (JSON) |
| **Update Data** | Update one or more data fields in an execution | Execution ID, Data Fields |

> **Update Data tip:** Fill in the Execution ID first, then click the Key dropdown — it automatically loads the available field names from that execution so you can pick which ones to update.

### Step

| Operation | Description | Required Fields |
|---|---|---|
| **Complete** | Mark a step as completed and advance the workflow | Execution ID, Step ID |
| **Make Decision** | Record a decision for a decision node and advance the workflow | Execution ID, Step ID, Decision Choice |

The **Make Decision** operation also accepts optional `Reason` and `Comment` fields.

### Log

| Operation | Description | Required Fields |
|---|---|---|
| **Add Entry** | Append a log entry to an execution | Execution ID, Log Text |

`Step ID` and `Log Type` are optional on Add Entry.

## Development

### Setup

```bash
npm install
```

### Running locally (two terminals)

`npm run dev` only compiles and links the node in watch mode (it uses `n8n-node dev --external-n8n`, which intentionally does **not** start n8n). You need a second terminal running n8n so it can load the compiled node from `dist/`.

**Terminal 1 — watch & rebuild the node:**

```bash
npm run dev
```

**Terminal 2 — start n8n (pick one):**

```bash
npm run dev:docker   # recommended: runs n8n in Docker on http://127.0.0.1:5680
# or
npm run dev:n8n      # runs `n8n start` directly (requires n8n installed globally)
```

Open the n8n editor, create a **Picobello API** credential, and add the **Picobello** node to a workflow.

> **Docker option:** `docker-compose.yml` mounts `./dist` into the container as a custom extension, so every recompile from Terminal 1 is picked up. After saving a `.ts` file, reload the n8n editor tab to see the changes. To reset the n8n database, run `docker compose down -v`.

### Other scripts

```bash
npm run build     # compile TypeScript to dist/
npm run lint      # run ESLint
npm run lint:fix  # auto-fix lint issues
npm run release   # cut a new release (bumps version, tags, and publishes)
```

Releases are published to npm automatically via GitHub Actions on every version tag push (see `.github/workflows/publish.yml`).

## License

[MIT](LICENSE.md) — Copyright 2026 ControlC
