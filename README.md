# requirements:
- docker

# usage:

## development
```bash
npm run dev
npm run dev:down
```

## production test
```bash
npm run compose:prod -- up -d
npm run compose:prod down
```

## production
```bash
npm run prod
```

## rebuild
```bash
npm run compose:prod -- --build [service]
npm run compose:prod -- --force-recreate [service]
```

## run a command
```bash
npm run client/server [command]
```

## test
mongodb-memory-server needs non-alpine node image so i will test locally
requirements:
  - npm
  - mongodb

```bash
npm run test --prefix=server
```
