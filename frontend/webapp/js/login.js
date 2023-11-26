const submitBtn = document.getElementById('submitBtn');
const signupBtn = document.getElementById('signupBtn');

submitBtn.addEventListener('click', async function (event) {
    event.preventDefault();

    const email = document.querySelector('[name="email"]').value;
    const password = document.querySelector('[name="password"]').value;
    try {
        const response = await fetch('http://localhost:3050/authRouter/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });

        const data = await response.json();
        console.log(data);
        window.localStorage.setItem('token', data.data);
        if (data.success) {
            window.location.href = 'http://127.0.0.1:5500/frontend/webapp/index.html';
        } else {
            alert('아이디 비밀번호를 확인해주세요.');
        }
    } catch (error) {
        alert('알 수 없는 오류가 발생하였습니다. 관리자에게 문의하세요.');
    }
});

signupBtn.addEventListener('click', async function (event) {
    window.location.href = 'http://127.0.0.1:5500/frontend/webapp/signup.html';
});

function toHome() {
    location.href = 'http://127.0.0.1:5500/frontend/webapp/index.html';
}
