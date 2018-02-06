// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  baseUrl: 'http://localhost:8080/admin-api'
};

// https://stackoverflow.com/questions/40424199/angular-2-testing-process-env
// https://stackoverflow.com/questions/36528824/pass-environment-variables-to-an-angular2-app
