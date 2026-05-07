let express = require("express");

let app = express();

app.use(express.json());

app.use('/api/products', require("./routes/products"));

app.listen(3000, () => {
    console.log(`Application successfully started and Listening on port 3000. http://localhost:3000`)
});
