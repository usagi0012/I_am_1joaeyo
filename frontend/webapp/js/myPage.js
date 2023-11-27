//기본 메인 페이지 불러오기

const loadData = () => {
    getUserPosts();
    getUserInfo();
};

//유정 정보를 불러오기 위해 로컬스토리지에서 토큰 가져오기
const token = window.localStorage.getItem('token');

/***
 * API호출후 유저정보 출력
 */
const printUserInfo = user => {
    const nickname = document.querySelector('#nickname');
    const description = document.querySelector('#descriptionArea');

    nickname.value = user.data.nickname;
    description.value = user.data.description;
};

/**
 * 유저 정보 수정
 */
const updateUserInfo = () => {
    const nickname = document.querySelector('#nickname').value;
    const description = document.querySelector('#descriptionArea').value;
    const currentPwd = document.querySelector('#currentPwd').value;
    const newPwd = document.querySelector('#newPwd').value;
    const newPwdConfirm = document.querySelector('#newPwdConfirm').value;
    fetch('http://localhost:3050/user/members', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            authorization: token,
        },
        body: JSON.stringify({
            nickname,
            description,
            currentPassword: currentPwd,
            newPassword: newPwd,
            confirmNewPassword: newPwdConfirm,
        }),
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
 * 유저 게시글 목록 조회
 */
const getUserPosts = () => {
    fetch('http://localhost:3050/user/posts', {
        method: 'GET',
        headers: {
            authorization: token,
        },
    })
        .then(response => response.json())
        .then(response => {
            console.log(response.data);
            makePostList(response.data);
        })
        .catch(error => console.error('Error:', error));
};

/**
 * 유저 정보 조회
 */
const getUserInfo = () => {
    fetch('http://localhost:3050/user/members', {
        method: 'GET',
        headers: {
            authorization: token,
        },
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.success) {
                printUserInfo(data);
            } else {
                alert(data.message);
                return;
            }
        })
        .catch(error => console.error('Error:', error));
};

/**
 * 유저 게시글 삭제
 */
const deleteUserPosts = id => {
    fetch(`http://localhost:3050/posts/${id}`, {
        method: 'DELETE',
        headers: {
            authorization: token,
        },
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
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
 * 유저 삭제
 */
const deleteUser = () => {
    if (confirm('삭제한 데이터는 복구할수 없습니다.')) {
        alert('준비중입니다.');
        // fetch(`http://localhost:3050/user/members`, {
        //     method: 'DELETE',
        //     headers: {
        //         authorization: token,
        //     },
        // })
        //     .then(response => response.json())
        //     .then(data => {
        //         console.log(data);
        //         if (data.success) {
        //             alert(data.message);
        //             location.href = 'index.html';
        //         } else {
        //             alert(data.message);
        //             return;
        //         }
        //     })
        //     .catch(error => console.error('Error:', error));
    }
};

//로그아웃 버튼 클릭
function logout() {
    window.localStorage.removeItem('token');
    alert('로그아웃 되었습니다.');
    location.href = 'http://127.0.0.1:5500/frontend/webapp/index.html';
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

//홈버튼
function toHome() {
    location.href = 'http://127.0.0.1:5500/frontend/webapp/index.html';
}

//수정 화면 이동
function toUpdate(id) {
    location.href = `http://127.0.0.1:5500/frontend/webapp/post.update.html?q=${id}`;
}

//게시글 리스트 생성
function makePostList(data) {
    const bestCardContainer = document.getElementById('myPostContainer');
    bestCardContainer.innerHTML = '';

    data.forEach(e => {
        bestCardContainer.innerHTML += `
        <div class="myPostBox">
        <div class="myPost">${e.title}</div>
        <button type="button" class="editPostIcon" onclick="toUpdate(${e.id})">
            <i class="fas fa-solid fa-pen-to-square"></i>
        </button>
        <button type="button" class="deletePostIcon" onclick="deleteUserPosts(${e.id})">
            <i class="fas fa-solid fa-trash"></i>
        </button>
        </div>`;
    });
}

window.onload = loadData();
