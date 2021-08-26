# Project13-myorphanage-fullstack

<br>

<h1 align="center">
  <img alt="Project13-fullstack-myorphanage" title="Project13-fullstack-myorphanage" src=".github/logo.png" />
</h1>

Server-web-mobile

Deployed through Heroku and Netlify: https://myorphanage.netlify.app/

<p align="center">
  <a href="#-tecnologias">Tecnologies</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-projeto">Project</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-layout">Layout</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-como-executar">How to execute</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-licença">License</a>
</p>

## 💻 Project

API REST - WEB FULLSTACK

Features:
•	User registration with e-mail verification service and yup validation; 
•	Password recovery;
•	Login with JWT authentication. Password change;
•	Organization registration  through  interactive map location, video and image file uploads, and simple text imputs;
•	checkJwt and checkRole route middlewares to distinguish users’ permission and hierarquical set of rules;

Main page after login consists of a map, centered by the user’s current location, displaying icons representing registered organizations. These clickable icons direct user to the organization's profile page.
Schema type models and typeorm migration tables. User has relation with token and organization. Organization has relation with images.


## ✨ Tecnologies

<!-- Esse projeto foi desenvolvido com as seguintes tecnologias: -->

Backend: Typeorm, Typescrip, Node.js, Express, Nodemailer/mailtrap, JWT Authentication, Multer, Yup validation,  etc
Database: Postgres
Frontend: React.js, Leaflet Maps 
Mobile: React Native, Expo
- [React](https://reactjs.org)
- [TypeScript](https://www.typescriptlang.org/)



## 🚀 How to execute

- Clone the repo
- Install dependencies as `yarn`
- Initialize the server with `yarn dev`

Now you may access [`localhost:3000`](http://localhost:3000) from your browser.

## 📄 License

Project under MIT license standard. See file [LICENSE](LICENSE.md) for more details.
