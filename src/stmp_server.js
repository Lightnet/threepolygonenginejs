
import {config} from "dotenv";
import nodemailer from "nodemailer";
import {SMTPServer} from 'smtp-server';

config();
console.log(process.env.PORT);
// https://nodemailer.com/extras/smtp-server/
function onAuth(auth, session, callback){
  if (auth.username !== "abc" || auth.password !== "def") {
    return callback(new Error("Invalid username or password"));
  }
  callback(null, { user: 123 }); // where 123 is the user id or similar property
}

const server_options = {
  onAuth:onAuth,
};

const server = new SMTPServer(server_options);
server.on("error", (err) => {
  console.log("Error %s", err.message);
});
server.listen(465);
console.log("init mail server...");















/*
const transport = {
  //this is the authentication for sending email.
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use TLS
  //create a .env file and define the process.env variables with your credentials.
  auth: {
    user: process.env.SMTP_TO_EMAIL,
    pass: process.env.SMTP_TO_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(transport)
    transporter.verify((error, success) => {
if (error) {
    //if error happened code ends here
    console.error(error)
} else {
    //this means success
    console.log('Ready to send mail!')
}
})
*/
