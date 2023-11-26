function toHome() {
    location.href = 'http://127.0.0.1:5500/frontend/webapp/index.html';
}

const content = document.getElementsByClassName('content');

window.onload = loadPost(21);

function loadPost(postId) {
    console.log('hi');
    fetch(`http://localhost:3050/posts/${postId}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
        },
    })
        .then(res => res.json())
        .then(res => console.log(res.data))
        .then(res => {
            content.innerHTML = '';
            content.innerHTML = `<div class="dataContainer">
          <div class="imgBox">
              <img class="postImg" src="../resources/cat.jpg" />
          </div>
          <div class="titleBox">${res.data?.title}</div>`;
        })
        .catch(err => alert('데이터 정보를 불러오지 못했습니다. 에러 : ' + err));
}

function loadContent(e) {
    content.innerHTML = '';
    content.innerHTML += `
    <div class="dataContainer">
    <div class="imgBox">
        <img class="postImg" src="../resources/cat.jpg" />
    </div>
    <div class="titleBox">${e.title}</div>
    <div class="foot">
        <div class="nameBox">임시이름</div>
        <div class="dateBox">2023-11-24</div>
        <div class="likeBox">
            좋아요
            <i class="fas fa-solid fa-heart"></i>
        </div>
    </div>
</div>
<div class="contentCotainer">
    1. 영화 <쏘우 X>와 관련 제공된 가이드라인을 활용하여 인스타그램 피드 업로드 >> 캠페인 리뷰어로
    선정되신 분들께는 별도 상세 가이드를 전달 드릴 예정입니다. ★시사회 일정★ - 시사 일정 : 12월
    5일(화) 오후 7시 30분 - 시사 장소 : CGV용산아이파크몰 15관 - 좌석 제공 : 1인 1석 (해당 캠페인은
    1인 1석 제공입니다. 캠페인 선정 후 취소 시 패널티 부과되오니 신중한 신청 부탁드립니다.) ** 상영
    시간은 변경될 수 있는 점 참고 부탁 드리며 반드시 참석 가능하신 분만 신청 부탁드립니다. 포스팅
    분위기(*참고용이며 복사/붙여넣기 지양합니다.) - 쏘우 시리즈 중 가장 호평 받은 그 작품! 영화
    <쏘우 X> 12월 13일 대개봉 - 드디어 개봉하는 #쏘우 시리즈 10번째 작품. 진짜 역대급이였던 #쏘우X
    시사회 후기! - 2023년 하반기 극장가 최고의 화제작, 전 세계 48개국 박스오피스 1위! 공포 스릴러
    영화 <쏘우 X> 시사회 다녀왔어요! 1. 영화 <쏘우 X>와 관련 제공된 가이드라인을 활용하여 인스타그램
    피드 업로드 >> 캠페인 리뷰어로 선정되신 분들께는 별도 상세 가이드를 전달 드릴 예정입니다.
    ★시사회 일정★ - 시사 일정 : 12월 5일(화) 오후 7시 30분 - 시사 장소 : CGV용산아이파크몰 15관 -
    좌석 제공 : 1인 1석 (해당 캠페인은 1인 1석 제공입니다. 캠페인 선정 후 취소 시 패널티 부과되오니
    신중한 신청 부탁드립니다.) ** 상영 시간은 변경될 수 있는 점 참고 부탁 드리며 반드시 참석
    가능하신 분만 신청 부탁드립니다. 포스팅 분위기(*참고용이며 복사/붙여넣기 지양합니다.) - 쏘우
    시리즈 중 가장 호평 받은 그 작품! 영화 <쏘우 X> 12월 13일 대개봉 - 드디어 개봉하는 #쏘우 시리즈
    10번째 작품. 진짜 역대급이였던 #쏘우X 시사회 후기! - 2023년 하반기 극장가 최고의 화제작, 전 세계
    48개국 박스오피스 1위! 공포 스릴러 영화 <쏘우 X> 시사회 다녀왔어요!
</div>`;
}
