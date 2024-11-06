let randomNumber = Math.floor(Math.random() * 500) + 1;
let attempts = 0;
let maxAttempts = 20;
let sensorData = { alpha: 0, beta: 0, gamma: 0 }; // 센서 데이터 객체
let deviceInfo = navigator.userAgent; // 기기 정보

// 기기 센서 데이터 가져오는 함수
function setupSensorData() {
    if (window.DeviceOrientationEvent) {
        window.addEventListener("deviceorientation", function(event) {
            sensorData.alpha = event.alpha; // 장치의 회전 각도 (z축 회전)
            sensorData.beta = event.beta;   // 장치의 전후 기울기 (x축)
            sensorData.gamma = event.gamma; // 장치의 좌우 기울기 (y축)
            console.log('센서 데이터:', sensorData);  // 콘솔에 출력
        });
    } else {
        console.error('이 기기는 DeviceOrientation을 지원하지 않습니다.');
    }
}

// 페이지 로드 시 센서 데이터 설정 및 기기 정보 출력
window.onload = function() {
    setupSensorData();
    console.log("기기 정보:", deviceInfo); // 기기 정보를 콘솔에 출력
};

document.getElementById('submitGuess').addEventListener('click', function() {
    const guessInput = document.getElementById('guess').value.trim();
    const guess = Number(guessInput);
    attempts++;
    let resultText = '';
    let attemptsLeft = maxAttempts - attempts;

    // 입력 체크
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

    // 힌트 추가 (예: 특정 시도 횟수에 센서 데이터 및 기기 정보 사용)
    if (attempts >= 10) {
        resultText += ` \n(힌트 : 현재 기기의 전후 기울기(beta)는 ${sensorData.beta.toFixed(2)}도입니다.)`;
    }
    if (attempts >= 15) {
        resultText += ` \n(힌트 : 사용 기기 정보는 ${deviceInfo}입니다.)`;
    }

    if (attemptsLeft > 0) {
        document.getElementById('result').innerText = resultText;
        document.getElementById('attemptsLeft').innerText = `남은 횟수: ${attemptsLeft}`;
    } else if (attemptsLeft === 0) {
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
