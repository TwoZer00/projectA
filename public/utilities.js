var db = null;
var storage = null;
var auth = null;
let uploadTask;
let uploadModal = document.createElement("div");
let toastContainer = document.getElementById("toastContainer");
const colorThief = new ColorThief();
let userInfo = {};
let uploadBtn;
let clipboard = new ClipboardJS(".copyLink");
document.getElementById("stickyMenu").innerHTML = menuHTML;

//document.getElementById("stickyMenu").classList.add("sticky-top");/

window.addEventListener("load", () => {
  db = firebase.firestore();
  storage = firebase.storage();
  auth = firebase.auth();
  auth.onAuthStateChanged((user) => {
    menuOptions(user);
    if (user) {
      console.warn("logged in");
      document.getElementById("uploadModalContainer").innerHTML = uploadHTML;
      document.getElementById("uploadInput").addEventListener("change", (e) => {
        let file = e.target.files[0];
        if (file.size / 1024 / 1024 > 60) {
          e.target.setCustomValidity("File size bigger than 60MB");
        }
      });
      uploadBtn = document.getElementById("uploadButton");
      // document.getElementById("floatButton").classList.add("fixed-bottom");
      // document.getElementById("floatButton").style.bottom = "10px";
      // document.getElementById("floatButton").style.right = "10px";
      // document.getElementById("floatButton").style.left = "unset";
      document.getElementById("floatButton").innerHTML = uploadFloatButton;
    } else {
      console.warn("logged out");
      if (document.getElementById("floatButton").children[0]) {
        document.getElementById("floatButton").children[0].remove();
      }
    }
    uploadModal = document.getElementById("uploadModal");
  });
});
/*MENU UTILITIES*/

//Get the user logged info and check if there are any user logged in the app null if there no user logged.
function user() {
  const user = auth.currentUser;
  return user;
}

//fill the menu profile options and show depends on Auth firebase object
function menuOptions(user) {
  let loginDropdown = document.getElementById("loginContainer");
  //let navAction = document.querySelector("#dropdown");
  //console.log(navAction.children);
  if (user) {
    //loginDropdown.children.loginFormContainer.remove();
    loginDropdown.innerHTML = menuActions;
  } else {
    if (loginDropdown.children.menuActions) {
      loginDropdown.children.menuActions.remove();
    }
    //console.log(loginDropdown.children[0]);
    loginDropdown.innerHTML = loginForm;
  }
}

//RESET PASSWORD

function resetPass() {
  let loginContainer = document.getElementById("dropdown").children[0];
  // console.log(loginContainer.children);
  let loginForm = loginContainer.children.loginFormContainer;
  loginForm.classList.add("d-none");
  loginContainer.innerHTML = resetPasswordForm;
  dropdownList.update();
}

function resetPassword(event) {
  event.preventDefault();
  const form = event.target.parentElement; //form
  firebase
    .auth()
    .sendPasswordResetEmail(form.email.value)
    .then(() => {
      toast("Email send, please check your spam inbox", 3000, "email");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      toast(errorMessage + ", try again", 3000, "email");
    });
}

function loginContainer() {
  let loginContainer = document.getElementById("dropdown").children[0];
  let login = loginContainer.children.resetPassFormContainer;
  login.classList.add("d-none");
  loginContainer.innerHTML = loginForm;
  dropdownList.update();
}

//Logout function, logout user.
function logout() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      dropdownList.update();
      toast("Succesfully logged out", 1000, "logged out");
    })
    .catch((error) => {
      // An error happened.
    });
}

//Menu dropdown animation icon, when dropdown shows, the icon changed to a fill version.
var myDropdown = document.getElementById("myDropdown");
myDropdown.addEventListener("show.bs.dropdown", function () {
  document.getElementById("dropdownMenuButton").classList.remove("bi-person");
  document.getElementById("dropdownMenuButton").classList.remove("link-light");
  document.getElementById("dropdownMenuButton").classList.add("bi-person-fill");
  document.getElementById("dropdownMenuButton").classList.add("link-logo");
});
myDropdown.addEventListener("hide.bs.dropdown", function () {
  document.getElementById("dropdownMenuButton").classList.remove("link-logo");
  document
    .getElementById("dropdownMenuButton")
    .classList.remove("bi-person-fill");
  document.getElementById("dropdownMenuButton").classList.add("link-light");
  document.getElementById("dropdownMenuButton").classList.add("bi-person");
});

