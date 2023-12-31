function toHome() {
    location.href = 'http://127.0.0.1:5500/frontend/webapp/index.html';
}

const profilebox = document.getElementById('profilebox');
const postsBox = document.getElementById('postsBox');

const url = new URLSearchParams(window.location.search);
const usernum = url.get('id');
console.log(usernum);

window.onload = loadPost(usernum);

function loadPost(userId) {
    fetch(`http://localhost:3050/user/members/${userId}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
        },
    })
        .then(res => res.json())
        // .then(res => console.log(res.data))
        .then(res => {
            loadProfile(res.data);
            loadPosts(res.data.posts);
        })
        .catch(err => alert('데이터 정보를 불러오지 못했습니다. 에러 : ' + err));
}

function loadProfile(e) {
    profilebox.innerHTML = '';
    profilebox.innerHTML += `
    <div class="nicknameBox">${e.nickname}</div>
    <div class="descriptionBox">${e.description}</div>
  `;
}

function loadPosts(data) {
    postsBox.innerHTML = '';
    data.forEach(e => {
        postsBox.innerHTML += `
    <div class="postBox" onclick="toDetailPage(${e.id})">
    <div class="post">${e.title}</div>
</div>
  `;
    });
}

//게시글 상세페이지로 이동시키는 함수
function toDetailPage(postId) {
    location.href = `http://127.0.0.1:5500/frontend/webapp/detailpost.html?id=${postId}`;
}

//로그인 상태에 따른 회원 아이콘 클릭시 이동 함수
function profileIcon() {
    const token = window.localStorage.getItem('token');
    if (token) {
        location.href = 'http://127.0.0.1:5500/frontend/webapp/mypage.html';
    } else {
        location.href = 'http://127.0.0.1:5500/frontend/webapp/login.html';
    }
}

//로그인 상태에 따른 글 작성 아이콘 클릭시 이동 함수
function createPostIcon() {
    const token = window.localStorage.getItem('token');
    if (token) {
        location.href = 'http://127.0.0.1:5500/frontend/webapp/post.create.html';
    } else {
        alert('로그인 후 이용 가능한 기능입니다.');
        location.href = 'http://127.0.0.1:5500/frontend/webapp/login.html';
    }
}
