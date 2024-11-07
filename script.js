let randomNumber = Math.floor(Math.random() * 500) + 1;
let attempts = 0;
let maxAttempts = 20;
let sensorData = { acceleration: { x: 0, y: 0, z: 0 }, rotationRate: { alpha: 0, beta: 0, gamma: 0 } };  // 센서 데이터 저장 객체
let deviceInfo = navigator.userAgent;  // 기기 정보

// 모션 센서 데이터 수집 배열
let motionData = [];

const SERVER_URL = "http://localhost:3000/";

// DeviceMotionEvent로 가속도 및 회전 속도 데이터 수집
function handleMotionEvent(event) {
    const { acceleration, rotationRate } = event;
    const data = {
        timestamp: Date.now(),
        acceleration: {
            x: acceleration.x || 0,
            y: acceleration.y || 0,
            z: acceleration.z || 0
        },
        rotationRate: {
            alpha: rotationRate.alpha || 0,
            beta: rotationRate.beta || 0,
            gamma: rotationRate.gamma || 0
        }
    };
    motionData.push(data);
    if (motionData.length > 50) motionData.shift(); // 데이터 개수 제한
}

// 서버로 모션 센서 데이터 전송
function sendMotionData() {
    if (motionData.length > 0) {
        fetch(SERVER_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ motionData })
        })
        .then(response => response.json())
        .then(data => console.log("Data sent to server:", data))
        .catch(error => console.error("Error sending data:", error));

        motionData = []; // 전송 후 배열 초기화
    }
}

// 주기적으로 모션 데이터를 서버에 전송
setInterval(sendMotionData, 5000);  //5초마다 전송

function startMotionCapture() {
    if (window.DeviceMotionEvent) {
        window.addEventListener("devicemotion", handleMotionEvent);
    } else {
        console.warn("DeviceMotionEvent is not supported on this device.");
    }
}

// 게임 로직
document.getElementById('submitGuess').addEventListener('click', function() {
    const guessInput = document.getElementById('guess').value.trim();
    const guess = Number(guessInput);
    attempts++;
    let resultText = '';
    let attemptsLeft = maxAttempts - attempts;

    if (guessInput === '') {
        alert('숫자를 입력하세요.');
        attempts--;
        return;
    } else if (guess < 1 || guess > 500) {
        resultText = '1부터 500 사이의 숫자를 입력하세요.';
    } else if (guess > randomNumber) {
        resultText = '더 작은 숫자를 시도해 보세요.';
    } else if (guess < randomNumber) {
        resultText = '더 큰 숫자를 시도해 보세요.';
    } else {
        resultText = `축하합니다! ${attempts}번 만에 맞추셨습니다!`;
        document.getElementById('result').innerText = resultText;
        document.getElementById('attemptsLeft').style.display = 'none';
        document.getElementById('restart').style.display = 'block';
        document.getElementById('submitGuess').disabled = true;
        return;
    }

    if (attempts >= 5 && attempts < 10) {
        resultText += ` \n(힌트 : ${randomNumber.toString().length}자리 숫자입니다.)`;
    } else if (attempts >= 10 && attempts < 15) {
        const lastDigit = randomNumber % 10;
        resultText += ` \n(힌트 : 마지막 자리 숫자는 ${lastDigit}입니다.)`;
    } else if (attempts >= 15 && attempts < 20) {
        const secondDigit = Math.floor((randomNumber % 100) / 10);
        resultText += ` \n(힌트 : 두 번째 자리 숫자는 ${secondDigit}입니다.)`;
    }

    if (attemptsLeft > 0 && resultText.includes('시도해 보세요.')) {
        document.getElementById('result').innerText = resultText;
        document.getElementById('attemptsLeft').innerText = `남은 횟수: ${attemptsLeft}`;
    } else if (attemptsLeft === 0 && !resultText.includes('축하합니다!')) {
        resultText = '모든 횟수를 다 사용했습니다. 다시 시도해 보세요!';
        document.getElementById('restart').style.display = 'block';
        document.getElementById('submitGuess').disabled = true;
        document.getElementById('attemptsLeft').innerText = `남은 횟수: 0`;
    }

    document.getElementById('result').innerText = resultText;
});

document.getElementById('restart').addEventListener('click', function() {
    randomNumber = Math.floor(Math.random() * 500) + 1;
    attempts = 0;
    document.getElementById('result').innerText = '';
    document.getElementById('guess').value = '';
    document.getElementById('attemptsLeft').innerText = `남은 횟수: ${maxAttempts}`;
    document.getElementById('attemptsLeft').style.display = 'block';
    document.getElementById('restart').style.display = 'none';
    document.getElementById('submitGuess').disabled = false;
});

// 페이지 로드 시 센서 데이터 설정 및 모션 캡처 시작
window.onload = function() {
    // setupSensorData();
    startMotionCapture();
    console.log("기기 정보:", deviceInfo);
};
