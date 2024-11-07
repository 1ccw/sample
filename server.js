const { MongoClient } = require('mongodb');

// MongoDB Cloud 연결 URL과 데이터베이스 설정
const uri = "mongodb+srv://privacy:<db_password>@privacy.8c1ya.mongodb.net/?retryWrites=true&w=majority&appName=privacy";
const client = new MongoClient(uri);

async function connectToMongoDB() {
    try {
        await client.connect();
        console.log("MongoDB에 연결되었습니다.");
        return client.db("sensor_data").collection("readings");
    } catch (error) {
        console.error("MongoDB 연결 실패:", error);
    }
}

// 센서 데이터를 MongoDB에 저장하는 함수
async function saveSensorData(data) {
    const collection = await connectToMongoDB();
    try {
        await collection.insertOne(data);
        console.log("센서 데이터가 MongoDB에 저장되었습니다:", data);
    } catch (error) {
        console.error("데이터 저장 실패:", error);
    }
}

// 예제 센서 데이터 객체
let sensorData = { alpha: 0, beta: 0, gamma: 0 };

// 센서 데이터 업데이트 함수 (실제 데이터를 업데이트할 때 사용)
function updateSensorData(newData) {
    sensorData = newData;
    saveSensorData(sensorData);
}

// 주기적으로 센서 데이터 수집 및 저장 (예: 5초마다)
setInterval(() => {
    const data = {
        alpha: Math.random() * 360,  // 예제 데이터
        beta: Math.random() * 180,
        gamma: Math.random() * 90,
        timestamp: new Date()
    };
    updateSensorData(data);
}, 5000);
