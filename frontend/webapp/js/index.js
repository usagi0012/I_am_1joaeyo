const postCardContainer = document.getElementById('postCardContainer');
const bestCardContainer = document.getElementById('bestCardContainer');

//기본 메인 페이지 불러오기
window.onload = loadData();

//카드 로드
function loadData(sort) {
    fetch('http://localhost:3050/posts', {
        method: 'GET',
        headers: {
            Accept: 'application/json',
        },
    })
        .then(res => res.json())
        .then(res => {
            console.log(res.data);
            if (sort) {
                return makePostList(res.bestdata, postCardContainer);
            }
            makePostList(res.data, postCardContainer);
            makePostList(res.bestdata.slice(0, 3), bestCardContainer);
        })
        .catch(err => alert('데이터 정보를 불러오지 못했습니다. 에러 : ' + err));
}

//카드리스트 만들어주는 함수
function makePostList(data, cardContainer) {
    cardContainer.innerHTML = '';
    data.forEach(e => {
        cardContainer.innerHTML += `
          <div class="postCard" onclick="toDetailPage(${e.id})">
            <div class="imageBox">
              <img class="postImg" src="${e.image}" />
            </div>
            <div class="contentBox">
              <h3 class="postTitle">${e.title}</h3>
              <div class="cardFoot">
                <h5 class="postWriter">${e.user.nickname}</h5>
                <input type="hidden" name="postNum" value="${e.id}" />
                <div class="likes">
                ${e.likes.length}
                <i class="fas fa-solid fa-heart"></i>
              </div>
                <h5 class="postDate">${e.createdAt.slice(0, 10)}</h5>
              </div>
            </div>
          </div>`;
    });
}

//정렬해주는 함수
document.getElementById('filter').addEventListener('change', function (e) {
    sortPostList(e.target.value);
});
function sortPostList(value) {
    if (value == 'like') {
        loadData(value);
    } else {
        loadData();
    }
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
