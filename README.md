# monolith (alpha)

<p align="left">
  <img src="https://badgen.net/github/release/loouislow81/monolith-alpha">
  <img src="https://badgen.net/github/releases/loouislow81/monolith-alpha">
  <img src="https://badgen.net/github/assets-dl/loouislow81/monolith-alpha">
  <img src="https://badgen.net/github/branches/loouislow81/monolith-alpha">
  <img src="https://badgen.net/github/forks/loouislow81/monolith-alpha">
  <img src="https://badgen.net/github/stars/loouislow81/monolith-alpha">
  <img src="https://badgen.net/github/watchers/loouislow81/monolith-alpha">
  <img src="https://badgen.net/github/tag/loouislow81/monolith-alpha">
  <img src="https://badgen.net/github/commits/loouislow81/monolith-alpha">
  <img src="https://badgen.net/github/last-commit/loouislow81/monolith-alpha">
  <img src="https://badgen.net/github/contributors/loouislow81/monolith-alpha">
  <img src="https://badgen.net/github/license/loouislow81/monolith-alpha">
</p>

<p align="left">
  <img src="Screenshot_1.jpeg" width="420">
</p>

All-purpose cloud IDE packed with peer environment, linters, debuggers, compilers, terminal, git, offline-env, etc.

**Recommended** to use the Docker container application.

# docker

get the container,

```bash
$ docker pull loouislow81/monolith-alpha:latest
```

run the container,

```bash
$ docker run -it -p 8787:8787 -v /path/to/your/project/folder:/opt/monolith/workspace loouislow81/monolith-alpha:latest
```

run the container at background,

```bash
$ docker run -it -d -p 8787:8787 -v /path/to/your/project/folder:/opt/monolith/workspace loouislow81/monolith-alpha:latest
```

# usage

on your web browser, enter this IP Block **http://youripaddress:8787**

predefined test user login and password,

- user1 (user1@test.com, user1)
- user2 (user2@test.com, user2)
- user3 (user3@test.com, user3)
- user4 (user4@test.com, user4)
- user5 (user5@test.com, user5)

to add more or change the predefined user accounts, you will need to edit `run-stack.conf` file. As for Docker container application, you will need to recompile yourself a new container with the `Dockerfile` provided.

Enjoy!

---

[MIT](https://github.com/loouislow81/monolith-alpha/blob/master/LICENSE)
