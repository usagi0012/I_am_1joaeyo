const submitForm = () => {
    const form = document.querySelector('#createForm');
    const formData = new FormData(form);
    const headers = new Headers();
    const token = window.localStorage.getItem('token');

    headers.append(
        'Authorization',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjgsImlhdCI6MTcwMDk2OTUwMSwiZXhwIjoxNzAwOTczMTAxfQ.10Ho9-OBMD8ndLNpPW658gZGIgyFJsqiKqiZljrLP2M',
    );
    fetch('http://localhost:3050/posts', {
        method: 'POST',
        body: formData,
        headers: {
            authorization: token,
        },
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                location.href = 'index.html';
            } else {
                alert(data.message);
                return;
            }
        })
        .catch(error => console.error('Error:', error));
};

//로그인 상태에 따른 회원 아이콘 클릭시 이동 함수
function profileIcon() {
    if (confirm('글 작성을 멈추고 마이페이지로 이동하시겠습니까? 작성 중인 글은 저장되지 않습니다.') == true) {
        const token = window.localStorage.getItem('token');
        if (token) {
            location.href = 'http://127.0.0.1:5500/frontend/webapp/mypage.html';
        } else {
            location.href = 'http://127.0.0.1:5500/frontend/webapp/login.html';
        }
    }
}

//로그인 상태에 따른 글 작성 아이콘 클릭시 이동 함수
function createPostIcon() {
    if (confirm('글 작성을 멈추고 새로운 글을 작성하시겠습니까? 현재 작성 중인 글은 저장되지 않습니다.') == true) {
        const token = window.localStorage.getItem('token');
        if (token) {
            location.href = 'http://127.0.0.1:5500/frontend/webapp/post.create.html';
        } else {
            alert('로그인 후 이용 가능한 기능입니다.');
            location.href = 'http://127.0.0.1:5500/frontend/webapp/login.html';
        }
    }
}
