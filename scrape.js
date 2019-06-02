const request = require('request')
const cheerio = require('cheerio')
const express = require('express')
const app = express()

app.use(express.json()) // for parsing application/json
app.get('/', (req, res) => {
    res.send('Hello World')
})

app.get('/api/stocks', async (req, res) => {
    const { stockId } = req.body
    if (stockId) {
        const stockPrice = await new Promise(
            (resolve, reject) => {
                request(`https://finance.yahoo.com/quote/${stockId}/`,
                    (error, response, html) => {
                        if (!error && response.statusCode == 200) {
                            const $ = cheerio.load(html)
                            const header = $('#quote-header-info')
                            const price = header.find('span[data-reactid=34]').text()
                            resolve(price)
                        }
                        reject(error);
                    }
                )
            }
        )
        res.send({ stockPrice })
    }
})

app.listen(3000, () => console.log('Listening on PORT 3000...'))

