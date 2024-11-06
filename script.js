let randomNumber = Math.floor(Math.random() * 500) + 1;
let attempts = 0;
let maxAttempts = 20;
let sensorData = { alpha: 0, beta: 0, gamma: 0 };  // 센서 데이터 저장 객체
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
}

// 페이지 로드 시 센서 데이터 설정 및 기기 정보 출력
window.onload = function() {
    setupSensorData();
    console.log("기기 정보:", deviceInfo);
};

document.getElementById('submitGuess').addEventListener('click', function() {
    const guessInput = document.getElementById('guess').value.trim(); // 공백 제거
    const guess = Number(guessInput);
    attempts++;
    let resultText = '';
    let attemptsLeft = maxAttempts - attempts;

    // 입력 체크
    if (guessInput === '') {
        alert('숫자를 입력하세요.');  // 공백일 경우 경고 메시지
        attempts--;  // 시도 횟수 증가하지 않도록
        return;  // 함수 종료
    } else if (guess < 1 || guess > 500) {
        resultText = '1부터 500 사이의 숫자를 입력하세요.';
    } else if (guess > randomNumber) {
        resultText = '더 작은 숫자를 시도해 보세요.';
    } else if (guess < randomNumber) {
        resultText = '더 큰 숫자를 시도해 보세요.';
    } else {
        resultText = `축하합니다! ${attempts}번 만에 맞추셨습니다!`;
        document.getElementById('result').innerText = resultText;
        document.getElementById('attemptsLeft').style.display = 'none';  // 남은 횟수 숨김
        document.getElementById('restart').style.display = 'block';
        document.getElementById('submitGuess').disabled = true;
        return;  // 여기서 함수 종료하여 다른 텍스트가 나타나지 않도록 함
    }

    // 힌트 추가
    if (attempts >= 5 && attempts < 10) {
        resultText += ` \n(힌트 : ${randomNumber.toString().length}자리 숫자입니다.)`;
    } else if (attempts >= 10 && attempts < 15) {
        const lastDigit = randomNumber % 10;
        resultText += ` \n(힌트 : 마지막 자리 숫자는 ${lastDigit}입니다.)`;
    } else if (attempts >= 15 && attempts < 20) {
        const secondDigit = Math.floor((randomNumber % 100) / 10);
        resultText += ` \n(힌트 : 두 번째 자리 숫자는 ${secondDigit}입니다.)`;
    } else if (attempts === 20) {
        resultText += ` \n(힌트 : 센서 데이터 - alpha: ${sensorData.alpha.toFixed(2)}, beta: ${sensorData.beta.toFixed(2)}, gamma: ${sensorData.gamma.toFixed(2)})`;
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
    document.getElementById('attemptsLeft').style.display = 'block';  // 남은 횟수 다시 표시
    document.getElementById('restart').style.display = 'none';
    document.getElementById('submitGuess').disabled = false;
});
