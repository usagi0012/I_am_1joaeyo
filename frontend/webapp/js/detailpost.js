function toHome() {
    location.href = 'http://127.0.0.1:5500/frontend/webapp/index.html';
}

const content = document.getElementById('content');

window.onload = loadPost(24);

function loadPost(postId) {
    console.log('hi');
    fetch(`http://localhost:3050/posts/${postId}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
        },
    })
        .then(res => res.json())
        .then(res => {
            loadContent(res.data);
            console.log(res.data);
        })
        .catch(err => alert('데이터 정보를 불러오지 못했습니다. 에러 : ' + err));
}

function loadContent(e) {
    content.innerHTML = '';
    content.innerHTML += `
    <div class="dataContainer">
    <div class="imgBox">
        <img class="postImg" src=${e.image} />
    </div>
    <div class="titleBox">${e.title}</div>
    <div class="foot">
        <div class="nameBox">${e.user.nickname}</div>
        <div class="dateBox">${e.createdAt.slice(0, 10)}</div>
        <div class="likeBox">
        ${e.likes.length}
            <i class="fas fa-solid fa-heart"></i>
        </div>
    </div>
</div>
<div class="contentCotainer">
${e.content}
</div>`;
}
