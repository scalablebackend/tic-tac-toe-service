# Micro-Service: Tic-Tac-Toe

An example of micro-service to be used in cooperation with the [score service](https://github.com/scalablebackend/score-service).

It's made with [Express](https://expressjs.com) (and [TypeScript](https://www.typescriptlang.org)), and send events through [kafka](https://kafka.apache.org). It uses an in-memory implementation as a database.

This Tic-Tac-Toe is a Back-End implementation of the known [Front-End game](https://codesandbox.io/p/sandbox/react-dev-q2z497). It also sends event when a game is won to the [score service](https://github.com/scalablebackend/score-service).

## Installation

- Install dependencies (recommended with `yarn`).
- Copy `.env.example` to `.env`.
- Start a kafka instance (available with `docker-compose` inside this project).
- Start the tic-tac-toe service with `yarn dev`.
- Also, start the `score service`.

## Learn micro-services in-depth

If you want to learn how we use micro-services in the real world, feel free to have a look at:

- The theory behind micro-services ([free articles](https://blog.scalablebackend.com))
- How we create micro-services in a professional environment ([practical course](https://www.scalablebackend.com/courses/micro-services-in-practice-how-to-properly-split-a-monolith))

## Usage

- Win a game of tic-tac-toe, connected to the same kafka instance than the [score service](https://github.com/scalablebackend/score-service):
  - To get started, initialize the board with a request to `http://localhost:4000/tic-tac-toe/initialize`.
  - Play to win with X by sending POST requests: `http://localhost:4000/tic-tac-toe/play?step=0&square=0`.
  - Play to win with X by sending POST requests: `http://localhost:4000/tic-tac-toe/play?step=1&square=8`.
  - Play to win with X by sending POST requests: `http://localhost:4000/tic-tac-toe/play?step=2&square=1`.
  - Play to win with X by sending POST requests: `http://localhost:4000/tic-tac-toe/play?step=3&square=7`.
  - Play to win with X by sending POST requests: `http://localhost:4000/tic-tac-toe/play?step=4&square=2`.
- Send a GET request to the [score service](https://github.com/scalablebackend/score-service) `http://localhost:4001/score` to see the list of game won.