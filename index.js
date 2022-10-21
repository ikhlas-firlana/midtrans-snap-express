require('dotenv').config({path: `${process.cwd()}/.env`});
const express = require('express');
const axios = require('axios');

const app = express()
const port = 3000

app.get('/', async (req, res) => {
  try {
    const response = await axios.post('https://app.sandbox.midtrans.com/snap/v1/transactions', {
        "transaction_details": {
          "order_id": Date.now(),
          "gross_amount": 10000
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(process.env.SERVER_KEY).toString('base64')}`,
        },
      });

    if (response?.data?.redirect_url) {
      return res.redirect(response?.data?.redirect_url);
    }
    console.log(`response`, response);
    return res.json(response?.data);
  } catch (e) {
    console.log(`error`, e?.message || e?.stack || e);
    res.status(500).send(e?.message || e?.stack || e);
  }
})
app.get('/midtrans/callback', async (req, res) => {
  console.log(`:params:`,   JSON.stringify(req?.params) );
  console.log(`:query:`,   JSON.stringify(req?.query) );
  return res.status(200).json({
    ...req?.query,
    ...req?.params,
  });
})
app.listen(port, () => {
  console.log(`listening on port ${port}`)
})
