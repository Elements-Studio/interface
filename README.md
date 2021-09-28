## Run the Interface

```
yarn install
yarn i18n:extract
yarn start
```

Open Chrome and go to `http://localhost:3000`

## Build the Interface

```
yarn build
```

If you want to see it locally, try to use `serve` to serve the static files:

```
npm install -g serve
serve -s build
```

Open Chrome and go to `http://localhost:5000`

## Deploy the Interface

```
git tag vx.x.x
git push --tag
```

`vx.x.x` means the latest version, such as `v0.1.2`
