const token = window.localStorage.getItem('token');
let postId;

const submitForm = () => {
    const form = document.querySelector('#updateForm');
    const formData = new FormData(form);

    fetch(`http://localhost:3050/posts/${postId}`, {
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

window.onload = getPost();