//Login using email and password
var dropdownList = new bootstrap.Dropdown(
  document.querySelector("#dropdownMenuButton")
);
//dropdownList.toggle();
function signIn(event) {
  event.preventDefault();
  const form = event.target.parentElement; //form
  let spinner = document.createElement("span");
  spinner.classList.add("spinner-border", "spinner-border-sm");
  //let element = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
  // form.querySelector("button").textContent = "";
  spinner.setAttribute("role", "status");
  spinner.setAttribute("aria-hidden", "true");
  form.querySelector("button").disabled = true;
  form.querySelector("button").prepend(spinner);
  form.parentElement.parentElement.style.cursor = "wait";
  console.log(form);
  if (form.checkValidity()) {
    auth
      .signInWithEmailAndPassword(form.email.value, form.password.value)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        dropdownList.update();
        spinner.remove();
        form.parentElement.parentElement.style.cursor = "auto";
        form.querySelector("button").disabled = false;
        toast("Welcome!", 3000, "logged");
      })
      .catch((error) => {
        dropdownList.update();
        spinner.remove();
        form.parentElement.parentElement.style.cursor = "auto";
        form.querySelector("button").disabled = false;
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(error);
        toast(error.message, 5000, "logged out");
      });
  } else {
    dropdownList.update();
    spinner.remove();
    form.parentElement.parentElement.style.cursor = "auto";
    form.querySelector("button").disabled = false;
    form.reportValidity();
  }
}
//Login using google
function loginUsingGoogle() {
  var provider = new firebase.auth.GoogleAuthProvider();
  auth.languageCode =
    navigator.language.substr(0, navigator.language.indexOf("-")) ||
    navigator.userLanguage.substr(0, navigator.userLanguage.indexOf("-"));
  //console.log((navigator.language).substr(0,(navigator.language).indexOf('-')) || (navigator.userLanguage).substr(0,(navigator.userLanguage).indexOf('-')));
  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      /** @type {firebase.auth.OAuthCredential} */
      var credential = result.credential;

      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // ...
      console.warn(result.user);
      dropdownList.update();
      toast("Welcome!", 3000, "logged");
    })
    .catch((error) => {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      toast(error.message, 5000, "logged out");
      console.error(error);
      // ...
    });
}

function showLogin() {
  console.log("show");
  dropdownList.toggle();
}
/* GENERAL UTILITIES */

//convert secs to time format
String.prototype.toHHMMSS = function () {
  var sec_num = parseInt(this, 10); // don't forget the second param
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - hours * 3600) / 60);
  var seconds = sec_num - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  if (hours > 0) {
    return hours + ":" + minutes + ":" + seconds;
  } else {
    return minutes + ":" + seconds;
  }
};

//Gives the difference in seconds, minutes, hours and days between the current date and the given date, if the difference is more than a month just show the date.
function daysAgo(date) {
  var difference = Date.now() - date?.seconds * 1000;

  var daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
  difference -= daysDifference * 1000 * 60 * 60 * 24;

  var hoursDifference = Math.floor(difference / 1000 / 60 / 60);
  difference -= hoursDifference * 1000 * 60 * 60;

  var minutesDifference = Math.floor(difference / 1000 / 60);
  difference -= minutesDifference * 1000 * 60;

  var secondsDifference = Math.floor(difference / 1000);

  if (daysDifference > 30) {
    return new Date(date.seconds*1000).toDateString();
  } else if (daysDifference > 0) {
    return daysDifference + " day/s ago";
  } else if (hoursDifference > 0) {
    return hoursDifference + " hour/s ago";
  } else if (minutesDifference > 0) {
    return minutesDifference + " minute/s ago";
  } else if (secondsDifference > 0) {
    return secondsDifference + " second/s ago";
  }
}

