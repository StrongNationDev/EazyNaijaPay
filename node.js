const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const AIRTIME_API_URL = "https://www.husmodata.com/api/topup/";
const DATA_API_URL = "https://www.husmodata.com/api/data/";
// const AUTH_TOKEN = "8f00fa816b1e3b485baca8f44ae5d361ef803311";
const AUTH_TOKEN = "4e1232989bd072dc935c84de444f64025ce874f4";

app.post("/proxy/topup", async (req, res) => {
    try {
        const fetch = (await import("node-fetch")).default;
        const response = await fetch(AIRTIME_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Token ${AUTH_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(req.body),
        });

        const data = await response.json();
        console.log("Husmodata API Response (Top-Up):", data);
        res.status(response.status).json(data);
    } catch (error) {
        console.error("Error in Top-Up Proxy:", error);
        res.status(500).json({ error: "Failed to fetch data from API." });
    }
});

app.post("/proxy/data", async (req, res) => {
    try {
        const fetch = (await import("node-fetch")).default;
        const response = await fetch(DATA_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Token ${AUTH_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(req.body),
        });

        const data = await response.json();
        console.log("Husmodata API Response (Data Purchase):", data);
        res.status(response.status).json(data);
    } catch (error) {
        console.error("Error in Data Purchase Proxy:", error);
        res.status(500).json({ error: "Failed to fetch data from API." });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
