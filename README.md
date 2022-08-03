# Welcome to the Epoc frontend

Run `yarn install` to install all dependencies (we're assuming you've got `yarn` installed already).

To run the project locally in development mode, run `yarn dev`.

To generate types from the backend, be sure that you've got the backend running locally and run `yarn types`. This will generate types for you to the types folder in `lib/types/api.ts` file.

## Run app in dev mode
Requirements:
- Working [secrets](https://github.com/three-consulting/secrets)
- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) with correct access rights
- docker installed (compose is included in latest versions)
    - OBS! Some (linux) users might have to add `docker` into user groups. [Docker post installation](https://docs.docker.com/engine/install/linux-postinstall/)

To run the app with backend locally, run `yarn dev-local`.

## Commitlint

This project uses a commit message linter called [commitlint](https://github.com/conventional-changelog/commitlint). Commitlit excepcts your commit messages to look like this: `type(scope?): message`. The accepted type parameters currently are:

* chore
* build
* ci
* docs
* feat
* fix
* perf
* refactor
* revert
* style
* test

Scope on the other hand is an optional parameter that's completely arbitrary. The purpose of scope is to provide additional context as to what part of the code base a given commit is affecting.

Apart from type and scope commitlint also defines how the message part should be written in two distinct ways:

* Each commit message has a maximun length of 100 characters
* Commit messages can not start with a capital letter
* the message may not end with full stop

Some examples of commit messages that pass the linter and that fail follows:

* `fix: added color checkers` (passes)
* `fix: Added color checkers` (fails, message begins with a capitalised letter)
* `feat: don't use periods at the end of commit messages` (passes)
* `feat: i sure do enjoy a good dot.` (fails, message ends with a period)
* `build: this is a very long message. well ok not that long, but we're aiming for over 80 characters. can you believe that?` (fails, over a 100 characters long)

So far we haven't really utilised the `scope` variable, but as the codebase grows its usage might also be warranted.
