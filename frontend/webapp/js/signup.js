const submitBtn = document.getElementById('submitBtn');
submitBtn.addEventListener('click', async event => {
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
            alert('회원가입 완료되었습니다!');
            window.location.href = 'login.html';
        } else {
            alert('입력 정보를 확인해주세요.');
        }
    } catch (error) {
        alert('알 수 없는 오류가 발생하였습니다. 관리자에게 문의하세요.');
    }
});
