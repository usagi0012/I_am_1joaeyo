//기본 메인 페이지 불러오기
const headers = new Headers();

headers.append(
    'Authorization',
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjgsImlhdCI6MTcwMDk4MDM1NSwiZXhwIjoxNzAwOTgzOTU1fQ.syn86iODhXrQUt2CDoDRBhTDEW3rzuyx4_BnydxcwhI'
);

const loadData = () => {
    fetch('http://localhost:3050/user/members', {
        method: 'GET',
        headers,
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            printUserInfo(data);
        })
        .catch(error => console.error('Error:', error));
};
window.onload = loadData();

const printUserInfo = user => {
    const nickname = document.querySelector('#nickname');
    const description = document.querySelector('#description');

    nickname.value = user.data.nickname;
    description.value = user.data.description;
};
