var i = 0,
  minimizedWidth = new Array(),
  minimizedHeight = new Array(),
  windowTopPos = new Array(),
  windowLeftPos = new Array(),
  panel,
  id;

// Función para extraer URL del post desde pathname limpio
function getPostUrlFromPath() {
  const path = window.location.pathname;
  // Verificar si la URL sigue el patrón /post/YYYY/MM/DD/titulo.html
  const postMatch = path.match(/\/post(\/.+)$/);
  if (postMatch) {
    return postMatch[1]; // Retorna la parte del URL del post
  }
  // Fallback: verificar hash antiguo para compatibilidad
  const hash = window.location.hash;
  if (hash && hash.startsWith('#post=')) {
    return hash.substring(6);
  }
  return null;
}

// Función para actualizar URL de forma limpia
function updateCleanUrl(postUrl) {
  if (postUrl) {
    const cleanUrl = '/post' + postUrl;
    // Solo actualizar si es diferente para evitar duplicados en history
    if (window.location.pathname !== cleanUrl) {
      history.pushState({ postUrl: postUrl }, '', cleanUrl);
    }
  }
}

function loadURL(url, id, skipHistoryUpdate = false) {
  // Actualizar la URL limpia solo si no viene de popstate
  if (url && id === '3' && !skipHistoryUpdate) {
    updateCleanUrl(url);
  }
  
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Post no encontrado (404)');
      }
      return response.text();
    })
    .then((data) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, "text/html");
      const titleElement = doc.querySelector('[class="post-title p-name"]');
      const articleBodyElement = doc.querySelector('[itemprop="articleBody"]');
      
      // Verificar que los elementos existan
      if (!titleElement || !articleBodyElement) {
        throw new Error('Estructura del post no válida');
      }
      
      const title = titleElement.innerHTML;
      const articleBodyContent = articleBodyElement.innerHTML;
      
      if(id === '5'){
        document.getElementById("cv-content").innerHTML = articleBodyContent;
        document.getElementById("title5").innerHTML = title;
      }else{
        document.getElementById("post-content").innerHTML = articleBodyContent;
        document.getElementById("title3").innerHTML = title;
        openWindow(id);
      }
    })
    .catch((error) => {
      console.log("Error:", error);
      if (id === '3') {
        document.getElementById("post-content").innerHTML = 
          '<div style="padding: 20px; color: #d32f2f;">' +
          '<h3>Error al cargar el post</h3>' +
          '<p>' + error.message + '</p>' +
          '</div>';
        document.getElementById("title3").innerHTML = "Error";
        openWindow(id);
      }
    });
}

// Función para cargar post desde URL (pathname o hash)
function loadPostFromUrl() {
  const postUrl = getPostUrlFromPath();
  if (postUrl) {
    // Pequeño delay para asegurar que las ventanas estén inicializadas
    setTimeout(() => {
      loadURL(postUrl, '3', true); // skipHistoryUpdate=true porque ya está en la URL
    }, 500);
  }
}

// Escuchar cambios en history (botones atrás/adelante del navegador)
window.addEventListener('popstate', function(event) {
  if (event.state && event.state.postUrl) {
    loadURL(event.state.postUrl, '3', true);
  } else {
    // Si no hay estado, verificar si hay post en la URL actual
    const postUrl = getPostUrlFromPath();
    if (postUrl) {
      loadURL(postUrl, '3', true);
    } else {
      // Cerrar ventana si no hay post en URL
      closeWindwow('3');
    }
  }
});

// Escuchar cambios en el hash (compatibilidad hacia atrás)
window.addEventListener('hashchange', function() {
  const postUrl = getPostUrlFromPath();
  if (postUrl) {
    loadURL(postUrl, '3', true);
  }
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
      //animation complete
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
  // Limpiar la URL si se cierra la ventana de posts
  if (id === '3') {
    history.pushState(null, '', '/');
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
    // window template
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
  $(".wincontent").resizable(); // resizable
  $(".window").draggable({
    cancel: ".wincontent",
  }); // draggable
  $(".window").mousedown(function () {
    // active window on top (z-index 1000)
    makeWindowActive($(this).attr("data-id"));
  });
  $(".winclose").click(function () {
    // close window
    closeWindwow($(this).parent().parent().attr("data-id"));
  });
  $(".winminimize").click(function () {
    // minimize window
    minimizeWindow($(this).parent().parent().attr("data-id"));
  });
  $(".taskbarPanel").click(function () {
    // taskbar click
    id = $(this).attr("data-id");
    if ($(this).hasClass("activeTab")) {
      // minimize if active
      minimizeWindow($(this).attr("data-id"));
    } else {
      if ($(this).hasClass("minimizedTab")) {
        // open if minimized
        openMinimized(id);
      } else {
        // activate if inactive
        makeWindowActive(id);
      }
    }
  });
  $(".openWindow").click(function () {
    // open closed window
    openWindow($(this).attr("data-id"));
  });
  $(".winmaximize").click(function () {
    if ($(this).parent().parent().hasClass("fullSizeWindow")) {
      // minimize
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
      // maximize
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
  
  // Cargar post desde URL si existe
  loadPostFromUrl();
});
