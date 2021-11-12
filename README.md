# Welcome to the Epoc frontend

Run `yarn install` to install all dependencies (we're assuming you've got `yarn` installed already).

To run the project locally in development mode, run `yarn dev`.

To generate types from the backend, be sure that you've got the backend running locally and run `yarn types`. This will generate types for you to the types folder in `lib/types/api.ts` file.

## Docker compose

To spin up the backend run `docker-compose -f epoc-compose.yaml up`
