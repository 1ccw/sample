const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const app = express();
app.use(express.json());

const uri = "mongodb+srv://privacy:<db_password>@privacy.8c1ya.mongodb.net/?retryWrites=true&w=majority&appName=privacy";
const client = new MongoClient(uri);

client.connect().then(() => {
    console.log("MongoDB에 연결되었습니다.");
    const collection = client.db("sensor_data").collection("readings");

    app.post('/api/sensorData', async (req, res) => {
        try {
            await collection.insertOne(req.body);
            res.json({ message: '데이터가 성공적으로 저장되었습니다.' });
        } catch (error) {
            console.error("데이터 저장 오류:", error);
            res.status(500).json({ message: '데이터 저장에 실패했습니다.' });
        }
    });

    app.listen(3000, () => {
        console.log("서버가 포트 3000에서 실행 중입니다.");
    });
}).catch(error => console.error("MongoDB 연결 실패:", error));
