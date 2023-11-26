//기본 메인 페이지 불러오기

const loadData = () => {
    getUserInfo();
    //getUserPosts();
};

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
            authorization: headerToken,
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
    fetch('http://localhost:3050//posts/userPosts', {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
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
            authorization: headerToken,
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

window.onload = loadData();
