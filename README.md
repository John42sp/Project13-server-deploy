# Project13-myorphanage-fullstack

Server-web-mobile

Deployed through Heroku and Netlify: https://myorphanage.netlify.app/
API Rest. 
Technologies: Typeorm, Typescript, Postgress Database, Node.js, Express, JWT Authentication, Multer,  Yup validation, Leaflet Maps, Nodemailer/Mailtrap, React.js, React Native, Expo. 
Features:
•	User registration with e-mail verification service and yup validation; 
•	Password recovery;
•	Login with JWT authentication. Password change;
•	Organization registration  through  interactive map location, video and image file uploads, and simple text imputs;
•	checkJwt and checkRole route middlewares to distinguish users’ permission and hierarquical set of rules;
Main page after login consists of a map, centered by the user’s actual location, displaying icons representing registered organizations. These clickable icons direct user to the organization's profile page.
Schema type models and typeorm migration tables. User has relation with token and organization. Organization has relation with images.


<br>

<h1 align="center">
  <img alt="C13-DeployWebProject" title="C13-Deploy-WebProject" src=".github/logo.png" />
</h1>

<p align="center">
  <a href="#-tecnologias">Tecnologies</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-projeto">Project</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-layout">Layout</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-como-executar">How to execute</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-licença">License</a>
</p>

## 💻 Project
FULL-STACK WEB PROJECT 

TypeORM, Typescript

Backend: Node.js, express, nodemailer/mailtrap, etc
Database: Postgres
Frontend: React.js
Mobile: React Native, Expo

## ✨ Tecs

<!-- Esse projeto foi desenvolvido com as seguintes tecnologias: -->

- [React](https://reactjs.org)
- [TypeScript](https://www.typescriptlang.org/)



## 🚀 How to execute

- Clone the repo
- Install dependencies as `yarn`
- Initialize the server with `yarn dev`

Now you may access [`localhost:3000`](http://localhost:3000) from your browser.

## 📄 License

Project under MIT license standard. See file [LICENSE](LICENSE.md) for more details.
