# clone to `allbirds.com`


# requirements:
- docker

# usage:

## development
```bash
npm run dev
npm run dev:down
```


## production
```bash
npm run prod
```

### production test
```bash
npm run compose:prod -- up -d
npm run compose:prod down
```

### rebuild
```bash
npm run compose:prod -- build [service]
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

## using husky for lint-staged
git config core.hooksPath client/.husky

## remove production database
  - docker exec -it 3-allbirds-database-1 sh
  - mongosh -u <user> -p <password>
  - show dbs
  - use <db>
  - db.dropDatabase('<db>')
