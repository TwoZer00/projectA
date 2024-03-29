const logoPath = "/staticFiles/aproject.svg";

const profileActions = `

`;

const menuActions =
  '<div id="menuActions">' +
  '<a class="dropdown-item" href="/u">Profile</a>' +
  '<a class="dropdown-item" href="/feed">Feed</a>' +
  '<a class="dropdown-item d-none d-sm-none d-md-none d-lg-block d-xl-block" href="javascript:void(0)" data-bs-toggle="modal" data-bs-target="#uploadModal">Upload</a>' +
  '<a class="dropdown-item" href="javascript:void(0)" onclick="logout()">Sign out</a>' +
  "</div>";
const resetPasswordForm = `
  <div id="resetPassFormContainer">
    <form id="resetPassword" class="px-3 pt-2 pb-2">
    <div class="form-text">You will recive an email to continue with the process.</div>
    <div class="form-floating mb-3 mt-1 text-secondary">
      <input type="email" class="form-control" id="email" placeholder="name@example.com">
      <label for="floatingInput">Email address</label>
    </div>
    <button type="submit" class="btn btn-outline-light" onclick="resetPassword(event)">Send email</button>
    </form>
    <a class="dropdown-item" href="#" id="signUp" onclick="loginContainer()">Already have account? Sign in</a>
  </div>
`;
const loginForm =
  '<div id="loginFormContainer">' +
  '<form class="px-4 pt-3" id="loginForm">' +
  '<div class="mb-3">' +
  '<label for="exampleDropdownFormEmail1" class="form-label">Email address</label>' +
  '<input type="email" class="form-control" id="email" placeholder="email@example.com" required>' +
  "</div>" +
  '<div class="mb-3">' +
  '<label for="exampleDropdownFormPassword1" class="form-label">Password</label>' +
  '<input type="password" class="form-control" id="password" placeholder="Password" required>' +
  "</div>" +
  '<button type="submit" class="btn btn-outline-light" onclick="signIn(event)">Sign in</button>' +
  "<div>" +
  '<label for="googleLogin" style="display: block;">Also login with:</label>' +
  '<a href="javascript:void(0)" id="googleLogin" class="bi bi-google link-light fs-3" onclick="loginUsingGoogle()"></a>' +
  "</div>" +
  "</form>" +
  '<div class="dropdown-divider"></div>' +
  '<a class="dropdown-item" href="/login" id="signUp">New around here? Sign up</a>' +
  '<a class="dropdown-item" href="javascript:resetPass()" id="signUp">Forgot password? Reset</a>' +
  "</div>";
