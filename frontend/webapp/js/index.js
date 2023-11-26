const postCardContainer = document.getElementById('postCardContainer');
const bestCardContainer = document.getElementById('bestCardContainer');

//기본 메인 페이지 불러오기
window.onload = loadData;

// 로그인 여부 확인
function checkLogin() {
    const storedToken = localStorage.getItem('access_token');
    console.log(storedToken);
    fetch('http://localhost:3050/user/members', {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
    })
        .then(res => res.json())
        .then(data => {
            // 서버로부터 받은 데이터를 기반으로 동작을 수행합니다.
            if (data.loggedIn) {
                // 로그인된 상태이면 마이페이지로 이동
                window.location.href = '마이페이지 주소';
            } else {
                // 로그인되지 않은 상태이면 로그인 페이지로 이동
                window.location.href = '로그인 페이지 주소';
            }
        })
        .catch(err => {
            console.error('로그인 상태 확인 중 에러:', err);
            // 에러 발생 시에는 어떤 동작을 할지 결정합니다.
            // 여기에서는 간단하게 알림을 띄우도록 했습니다.
            alert('로그인 상태 확인 중 에러가 발생했습니다.');
        });
}

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
