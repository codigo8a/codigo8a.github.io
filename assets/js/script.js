var i = 0,
  minimizedWidth = new Array(),
  minimizedHeight = new Array(),
  windowTopPos = new Array(),
  windowLeftPos = new Array(),
  panel,
  id;

function loadURL(url, id) {
  if (url && id === '3') {
    var cleanUrl = url.startsWith('/') ? url.substring(1) : url;
    window.location.hash = cleanUrl;
  }
  
  fetch(url)
    .then((response) => response.text())
    .then((data) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, "text/html");
      const title = doc.querySelector(
        '[class="post-title p-name"]'
      ).innerHTML;
      const articleBodyContent = doc.querySelector(
        '[itemprop="articleBody"]'
      ).innerHTML;
      if(id === '5'){
        document.getElementById("cv-content").innerHTML = articleBodyContent;
        document.getElementById("title5").innerHTML = title;
      }else{
        document.getElementById("post-content").innerHTML = articleBodyContent;
        document.getElementById("title3").innerHTML = title;
        openWindow(id);
      }
    })
    .catch((error) => console.log("Error:", error));
}

function loadPostFromHash() {
  const hash = window.location.hash;
  if (hash && hash.startsWith('#')) {
    const postUrl = hash.substring(1);
    if (postUrl) {
      setTimeout(() => {
        loadURL('/' + postUrl, '3');
      }, 500);
    }
  }
}

window.addEventListener('hashchange', function() {
  loadPostFromHash();
});

function adjustFullScreenSize() {
  $(".fullSizeWindow .wincontent").css("width", window.innerWidth - 32);
  $(".fullSizeWindow .wincontent").css("height", window.innerHeight - 98);
}

function makeWindowActive(thisid) {
  $(".window").each(function () {
    $(this).css("z-index", $(this).css("z-index") - 1);
  });
  $("#window" + thisid).css("z-index", 1000);
  $(".window").removeClass("activeWindow");
  $("#window" + thisid).addClass("activeWindow");
  $(".taskbarPanel").removeClass("activeTab");
  $("#minimPanel" + thisid).addClass("activeTab");
}

function minimizeWindow(id) {
  windowTopPos[id] = $("#window" + id).css("top");
  windowLeftPos[id] = $("#window" + id).css("left");
  $("#window" + id).animate(
    {
      top: 800,
      left: 0,
    },
    200,
    function () {
      $("#window" + id).addClass("minimizedWindow");
      $("#minimPanel" + id).addClass("minimizedTab");
      $("#minimPanel" + id).removeClass("activeTab");
    }
  );
}

function openWindow(id) {
  if ($("#window" + id).hasClass("minimizedWindow")) {
    openMinimized(id);
  } else {
    makeWindowActive(id);
    $("#window" + id).removeClass("closed");
    $("#minimPanel" + id).removeClass("closed");
  }
}

function closeWindwow(id) {
  $("#window" + id).addClass("closed");
  $("#minimPanel" + id).addClass("closed");
  if (id === '3') {
    window.location.hash = '';
  }
}

function openMinimized(id) {
  $("#window" + id).removeClass("minimizedWindow");
  $("#minimPanel" + id).removeClass("minimizedTab");
  makeWindowActive(id);
  $("#window" + id).animate(
    {
      top: windowTopPos[id],
      left: windowLeftPos[id],
    },
    200,
    function () {}
  );
}
$(document).ready(function () {
  $(".window").each(function () {
    $(this).css("z-index", 1000);
    $(this).attr("data-id", i);
    minimizedWidth[i] = $(this).width();
    minimizedHeight[i] = $(this).height();
    windowTopPos[i] = $(this).css("top");
    windowLeftPos[i] = $(this).css("left");
    $("#taskbar").append(
      '<div class="taskbarPanel" id="minimPanel' +
        i +
        '" data-id="' +
        i +
        '">' +
        $(this).attr("data-title") +
        "</div>"
    );
    if ($(this).hasClass("closed")) {
      $("#minimPanel" + i).addClass("closed");
    }
    
    $(this).wrapInner('<div class="wincontent"></div>');
    $(this).prepend(
      '<div class="windowHeader"><strong id="title'+ i +'">' +
        $(this).attr("data-title") +
        '</strong><span title="Minimize" class="winminimize"><span></span></span><span title="Maximize" class="winmaximize"><span></span><span></span></span><span title="Close" class="winclose">x</span></div>'
    );
    $(this).attr("id", "window" + i++);
    loadURL('/2009/01/01/hoja-de-vida.html', '5'); 
  });
  $("#minimPanel" + (i - 1)).addClass("activeTab");
  $("#window" + (i - 1)).addClass("activeWindow");
  $(".wincontent").resizable();
  $(".window").draggable({
    cancel: ".wincontent",
  });
  $(".window").mousedown(function () {
    makeWindowActive($(this).attr("data-id"));
  });
  $(".winclose").click(function () {
    closeWindwow($(this).parent().parent().attr("data-id"));
  });
  $(".winminimize").click(function () {
    minimizeWindow($(this).parent().parent().attr("data-id"));
  });
  $(".taskbarPanel").click(function () {
    id = $(this).attr("data-id");
    if ($(this).hasClass("activeTab")) {
      minimizeWindow($(this).attr("data-id"));
    } else {
      if ($(this).hasClass("minimizedTab")) {
        openMinimized(id);
      } else {
        makeWindowActive(id);
      }
    }
  });
  $(".openWindow").click(function () {
    openWindow($(this).attr("data-id"));
  });
  $(".winmaximize").click(function () {
    if ($(this).parent().parent().hasClass("fullSizeWindow")) {
      $(this).parent().parent().removeClass("fullSizeWindow");
      $(this)
        .parent()
        .parent()
        .children(".wincontent")
        .height(minimizedHeight[$(this).parent().parent().attr("data-id")]);
      $(this)
        .parent()
        .parent()
        .children(".wincontent")
        .width(minimizedWidth[$(this).parent().parent().attr("data-id")]);
    } else {
      $(this).parent().parent().addClass("fullSizeWindow");
      minimizedHeight[$(this).parent().parent().attr("data-id")] = $(this)
        .parent()
        .parent()
        .children(".wincontent")
        .height();
      minimizedWidth[$(this).parent().parent().attr("data-id")] = $(this)
        .parent()
        .parent()
        .children(".wincontent")
        .width();
      adjustFullScreenSize();
    }
  });
  adjustFullScreenSize();
  loadPostFromHash();
});