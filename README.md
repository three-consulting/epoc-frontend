# Welcome to the Epoc frontend

Run `yarn install` to install all dependencies (we're assuming you've got `yarn` installed already).

To generate types from the backend, be sure that you've got the backend running locally and run `yarn types`. This will generate types for you to the types folder in `lib/types/api.ts` file.

## Run app in dev mode
Requirements:
- Working [secrets](https://github.com/three-consulting/secrets)
- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) with correct access rights
- docker installed (compose is included in latest versions)
    - OBS! Some (linux) users might have to add `docker` into user groups. [Docker post installation](https://docs.docker.com/engine/install/linux-postinstall/)

To run the app with containerized backend and db locally, run `yarn dev-local` (starts local frontend, backend and db).

To run the app with separate backend, run `yarn dev-local-frontend` (starts only frontend).

To run the app using the backend deployed in heroku, run `yarn dev-heroku`.
