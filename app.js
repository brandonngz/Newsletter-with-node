'use strict';

const express = require('express');
const https = require('https');

const app = express();
const port = 3000;

// Mailchimp
const mailchimp = require("@mailchimp/mailchimp_marketing");
const md5 = require("md5");
mailchimp.setConfig({
    apiKey: "dc39633aa8b3abadf1878ab15abbbaec-us20",
    server: "us20"
});

// allows to apply style to the page.
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

app.get('/', (req, res)=>{
    res.sendFile(__dirname + "/signup.html");
});
const listId = "efb3d1ab7b";
app.post('/', (req, res)=>{
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.inputEmail;

    
    const subscribingUser = {
    firstName: fname,
    lastName: lname,
    email: email
    };

    async function run() {
        try {
            const response = await mailchimp.lists.addListMember(listId, 
                {
                    email_address: subscribingUser.email,
                    status: "subscribed",
                    merge_fields: {
                    FNAME: subscribingUser.firstName,
                    LNAME: subscribingUser.lastName
                }
            });
            res.sendFile(__dirname + "/success.html");
            console.log(`Successfully added contact as an audience member. The contact's id is ${response.id}.`);
        } catch (error) {
            res.sendFile(__dirname + "/failure.html");
        }

}
    run();  
});



// Redirect to main page when submit button is pressed.
app.post('/failure', (req, res)=>{
    res.redirect('/');
});
app.listen(process.env.PORT || port, ()=>{
    console.log(`http://localhost:${port}`);
});

// API Key
// dc39633aa8b3abadf1878ab15abbbaec-us20

// List I
// efb3d1ab7b