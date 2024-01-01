
import {config} from "dotenv";
import nodemailer from "nodemailer";

config();
console.log(process.env.PORT);

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
