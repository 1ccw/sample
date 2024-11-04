let randomNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;

document.getElementById('submitGuess').addEventListener('click', function() {
    const guess = Number(document.getElementById('guess').value);
    attempts++;
    let resultText = '';

    if (guess < 1 || guess > 100) {
        resultText = '1부터 100 사이의 숫자를 입력하세요.';
    } else if (guess > randomNumber) {
        resultText = '더 작은 숫자를 시도해 보세요.';
    } else if (guess < randomNumber) {
        resultText = '더 큰 숫자를 시도해 보세요.';
    } else {
        resultText = `축하합니다! ${attempts}번 만에 맞추셨습니다!`;
        document.getElementById('restart').style.display = 'block';
        document.getElementById('submitGuess').disabled = true;
    }

    document.getElementById('result').innerText = resultText;
});

document.getElementById('restart').addEventListener('click', function() {
    randomNumber = Math.floor(Math.random() * 100) + 1;
    attempts = 0;
    document.getElementById('result').innerText = '';
    document.getElementById('guess').value = '';
    document.getElementById('restart').style.display = 'none';
    document.getElementById('submitGuess').disabled = false;
});
