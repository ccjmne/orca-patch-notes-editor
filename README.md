# orca-patch-notes-editor

Web application for editing and publishing patch notes for NCLS Development's Orca solution.

Developed with:

- Google [Angular 5](https://angular.io/)

  - Language: [TypeScript](https://www.typescriptlang.org/)
  - Reactive library: [RxJs](http://reactivex.io/rxjs/)
  - Packaging: Pure [Webpack](https://webpack.js.org/) (no Angular CLI involved)

- The [Angular Material](https://material.angular.io/) components library

## See also

[`orca-patch-notes`](https://github.com/ccjmne/orca-patch-notes)

The Serverless API backend for this project leveraging [AWS CloudFormation](https://aws.amazon.com/cloudformation/)

## Development

Set the project up for development once using `npm install`.

```
npm start
```

Starts a web server with livereload using [webpack-dev-server](https://github.com/webpack/webpack-dev-server) on port `8001`.<br>
Access it at `http://localhost:8001/webpack-dev-server`.

## Production build

```
npm run build
```

Produces distribution under `dist/`.
