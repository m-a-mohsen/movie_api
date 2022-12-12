
# CareerFoundry - Server-Side Programming & Node.js

This is a the a combined solution for the third achievement in fullstack Server-Side Programming & Node.js.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)

- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)

## Overview

### The challenge

Essential Features

- Return a list of ALL movies to the user
- Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user.
- Return data about a genre (description) by name/title (e.g., “Thriller”).
- Return data about a director (bio, birth year, death year) by name.
- Allow new users to register.
- Allow users to update their user info (username, password, email, date of birth).
- Allow users to add a movie to their list of favorites.
- Allow users to remove a movie from their list of favorites.
- Allow existing users to deregister.

### Screenshot

![screen shot](markup/ScreenShot.png)

## My process

### Built with
<!-- [![My Skills](https://skillicons.dev/icons?i=vscode,js,nodejs,html,css,bootstrap,mongo,express,bash,git,github)](https://skillicons.dev) -->
<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=vscode,js,nodejs,html,css,bootstrap,mongo,express,bash,git,github,azure,githubactions" />
  </a>
</p>

### Additional tools

- Eslint.
- Markdownlint.
- Airbnb style guid.
- Postman.

### What I learned

This achievement was a big dive in backend stack. I have learned about servers, networking, security, deployment and databases. I was surprised that all pieces finally worked together. Developing a backend service sill seems fragile to me; it can break with any small mistake. Below are some of the the things that i learned during the achievement

To see how you can add code snippets, see below:

#### Mongo installation on Ubuntu 22.04 Jammy

there was now direct installation method for lts 22.04, installation script was found on [Mongodb forum](https://www.mongodb.com/community/forums/t/installing-mongodb-over-ubuntu-22-04/159931/89)

```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc |  gpg --dearmor | sudo tee /usr/share/keyrings/mongodb.gpg > /dev/null

echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

sudo apt update
sudo apt install mongodb-org
```

```css
.proud-of-this-css {
  color: papayawhip;
}
```

```js
const proudOfThisFunc = () => {
  console.log('🎉')
}
```

### Continued development

- Database seems important topic worth investing additional efforts in next project.
- Git / Github skills has to be improved.
- eslint / prettier configurations can be optimized.

### Useful resources

- [Example resource 1](https://www.example.com) - This helped me for XYZ reason. I really liked this pattern and will use it going forward.
- [Example resource 2](https://www.example.com) - This is an amazing article which helped me finally understand XYZ. I'd recommend it to anyone still learning this concept.
