const submitForm = () => {
    const form = document.querySelector('#createForm');
    const formData = new FormData(form);
    const headers = new Headers();

    headers.append(
        'Authorization',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjgsImlhdCI6MTcwMDk2OTUwMSwiZXhwIjoxNzAwOTczMTAxfQ.10Ho9-OBMD8ndLNpPW658gZGIgyFJsqiKqiZljrLP2M'
    );
    fetch('http://localhost:3050/posts', {
        method: 'POST',
        body: formData,
        headers,
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                location.href = 'index.html';
            } else {
                alert(data.message);
                return;
            }
        })
        .catch(error => console.error('Error:', error));
};