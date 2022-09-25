import express from 'express';

const app = express();
const port = process.env.PORT || 5500;

app.listen(port, () => console.log(`Server is running on PORT = ${port}`))