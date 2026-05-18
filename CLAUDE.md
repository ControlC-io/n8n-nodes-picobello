# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run build         # compile TypeScript to dist/
npm run build:watch   # watch mode (uses tsc directly)
npm run dev           # start n8n locally with these nodes hot-loaded
npm run lint          # run ESLint
npm run lint:fix      # run ESLint with auto-fix
npm run release       # cut a release
```

There is no automated test suite. Nodes are tested manually by running `npm run dev` and exercising them in the n8n workflow editor.

## Architecture

This is an **n8n community node package** — a TypeScript library that registers custom workflow nodes and credential types into n8n. Everything in `nodes/` and `credentials/` compiles to `dist/`, which is what n8n loads (configured in the `n8n` section of `package.json`).

The node uses the **declarative / low-code** style: operations and HTTP routing are declared in data structures; n8n handles request execution automatically. No `execute()` method needed.

### Node layout

```
nodes/Picobello/
├── Picobello.node.ts       # INodeType class — imports every resource, builds the Resource picker
├── Picobello.node.json     # display name, categories, icon URL
├── picobello.svg           # node icon
├── resources/              # ONE file per resource, each exporting `<name>Description: INodeProperties[]`
│   ├── execution.ts        # get / trigger / updateData / rename / list / listSteps / archive
│   ├── step.ts             # complete / decision / process / processFile / update
│   ├── log.ts              # addEntry
│   ├── file.ts             # uploadExecutionFile / getSignedUrl / getDocumentUrl / getOcr / streamDocument
│   ├── company.ts          # list / get / update / users / invitations
│   ├── invitation.ts       # checkEmail / get / accept / cancel
│   ├── user.ts             # getMe / updateMe / get
│   ├── workflowCategory.ts # CRUD
│   ├── apiConfiguration.ts # CRUD (generic JSON body)
│   ├── globalVariable.ts   # CRUD (generic JSON body)
│   ├── group.ts            # groups + members
│   ├── folder.ts           # folders + permissions
│   ├── companyFile.ts      # files / metadata / OCR extraction
│   ├── fileMetadataKey.ts  # CRUD
│   ├── agentPermission.ts  # CRUD
│   ├── dataTable.ts        # tables / fields / records
│   ├── workflow.ts         # workflows / steps / connections / statuses / permissions
│   ├── agent.ts            # categories / configurations / AI helpers
│   └── notification.ts     # list / markRead / sendAssignment
└── shared/
    ├── descriptions.ts     # idField()/jsonBodyField()/optionalQuery() helpers + id constants
    └── transport.ts        # getExecutionDataKeys() loadOptions method
```

Each resource file defines an `Operation` `options` property whose options carry the
`routing.request` (method + URL expression). Path params come from `{{$parameter.x}}` in the
URL; typed body fields use `routing.send.type: 'body'`; endpoints with a generic `{type:object}`
body use a shared `body` JSON field forwarded via `routing.request.body`. Operation `options`
must stay alphabetically sorted by `name` (enforced by the n8n ESLint rule, not auto-fixed).

> **Not implemented:** the multipart/form-data binary upload endpoints (`/files/documents/upload`,
> `/files/upload`, `/companies/{id}/folders/{id}/upload`, `/companies/{id}/documents/upload`,
> `/companies/{id}/documents/split-pdf/auto`) — declarative routing can't stream binary bodies.
> Use the core n8n HTTP Request node for those.

### Dynamic key loading (`updateData`)

The `execution` resource's `updateData` operation uses a `fixedCollection` whose inner `key` field has `typeOptions.loadOptionsMethod: 'getExecutionDataKeys'`. The loader in `shared/transport.ts` calls `GET /api/workflows/executions/{executionId}`, reads the `execution_data_mapped` object from the response, and returns its keys as dropdown options. The `executionId` is read via `this.getCurrentNodeParameter('executionId')` at load time.

### Credentials

`credentials/PicobelloApi.credentials.ts` implements `ICredentialType` with:
- `apiKey` — password field, injected as the `x-api-key` header via `IAuthenticateGeneric`
- `accessToken` — optional password field; when set, injected as `Authorization: Bearer <jwt>` (most company/folder/agent/notification endpoints are documented as `BearerAuth`)
- `baseUrl` — defaults to `https://go.picobello.app`; change for self-hosted instances

The node's `requestDefaults.baseURL` is `={{$credentials?.baseUrl}}/api`, so all declarative routing URLs are relative paths (e.g. `/workflows/executions/{{$parameter.executionId}}`). The API origin is `https://go.picobello.app/api` per `picobello-api-documentation.json`.

### TypeScript config

`tsconfig.json` targets ES2019, enables strict mode, and outputs to `dist/`. Linting uses n8n's shared ESLint config (`eslint.config.mjs`). Formatting: Prettier with tabs (width 2), single quotes, trailing commas, 100-character line width (`.prettierrc.js`).

### CI/CD

- **ci.yml** — runs lint + build on every PR and push to `master`.
- **publish.yml** — publishes to npm on version tags using OIDC Trusted Publishing.
