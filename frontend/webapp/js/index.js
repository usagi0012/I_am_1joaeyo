const postCardContainer = document.getElementById('postCardContainer');
const bestCardContainer = document.getElementById('bestCardContainer');

//기본 메인 페이지 불러오기
window.onload = loadData();

//카드 로드
function loadData(sort) {
    console.log('hi');
    fetch('http://localhost:3050/posts', {
        method: 'GET',
        headers: {
            Accept: 'application/json',
        },
    })
        .then(res => res.json())
        .then(res => {
            //나중에 콘솔로그 지우쎄용 지원아 잊지말아라
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
          <div class="postCard">
            <div class="imageBox">
              <img class="postImg" src="../resources/testImg.png" />
            </div>
            <div class="contentBox">
              <h3 class="postTitle">${e.title}</h3>
              <div class="cardFoot">
                <h5 class="postWriter">${e.user.nickname}</h5>
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