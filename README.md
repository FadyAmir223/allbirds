## clone of `allbirds.com` but better

https://youtu.be/WzoeQ23yMCM


the current version uses nginx & docker

in another branch a working version may be provided in the future

using
  - frontend: github-pages or netlify
  - backend: vercel
  - database: atlas

but the current version is the realistic one


# requirements:
- docker

## usage:

### development
```bash
npm run dev
npm run dev:down
```


### server test
mongodb-memory-server needs non-alpine node image so i will test locally
requirements:
  - npm
  - mongodb

```bash
npm run test --prefix=server
```


#### production test
```bash
npm run compose:prod -- up -d
npm run compose:prod down
```

#### rebuild
```bash
npm run compose:prod -- build [service]
npm run compose:prod -- --force-recreate [service]
```

### production
```bash
npm run prod
```

### run a command
```bash
npm run client/server [command]
```

### using husky for lint-staged
git config core.hooksPath client/.husky
