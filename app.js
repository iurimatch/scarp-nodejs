const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;
const url = 'https://www.gwp.ge/ka/gadaudebeli/5615-tbilisis-zogiert-quchas-tskhalmomarageba-sheezghudeba';
// Function to scrape data from a webpage
async function scrapeData() {
    try {
        // URL of the webpage to scrape
       

        // Fetch the webpage
        const response = await axios.get(url);

        // Load the HTML content into Cheerio
        const $ = cheerio.load(response.data);
        

        // Extract text from all <p> tags
        const paragraphs = $('p').map((index, element) => $(element).text()).get();

        const headings1 = $('h1').map((index, element) => $(element).text()).get();
        // Extract text from all <h2> tags
        const headings = $('h2').map((index, element) => $(element).text()).get();

        const spans= $('span').map((index, element) => $(element).text()).get();
        const divs =$('div').map((index, element) => $(element).text()).get();

        // Return the scraped data
        return { paragraphs, headings1, headings,spans,divs };

    } catch (error) {
        console.error('Error:', error);
        return { error: 'Failed to scrape data' };
    }
}

// Route to serve scraped data
app.get('/', async (req, res) => {
    try {
        // Scrape data from the webpage
        const { paragraphs, headings1, headings,spans,divs, error } = await scrapeData();

        // If there was an error during scraping, return an error response
        if (error) {
            return res.status(500).send(error);
        }

        // Otherwise, send the scraped data as JSON response
        res.json({ paragraphs, headings1,spans,divs, headings });
        
        paragraphs.forEach(paragraph => {
            if (paragraph.includes('თბილ')) {
                console.log('hello');
            }
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
