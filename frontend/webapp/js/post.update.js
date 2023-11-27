const token = window.localStorage.getItem('token');
let postId;

const submitForm = () => {
    const form = document.querySelector('#updateForm');
    const formData = new FormData(form);

    fetch('http://localhost:3050/posts', {
        method: 'PATCH',
        body: formData,
        headers: {
            Authorization: token,
        },
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                location.reload(true);
            } else {
                alert(data.message);
                return;
            }
        })
        .catch(error => console.error('Error:', error));
};

/**
 * 게시글 상세 조회
 */
const getPost = () => {
    const url = new URL(window.location.href);
    const urlParams = url.searchParams;
    postId = urlParams.get('q');
    fetch(`http://localhost:3050/posts/${postId}`, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(response => {
            console.log(response.data);
            printPost(response.data);
        })
        .catch(error => console.error('Error:', error));
};

const printPost = data => {
    const title = document.querySelector('#title');
    const content = document.querySelector('#content');

    title.value = data.title;
    content.value = data.content;
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
    if (confirm('글 수정을 멈추고 새로운 글을 작성하시겠습니까? 현재 수정한 내용은 저장되지 않습니다.') == true) {
        const token = window.localStorage.getItem('token');
        if (token) {
            location.href = 'http://127.0.0.1:5500/frontend/webapp/post.create.html';
        } else {
            alert('로그인 후 이용 가능한 기능입니다.');
            location.href = 'http://127.0.0.1:5500/frontend/webapp/login.html';
        }
    }
}

window.onload = getPost();
