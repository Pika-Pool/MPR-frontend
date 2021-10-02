# Minor Project

## How to run on localhost

> **Note**: [`pnpm`](https://pnpm.io/installation) is recommended way, but you can also use `npm`.
> Just replace `pnpm` with `npm` and it'll work. Just like magic✨

Install [`pnpm`](https://pnpm.io/installation) globally(if not already done):

```sh
npm install -g pnpm
```

Install project dependencies:

```sh
pnpm install
```

To run in dev mode mode:

```sh
pnpm run dev
```

Then go to http://localhost:3000

To create a production build:

```sh
pnpm run build
```

> **Do not forget to use the `lint` and `format` scripts before committing.**
> Make that easier by downloading the recommended extensions under `.vscode/extensions.json`
