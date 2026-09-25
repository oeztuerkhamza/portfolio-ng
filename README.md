# PortfolioNg

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.19.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Tests

The project has two runtimes, so it has two test commands:

```bash
npm test          # Angular side: Karma + Jasmine, watches files
npm run test:ci   # the same, once, in headless Chrome (containers, CI)
npm run test:server   # the Node API in src/server/
npm run test:all      # both, one after the other
```

**Angular** specs live next to their component as `*.spec.ts` and run in a
real browser through Karma. `npm test` opens Chrome and watches; `test:ci`
uses the `ChromeHeadlessNoSandbox` launcher from `karma.conf.js`, which also
works as root inside a container.

**The server API** (`src/server/`) is Node code — `node:crypto`,
`process.env`, `fetch` — and does not run in a browser, so it is tested with
the Node test runner instead. Those specs are named `*.node-spec.ts` so Karma
leaves them alone. Node cannot load them directly, because imports across the
project are written without a file extension; `scripts/test-server.mjs`
therefore bundles each spec with esbuild first, exactly as `api/index.js` is
built, and typechecks them against `tsconfig.server-spec.json`.

The Stripe specs never reach the network: a local HTTP server stands in for
Stripe so the error paths — invalid key, 403, 503, unreachable, unparseable
answer — run for real.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
