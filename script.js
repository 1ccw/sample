let randomNumber = Math.floor(Math.random() * 500) + 1;
let attempts = 0;
let maxAttempts = 20;
let sensorData = { acceleration: { x: 0, y: 0, z: 0 }, rotationRate: { alpha: 0, beta: 0, gamma: 0 } };  // 센서 데이터 저장 객체
let deviceInfo = navigator.userAgent;  // 기기 정보

// 권한 요청 및 센서 데이터 가져오는 함수
function setupSensorData() {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        // iOS 13+ 환경에서 권한 요청
        DeviceOrientationEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    window.addEventListener("deviceorientation", handleOrientation);
                } else {
                    alert("센서 데이터 접근이 거부되었습니다.");
                }
            })
            .catch(console.error);
    } else {
        // Android 및 다른 환경
        window.addEventListener("deviceorientation", handleOrientation);
    }
}

// 센서 데이터 업데이트 함수
function handleOrientation(event) {
    sensorData.alpha = event.alpha;
    sensorData.beta = event.beta;
    sensorData.gamma = event.gamma;
    console.log('센서 데이터:', sensorData);
    
    // 센서 데이터를 서버로 전송
    sendSensorDataToServer(sensorData);
}

// 서버로 센서 데이터를 전송하는 함수
function sendSensorDataToServer(data) {
    fetch('http://localhost:3000/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',  // JSON 형식으로 보내기
        },
        body: JSON.stringify(data),  // 데이터를 JSON 문자열로 변환
    })
    .then(response => response.json())
    .then(data => {
        console.log('서버 응답:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// 모션 센서 데이터를 수집하는 함수
function handleMotionEvent(event) {
    const { acceleration, rotationRate } = event;
    sensorData.acceleration.x = acceleration.x || 0;
    sensorData.acceleration.y = acceleration.y || 0;
    sensorData.acceleration.z = acceleration.z || 0;
    sensorData.rotationRate.alpha = rotationRate.alpha || 0;
    sensorData.rotationRate.beta = rotationRate.beta || 0;
    sensorData.rotationRate.gamma = rotationRate.gamma || 0;
    console.log('모션 센서 데이터:', sensorData);

    // 센서 데이터를 서버로 전송
    sendSensorDataToServer(sensorData);
}

// 모션 데이터 수집 시작 함수
function startMotionCapture() {
    if (window.DeviceMotionEvent) {
        window.addEventListener("devicemotion", handleMotionEvent);
    } else {
        console.warn("DeviceMotionEvent는 이 기기에서 지원되지 않습니다.");
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
    setupSensorData();
    startMotionCapture();
    console.log("기기 정보:", deviceInfo);
};