function charCounter(str) {
  let total = str.length;
  return total;
}
function myAlert(text, time) {
  let alert = document.createElement("div");
  alert.classList.add(
    "alert",
    "alert-success",
    "fade",
    "show",
    "position-absolute",
    "top-0",
    "start-50",
    "translate-middle-x"
  );
  alert.style.zIndex = "5";
  alert.style.width = "100%";
  alert.setAttribute("role", "alert");
  alert.textContent = text;
  document.getElementById("alertContainer").appendChild(alert);
  var bsAlert = new bootstrap.Alert(alert);
  if (!time) {
    setTimeout(() => {
      bsAlert.close();
    }, 1000);
  } else {
    setTimeout(() => {
      bsAlert.close();
    }, time);
  }
}
function resize(file, size, element) {
  //define the width to resize e.g 600px
  var resize_width = size; //without px

  let a;

  //get the image selected
  var item = file;

  //create a FileReader
  var reader = new FileReader();

  //image turned to base64-encoded Data URI.
  reader.readAsDataURL(item);
  reader.name = item.name; //get the image's name
  reader.size = item.size; //get the image's size
  reader.onload = function (event) {
    var img = new Image(); //create a image
    img.src = event.target.result; //result is base64-encoded Data URI
    img.name = event.target.name; //set name (optional)
    img.size = event.target.size; //set size (optional)
    img.onload = function (el) {
      var elem = document.createElement("canvas"); //create a canvas

      //scale the image to 600 (width) and keep aspect ratio
      var scaleFactor = resize_width / el.target.width;
      elem.width = resize_width;
      elem.height = el.target.height * scaleFactor;

      //draw in canvas
      var ctx = elem.getContext("2d");
      ctx.drawImage(el.target, 0, 0, elem.width, elem.height);

      //get the base64-encoded Data URI from the resize image
      var srcEncoded = ctx.canvas.toDataURL("image/jpeg", 1);

      element.src = srcEncoded;
      console.log(elem.width, elem.height);
      //assign it to thumb src
      /*Now you can send "srcEncoded" to the server and
        convert it to a png o jpg. Also can send
        "el.target.name" that is the file's name.*/
    };
  };
}

function pickTextColorBasedOnBgColorAdvanced(bgColor, lightColor, darkColor) {
  var color = bgColor.charAt(0) === "#" ? bgColor.substring(1, 7) : bgColor;
  var r = parseInt(color.substring(0, 2), 16); // hexToR
  var g = parseInt(color.substring(2, 4), 16); // hexToG
  var b = parseInt(color.substring(4, 6), 16); // hexToB
  var uicolors = [r / 255, g / 255, b / 255];
  var c = uicolors.map((col) => {
    if (col <= 0.03928) {
      return col / 12.92;
    }
    return Math.pow((col + 0.055) / 1.055, 2.4);
  });
  var L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  console.warn(L);
  return L > 0.179 ? darkColor : lightColor;
}

function clipboardShareLinkProfile(id) {
  try {
    var successful = document.execCommand("copy");
    var msg = successful ? "successful" : "unsuccessful";
    console.log("Copying text command was " + msg);
  } catch (err) {
    console.log("Oops, unable to copy");
  }
}

function toast(text, time, type) {
  let toastType = "icon-main-logo";
  let colorStatus = "logo text-light";
  switch (type) {
    case "clipboard":
      toastType = "bi bi-clipboard-check";
      break;
    case "logged":
      toastType = "bi bi-person-check";
      colorStatus = "success text-light";
      break;
    case "logged out":
      toastType = "bi bi-person-x";
      colorStatus = "warning text-dark";
      break;
    case "img updated":
      toastType = "bi bi-person-square";
      colorStatus = "success text-light";
      break;
    case "upload failed":
      toastType = "bi bi-cloud-arrow-up";
      colorStatus = "danger text-light";
      break;
    case "profile updated":
      toastType = "bi bi-person-lines-fill";
      colorStatus = "success text-light";
      break;
    case "email":
      toastType = "bi bi-envelope";
      colorStatus = "warning text-dark";
      break;
    case "remove":
      toastType = "bi bi-file-x-fill";
      colorStatus = "danger text-light";
      break;
    case "update":
      toastType = "bi bi-file-text-fill";
      colorStatus = "logo text-light";
      break;
  }
  let toastHTML = `<div class=\"toast align-items-center\" role=\"alert\" aria-live=\"assertive\" aria-atomic=\"true\" > 
        <div class=\"fs-6\">
            <div class=\"row\" style="min-height:50px;">
                <div class=\"col-auto d-flex align-items-center bg-${colorStatus} ${toastType} rounded-start fs-2\">
                </div>
                <div class=\"col d-flex align-items-center\">
                    ${text}
                </div>
                <div class=\"col-auto d-flex align-items-center border-start border-dark\">
                    <a class=\"me-2 text-decoration-none link-dark fw-bolder\" data-bs-dismiss=\"toast\" aria-label=\"Close\" href=\"javascript:void(0)\">Dismiss</a>
                </div>
            </div>
        </div>
    </div>`;

  toastContainer.innerHTML = toastHTML;
  toastContainer.style.zIndex = "1050";
  let toast = new bootstrap.Toast(toastContainer.querySelector(".toast"), {
    animation: true,
    autohide: true,
    delay: time || 1000,
  });
  toast.show();
}
clipboard.on("success", function (e) {
  toast("Link saved in clipboard!", 2000, "clipboard");
});

