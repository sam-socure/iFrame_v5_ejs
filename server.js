const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Route to render the EJS page
app.get('/', (req, res) => {
    res.render('index', { iframeUrl: '' });
});

// API route to call Socure and return a URL
app.post('/generate-url', async (req, res) => {
    try {
        const response = await axios.post(
            'https://service.socure.com/api/5.0/documents/request',
            {
                config: {
                    sendMessage: true,
                    language: 'en',
                    useCaseKey: 'noselfie'
                },
                mobileNumber: '+1 enter phoneNumber',
                customerUserId: 'nativeFlow1'
            },
            {
                headers: {
                    Authorization: 'SocureApiKey enterAPiKey',
                    'Content-Type': 'application/json'
                }
            }
        );
        const docvUrl = response.data.data.url;
        res.json({ url: docvUrl });
    } catch (error) {
        console.error('Error fetching document request URL:', error);
        res.status(500).json({ error: 'Failed to generate document request URL' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
