
import {signout, getMatchUsers, getLoginUser} from '../common/apiList.js'
import {levelTag, checkLevel} from '../common/typeCheck.js'



// 로그아웃
$('#signout-btn').on('click', async function (e) {
    const res = await signout();
    location.href = '/social-match/index.html';
});

// sweetalert
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
});

// qs에서 matchId 찾기
// let arr = location.href.split('?');
// if (arr.length == 0) {
//     alert("요청 형식이 올바르지 않습니다.")
//     throw "URL 형식 오류!";
// }
//
// let params = new URLSearchParams(arr[1]);
// let matchId = params.get("matchId");
//
// if (matchId == null) {
//     alert("매치 번호가 없습니다.");
//     throw "파라미터 오류!";
// }

let resp = await getMatchUsers(209);
let users = resp.data.users;
console.log(users);

users?.map((user) => {
    $('#user-list').append(`
        <div class="row mb-2 pb-2 border-bottom">
            <div class="col d-flex m-2 align-items-center">
                <div>🥎</div>
                <div class="mx-2 fs-5">${user.name}</div>
                ${levelTag(user.lvId)}
            </div>
            <div class="d-grid gap-2 col-4 d-md-flex" data-user=${user.userId}>
                <button class="team-btn btn btn-outline-danger me-2 col w-50" type="button" value="red">RED팀</button>
                <button class="team-btn btn btn-outline-warning col w-50" type="button" value="yellow">YELLOW팀</button>
            </div>
        </div>
    `);
})

function findUser(no) {
    for (const user of users) {
        if (user.userId != no) {
            continue;
        } else {
            return user;
        }
    }
};



// =====================================
//           RED팀, YELLOW팀 CSS
// =====================================
$(document).on('click', '.team-btn', async function (e) {

    let selectedUserId = $(this).parent().attr('data-user');
    console.log("chk", selectedUserId);

    let sUser = findUser(selectedUserId);

    if ($(e.target).hasClass('btn-outline-danger'))  {
        $(e.target).removeClass('btn-outline-danger').addClass('btn-danger');

       if ($(e.target).siblings().hasClass('btn-warning')) {
           $(e.target).siblings().removeClass('btn-warning').addClass('btn-outline-warning');
           $(`div[value=${selectedUserId}]`).remove();
       }



        $('.red-team').append(`
            <div class="col d-flex m-3 align-items-center" value=${selectedUserId}>
                <div>🥎</div>
                <div class="mx-2 fs-5">${sUser.name}</div>
                ${levelTag(sUser.lvId)}
                <button class="btn btn-secondary mx-2 eval-btn" type="button" data-bs-toggle="modal"
                        data-bs-target="#staticBackdrop">평가</button>
            </div>
        `);

    } else if ($(e.target).hasClass('btn-outline-warning')) {
        $(e.target).removeClass('btn-outline-warning').addClass('btn-warning');

        if ($(e.target).siblings().hasClass('btn-danger')) {
            $(e.target).siblings().removeClass('btn-danger').addClass('btn-outline-danger');
            $(`div[value=${selectedUserId}]`).remove();
        }

        $('.yellow-team').append(`
            <div class="col d-flex m-3 align-items-center" value=${selectedUserId}>
                <div>🥎</div>
                <div class="mx-2 fs-5">${sUser.name}</div>
                ${levelTag(sUser.lvId)}
                <button class="btn btn-secondary mx-2 eval-btn" type="button" data-bs-toggle="modal"
                        data-bs-target="#staticBackdrop">평가</button>
            </div>
        `);
    }

    if (($('.btn-danger').length > (users.length / 2)) || ($('.btn-warning').length > (users.length / 2))) {
        Toast.fire({
            icon: 'info',
            title: '한 팀당 과반수 이상이 참여할 수 없습니다.'
        })
    };
});


$(document).on('click', '.eval-btn', function (e) {
    let userId = $(this).parent().attr('value');
    let user = findUser(userId);
    $('.u-name').html(`${user.name} ${levelTag(user.lvId)}`);
});

const lv = $('select[name=level]').val();
const normalPoint = $('input[name=normal-point]').val();
const matchPoint = $('input[name=match-point]').val();


$('form[name=rating-form]').on('submit', function (e) {

})







