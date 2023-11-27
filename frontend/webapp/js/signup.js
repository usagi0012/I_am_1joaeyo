function toHome() {
    location.href = 'http://127.0.0.1:5500/frontend/webapp/index.html';
}

document.querySelector('form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const nickname = document.querySelector('[name="nickname"]').value;
    const email = document.querySelector('[name="email"]').value;
    const password = document.querySelector('[name="password"]').value;
    const passwordConfirm = document.querySelector('[name="passwordConfirm"]').value;

    try {
        const response = await fetch('http://localhost:3050/authRouter/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nickname: nickname,
                email: email,
                password: password,
                passwordConfirm: passwordConfirm,
            }),
        });

        const data = await response.json();
        console.log(data);

        if (data.success) {
            alert('회원가입에 성공했습니다.');
            window.location.href = 'http://127.0.0.1:5500/frontend/webapp/login.html';
        } else {
            alert('회원가입에 실패했습니다. ' + data.message);
        }
    } catch (error) {
        console.error('알 수 없는 오류가 발생하였습니다.', error);
        alert('알 수 없는 오류가 발생하였습니다. 관리자에게 문의하세요.');
    }
});
