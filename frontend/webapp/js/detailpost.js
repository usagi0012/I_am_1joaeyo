function toHome() {
    location.href = 'http://127.0.0.1:5500/frontend/webapp/index.html';
}

const content = document.getElementById('content');
const commentContainer = document.getElementById('commentContainer');
const commentWriteNickname = document.getElementById('commentWriteNickname');

const url = new URLSearchParams(window.location.search);
let postnum = url.get('id');
console.log(postnum);

window.onload = loadPost(postnum);

function loadPost(postId) {
    fetch(`http://localhost:3050/posts/${postId}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
        },
    })
        .then(res => res.json())
        .then(res => {
            loadContent(res.data);
        })
        .then(loadComment(postId))
        .catch(err => alert('데이터 정보를 불러오지 못했습니다. 에러 : ' + err));
}

//글 내용 불러오기
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

//댓글 불러오기
function loadComment(postId) {
    fetch(`http://localhost:3050/posts/${postId}/comments`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
        },
    })
        .then(res => res.json())
        // .then(res => console.log(res.data))
        .then(res => {
            commentContainer.innerHTML = '';
            res.data.forEach(e => {
                if (e.userId)
                    commentContainer.innerHTML += `<div class="comment">
                <div class="commentNickname">${e.users.nickname}</div>
                <div class="commentContent">${e.content}</div>
                <button type="button" class="editIcon">
                    <i class="fas fa-solid fa-pen-to-square"></i>
                </button>
                <button type="button" class="deleteIcon">
                    <i class="fas fa-solid fa-trash"></i>
                </button>
            </div>`;
            });
        })
        .catch(err => alert('데이터 정보를 불러오지 못했습니다. 에러 : ' + err));
}

function createComment() {
    const commentText = document.getElementById('commentWriteContent').value;
    console.log(commentText);
    // fetch(`http://localhost:3050/posts/${postId}/comments`, {
    //     method: 'POST',
    //     headers: {
    //         Accept: 'application/json',
    //     },
    //     body: JSON.stringify({
    //         email: email,
    //         password: password,
    //     }),
    // });
}
