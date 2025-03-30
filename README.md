# SvelteKit Push Notification Example

## Get Vapid keys

```bash
npx web-push generate-vapid-keys
```

Set public and private keys to `.env` file:

```bash
cp .env.example .env
```

## Development

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
```

## Preview build

```bash
pnpm preview
```

## Deployment

see [docs](https://svelte.dev/docs/kit/adapters)