const menuHTML = `
<div class="bg-dark shadow-sm container-fluid">
  <ul class="nav justify-content-center fs-2">
    <li class="nav-item">
      <a class="nav-link bi bi-house link-light lh-sm" href="/"></a>
    </li>
    <li class="nav-item">
      <a class="nav-link pe-none user-selection-none my-1 p-2 lh-1 bg-logo rounded-circle">
        <span class="icon-main-logo align-middle fs-1 d-block logo"></span>
      </a>
    </li>
    <li class="nav-item" id="myDropdown">
      <a class="nav-link bi bi-person link-light lh-sm" id="dropdownMenuButton" data-bs-toggle="dropdown" data-bs-auto-close="outside" data-bs-reference="parent" aria-expanded="false" href="#"></a>
      <div class="dropdown-menu dropdown-menu-end dropdown-menu-dark" aria-labelledby="dropdownMenuButton" id="dropdown">
        <div id="loginContainer"></div>
      </div>
    </li>
  </ul>
</div>
`;
const uploadHTML =
  '<div class="modal fade" id="uploadModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="uploadModal" aria-hidden="true">' +
  '<div class="modal-dialog modal-dialog-centered modal-fullscreen-lg-down">' +
  '<div class="modal-content bg-dark">' +
  '<div class="modal-header">' +
  '<h5 class="modal-title text-white" id="staticBackdropLabel">Upload your audio</h5>' +
  '<button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>' +
  "</div>" +
  '<div class="modal-body">' +
  '<h1 class="text-center text-white" id="uploading"></h1>' +
  '<div class="progress" id="progressBar" style="display: none;">' +
  '<div class="progress-bar bg-secondary"  role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0%</div>' +
  "</div>" +
  '<form id="uploadFile">' +
  '<div class="form-floating mb-3">' +
  '<input type="text" name="title" class="form-control" id="floatingInputGrid" placeholder="title required" required>' +
  '<label for="floatingInputGrid">Title</label>' +
  "</div>" +
  '<div class="row g-3">' +
  '<div class="col-md">' +
  '<div class="input-group">' +
  '<input type="file" name="file" class="form-control" id="uploadInput" accept="audio/*" required>' +
  "</div>" +
  "</div>" +
  '<div class="col-md">' +
  '<input type="checkbox" name="nsfw" class="btn-check" id="btn-check-outlined" autocomplete="off">' +
  '<label class="btn btn-outline-danger d-block" for="btn-check-outlined" data-bs-toggle="tooltip" data-bs-placement="top" title="is this audio NSFW?">NSFW</label>' +
  "</div>" +
  "</div>" +
  '<div class="form-floating mb-3 mt-3">' +
  '<textarea class="form-control" name="desc" placeholder="Leave a comment here" id="floatingTextarea2" style="height: 100px; max-height: 300px;"></textarea>' +
  '<label for="floatingTextarea2">Description</label>' +
  "</div>" +
  "</form>" +
  '<div id="menuAction" style="display: none;" class="text-center m-2">' +
  '<a class="btn btn-outline-light me-2" id="toUpload" onclick="cleanView()">Keep uploading audios</a>' +
  '<a class="btn btn-outline-light" id="toAudio">Listen you audio</a>' +
  "</div>" +
  "</div>" +
  '<div class="modal-footer">' +
  '<button type="button" class="btn btn-outline-light mb-2" id="uploadButton" onclick="loadUpload()">Upload</button>' +
  "</div>" +
  "</div>" +
  "</div>" +
  "</div>";

const uploadFloatButton =
  '<div id="uploadBtn" class="rounded-circle text-light border border-2 d-lg-none bg-logo" style="width: 75px; height: 75px;" data-bs-toggle="modal" data-bs-target="#uploadModal">' +
  '<span class="icon-microphone fs-1 d-flex justify-content-center align-items-center" style="height: 100%;"></span>' +
  "</div>";

const requestForm = '<button class="btn btn-secondary">request</button>';

const emailVerify = '<span class="bi bi-patch-check text-logo"></span>';

const verifedProfile = "Verifed profile";

const modalUpload = `

`;

const PLAYER = `
<div class="d-block text-white" id="player">
    <audio src="" id="audio">
    </audio>
    <p class="d-inline-block fs-4 m-0" id="title">Title</p>
    <a href="" class="text-decoration-none text-muted">
    <small id="username"></small>
    </a>
    <small class="m-0 text-muted d-inline-block" id="date"></small>
    <div class="row">
        <div class="col-auto p-0 d-flex justify-content-center align-items-center">
            <button id="playBtn"
                class="btn btn-outline-light bi bi-play fs-2 rounded-circle p-4 d-flex justify-content-center align-items-center disabled m-1"
                onclick="play(this)" style="width: 50px; height: 50px;"></button>
        </div>
        <div class="col d-flex justify-content-center align-items-center">
            <div id="progressBar" class="w-100 d-block position-relative" data-bs-toggle="tooltip"
                data-bs-placement="top" data-bs-original-title="Hello">
                <progress value="0" max="100"
                    class="border w-100 rounded overflow-hidden pe-none loadContainer"
                    style="cursor: pointer;"></progress>
                <div id="time">
                    <span id="currentTime" class="float-start">00:00</span>
                    <span id="duration" class="float-end">08:21</span>
                </div>
                <span class="position-absolute bg-logo d-none text-light pe-none rounded fw-bold px-1"
                    id="timer" style="font-size: 10px;">08:21</span>
            </div>
        </div>
        <div class="col-auto ps-0">
            <div id="volumeContainer"
                class="d-flex justify-content-center align-items-center input-vertical"
                style="height: 60px;">
                <div style="width: 25px;" class="d-flex justify-content-center align-items-center">
                    <input type="range" id="volumen" class="form-range input-vertical"
                        style="width:60px;">
                </div>
                <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" id="checkVolume">
                </div>
            </div>
        </div>
    </div>
</div>
`;
