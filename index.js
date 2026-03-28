const express = require('express');
const app = express();

// Aapke saare routes yahan honge...
app.get('/', (req, res) => {
  res.send('API is running!');
});

// Ye line sabse important hai Vercel ke liye
module.exports = app; 

// Local testing ke liye ye rehne dein
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