/* USER INFO FUNCTIONS */
async function getImageURL(storage, id, element) {
  //console.info(id);
  var pathReference = "/staticFiles/defaultProfileImage.png";
  try {
    pathReference = await storage
      .ref("userPhotos/" + id + "/profileImage.jpg")
      .getDownloadURL();
  } catch (error) {}
  //console.log(pathReference);
  element.src = pathReference;

  //return pathReference.url;
  // pathReference.getDownloadURL()
  // .then((url) => {
  //     element.src = url;
  // })
  // .catch((error) => {
  //     if (error.code === 'storage/object-not-found'){
  //         element.src = 'staticFiles/profileImageDefault.png';
  //     }
  //     else{
  //         console.error(error.message);
  //     }

  // });
}
function getUserInfo(db, id, profile) {
  db.collection("user")
    .doc(id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        let objTemp = doc.data();
        objTemp.userId = id;
        //authUser = doc.data();
        //authUser.userId = id;
        loadUserInfo(objTemp, profile);
        if (!profile) getUserPosts(id);
      } else {
        console.log("No such document!");
        if (!profile) {
          if (user() && userValidate) {
            // doc.data() will be undefined in this case
            document.getElementById("spinner").remove(); //Remove spinner
            document.getElementById("cardContainerParent").textContent =
              "This user had no posts yet."; //Show message about this users does not have any post
            userDetails = {};
            userDetails.id = user.uid;
            newUser = true;
            toast(
              "To activate your profile, please fill out all the field or at least the required ones(username)",
              5000,
              "profile updated"
            );
            newProfileUpdate._element
              .getElementsByClassName("modal-header")[0]
              .getElementsByTagName("button")[0].disabled = true;
            newProfileUpdate._element
              .getElementsByClassName("modal-footer")[0]
              .getElementsByTagName("button")[0].disabled = true;
            newProfileUpdate.show();
          } else {
            //document.getElementById('spinner').parentElement.innerText = 'USER NOT FOUND';
            document.getElementById("spinner").remove(); //Remove spinner
            toast("User id not found", 5000, "logged out");
          }
        }
      }
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
}
function loadUserInfo(obj, profile) {
  let details = document.getElementById("detailsContainer");
  //console.log(details.children);
  userInfo = obj;
  console.log(obj);
  for (let i = 0; i < details.children.length; i++) {
    //console.log(details.children[i]);
    switch (details.children[i].id) {
      case "profileDetailsUsername":
        details.children[i].getElementsByTagName("a")[0].textContent =
          obj.username || details.children[i].textContent;

        if (userInfo.verify) {
          let verify = document.createElement("span");
          verify.classList.add(
            "bi",
            "bi-patch-check-fill",
            "fs-5",
            "text-logo"
          );
          verify.color = "var(--logo)";
          verify.title = verifedProfile;
          details.children[i].appendChild(verify);
        }
        //console.log(profile);
        if (!profile) {
          details.children[i]
            .getElementsByTagName("a")[0]
            .removeAttribute("href");
        } else {
          //console.log(userInfo);
          details.children[i].getElementsByTagName("a")[0].href =
            "u?id=" + userInfo.userId;
        }
        document.getElementsByTagName("title")[0].innerText =
          (obj.username || details.children[i].textContent) + "'s profile";
        break;
      case "profileMinDetails":
        if (obj.gender == 0) {
          details.children[i].querySelector(
            "#profileDetailsGender"
          ).textContent = "Female";

          details.children[i].querySelector(
            "#profileDetailsGender"
          ).innerHTML += "&#9792;";
        } else if (obj.gender == 1) {
          details.children[i].querySelector(
            "#profileDetailsGender"
          ).textContent = "Male";

          details.children[i].querySelector(
            "#profileDetailsGender"
          ).innerHTML += "&#9794;";
        } else {
          details.children[i].querySelector(
            "#profileDetailsGender"
          ).textContent = "No specify ";
          details.children[i].querySelector(
            "#profileDetailsGender"
          ).innerHTML += "&#9793;";
        }
        break;
      case "profileDetailsDesc":
        details.children[i].textContent =
          obj.desc.substr(0, 100) || details.children[i].textContent + "...";
        break;
      case "creationTime":
        if (obj.creationTime) {
          const date = new Date(obj.creationTime);
          const month = new Intl.DateTimeFormat(
            navigator.language || navigator.userLanguage,
            { month: "long" }
          ).format(date);
          details.children[i].textContent =
            "User since" + " " + month + " " + date.getFullYear();
        } else if (!details.children[i].textContent) {
          details.children[i].textContent = "";
        }
        break;
    }
  }
  if (!id) {
    document
      .getElementById("copyLink")
      .setAttribute(
        "data-clipboard-text",
        window.location.href + "?id=" + user().uid
      );
  } else {
    document
      .getElementById("copyLink")
      .setAttribute("data-clipboard-text", window.location.href);
  }
}
function uploadFiles(file, date) {
  //Emulator
  // Upload file and metadata to the object 'images/mountains.jpg'
  uploadTask = storage
    .ref()
    .child("audio/" + user().uid + "/" + date + "/" + file.name)
    .put(file);
  /* UPLOAD FUNCTIONS */
  uploadModal.addEventListener("hide.bs.modal", () => {
    console.log("Cancel upload");
    uploadTask.cancel();
  });
  uploadModal.addEventListener("hidden.bs.modal", () => {
    cleanView();
  });
  document.querySelector("#progressBar").style.display = "flex";
  document.querySelector("#uploadFile").style.display = "none";
  document.querySelector("#uploadButton").classList.add("disabled");
  document.querySelector("#uploading").textContent =
    "Uploading the file, please wait";
  // Listen for state changes, errors, and completion of the upload.
  uploadTask.on(
    firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
    function (snapshot) {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      //console.log('Upload is ' + progress + '% done');
      changeProgressBar(progress);
      //document.getElementById("progressBar").setAttribute("data-value",progress);
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log("Upload is paused");
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log("Upload is running000");
          break;
        case firebase.storage.TaskState.CANCELED: // or 'running'
          console.log("Upload is canceled");
          break;
      }
    },
    function (error) {
      //cleanView();
      console.log(error.code);
      //var myModalEl = document.getElementById('myModal')
      //var modal = bootstrap.Modal.getInstance(uploadModal); // Returns a Bootstrap modal instance
      //modal.hide();
      cleanView();
      if (error.code === "storage/unauthorized") {
        toast(
          `${error.code}<br>Please check if you already verify you email adress`,
          6000,
          "upload failed"
        );
      } else {
        toast(error.code, 6000, "upload failed");
      }
      upload;
    },
    function () {
      // Upload completed successfully, now we can get the download URL
      uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
        console.log("FULL PATH",uploadTask.snapshot.ref.fullPath);
        obj.filePath = uploadTask.snapshot.ref.fullPath;
        obj.userId = user().uid;
        obj.date = date;
        db.collection("post")
          .add(obj)
          .then((docRef) => {
            //console.log("Document written with ID: ", docRef.id);
            document
              .querySelector("#progressBar")
              .children[0].classList.toggle("bg-secondary", false);
            document
              .querySelector("#progressBar")
              .children[0].classList.toggle("primary-color-bg", true);
            document.querySelector("#menuAction").style.display = "block";
            document.querySelector("#toAudio").href = "/post?id=" + docRef.id;
            if (window.location.href.indexOf("u") != -1) {
              createElement(docRef.id, obj);
            }
          })
          .catch((error) => {
            console.error("Error adding document: ", error);
          });
      });
    }
  );
}
function cleanView() {
  document.querySelector("#uploading").textContent = "";
  document
    .querySelector("#progressBar")
    .children[0].classList.toggle("bg-secondary", true);
  document
    .querySelector("#progressBar")
    .children[0].classList.toggle("primary-color-bg", false);
  document.querySelector("#progressBar").style.display = "none";
  document.querySelector("#menuAction").style.display = "none";
  document.querySelector("#uploadFile").style.display = "block";

  document.querySelector("#uploadButton").classList.remove("disabled");
  //document.querySelector('#uploadButton').disabled = true;
  //document.querySelector('#uploadButton').childNodes[0].style.display = 'none';
  document.querySelector("#uploadFile").reset();
}
function changeProgressBar(progress) {
  let bar = document.querySelector("#progressBar").children[0];
  bar.style.width = progress + "%";
  bar.setAttribute("aria-valuenow", progress);
  bar.textContent = Math.floor(progress) + "%";
}
function loadUpload() {
  let form = document.getElementById("uploadFile");
  obj = {
    title: form.title.value,
    desc: form.desc.value,
    nsfw: form.nsfw.checked,
  };
  let file = form.file.files[0];
  if (form.reportValidity() && file.type.includes("audio")) {
    uploadFiles(file, Date.now());
  }
}
function checkSize(element) {
  let file = element.files[0];
  if (file.size / 1024 / 1024 > 60) {
    element.setCustomValidity("File size exceeds 60MB");
  }
}
function userElement(id) {
  let infoContainer = document.createElement("div");
  let infoHTML = `<div class="sticky-top" style="top: 57px; z-index: 1010;">
  <div class="d-flex justify-content-center align-items-center rounded-top border border-1 position-relative"
      style="width: 100%; min-height: 200px; background-color: rgba(206, 206, 206, 0.534);"
      id="imageContainer">
      <img src="" alt="" crossorigin="anonymous"
          style="height: 150px; min-width: 150px; max-width: 150px; object-fit: cover; background-color: rgba(206, 206, 206, 0.534);"
          id="profileImage" class="rounded-circle border border-3 mt-1 mb-1">
      <div style="height: 150px; width: 150px;"
          class="position-absolute rounded-circle d-flex justify-content-center align-items-center pe-none"
          id="editImageContainer">
          <span class="bi bi-camera-fill text-decoration-none link-light pe-none d-none"
              style="font-size: 37.5px;  text-shadow: 0 0 3px black; line-height: 25px;"></span>
      </div>
      <input type="file" class="d-none" id="profileImageInput" accept="image/*">
      <div class="position-absolute top-0 end-0 p-2">
          <div class="dropdown">
              <a class="bi bi-three-dots-vertical text-decoration-none link-dark"
                  data-bs-auto-close="true" id="shareDots" href="#" role="button" id="dropdownLink"
                  data-bs-toggle="dropdown" aria-expanded="false"></a>
              <ul class="dropdown-menu dropdown-menu-lg-end dropdown-menu-dark" id="profileOptions">
                  <li><a class="dropdown-item copyLink" href="javascript:void(0);"
                          data-clipboard-text="Just because you can doesn't mean you should — clipboard.js"
                          id="copyLink">Get profile's link</a></li>
                  <!-- <li><a class="dropdown-item" href="javascript:void(0)" data-bs-toggle="modal"
                          data-bs-target="#profileDetailsModal">Edit profile</a></li> -->
              </ul>
          </div>
      </div>
  </div>
  <div id="detailsContainer"
      class="border border-1 rounded-bottom border-top-0 text-center text-white">
      <small id="creationTime">User from Jan 2021</small>
      <p id="profileDetailsUsername"
          class="m-0 fw-bold fs-3 d-flex align-items-center justify-content-center">
          <a class="text-decoration-none link-light" href="#">/u</a>
          <!-- <a href="javascript:void()" class="disabled d-none bi bi-pencil-square link-light fs-6"
              data-bs-toggle="modal" data-bs-target="#profileDetailsModal" id="editBtn"
              style="line-height: 100%;"></a> -->
      </p>
      <div id="profileMinDetails">
          <small id="profileDetailsGender" class="fst-italic"></small>
      </div>
      <div class="m-0 p-0 fw-light fs- text-break" id="profileDetailsDesc">
      </div>
  </div>
</div>`;
}
async function checkUserFollows(userFollowing, userid) {
  // let followingContent = await db
  //   .collection("post")
  //   .where("userId", "array-contains", userid)
  //   .limit(10)
  //   .get();
  // console.log(followingContent.docs);
  // followingContent.find((element.data()=>u));
  //userFollowing.
}
