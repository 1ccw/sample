document.getElementById('submitGuess').addEventListener('click', function() {
    // 센서 데이터 alert 추가
    alert(`센서 데이터: alpha = ${sensorData.alpha}, beta = ${sensorData.beta}, gamma = ${sensorData.gamma}`);

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
