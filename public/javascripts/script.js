$(function(){
  // get viewport size
  function getViewportSize() {
      return {
          height: window.innerHeight,
          width:  window.innerWidth
      };
  }

  function resizeHandler(){
    if(! (viewportInfo==null || viewportInfo==undefined)){
      var size = {};
      size= getViewportSize();
      viewportInfo.text("v: "+size.width+" - h: "+size.height);
    }
    console.log("resizeHandler", "viewpoert updated "+"v: "+size.width+" - h: "+size.height);
  }

  if(!('getContext' in document.createElement('canvas'))){
    alert('Lo sentimos, tu navegador no soporta canvas!');
    return false;
  }
  
  var url = 'http://' + window.location.host;

  // cache de objetos de jQuery
  var doc = $(document);
  var win = $(window);
  var canvas = $('#paper');
  var instructions = $('#instructions');
  var connections = $('#connections');
  var viewportInfo = $('#viewportInfo');
  var ctx = canvas[0].getContext('2d');

  // id único para la session
  var id = Math.round($.now()*Math.random());

  // inicializamos el estado
  var drawing = false;
  var clients = {};
  var cursors = {};
  var prev = {};
  var lastEmit = $.now();
  var cursorColor = randomColor();

  // abrimos la conexion
  var socket = io.connect(url);

  /*
    Administradores de eventos
   */

  function moveHandler(data) {

    if(! (data.id in clients)){
      // le damos un cursor a cada usuario nuestro
      cursors[data.id] = $('<div class="cursor"><span class="username" style="color:'+data.color+';">'+data.id+'</span></div>').appendTo('#cursors');
    }

    // movemos el cursor a su posicion
    cursors[data.id].css({
      'left' : data.x,
      'top' : data.y
    });

    if(data.drawing && clients[data.id]){
      drawLine(clients[data.id].x, clients[data.id].y, data.x, data.y, data.color);
    }

    // actualizamos el estado
    clients[data.id] = data;
    clients[data.id].updated = $.now();
  }

  function mousedownHandler(e) {
    e.preventDefault();
    drawing = true;
    prev.x = e.pageX;
    prev.y = e.pageY;

    // escondemos las instrucciones
    instructions.fadeOut();
  }

  function mousemoveHandler(e) {
    if($.now() - lastEmit > 30){
      var movement = {
        'x': e.pageX,
        'y': e.pageY,
        'drawing': drawing,
        'color': cursorColor,
        'id': id
      };
      socket.emit('mousemove', movement);
      lastEmit = $.now();
    }

    if(drawing){

      drawLine(prev.x, prev.y, e.pageX, e.pageY, cursorColor);

      prev.x = e.pageX;
      prev.y = e.pageY;
    }


  }

  function drawLine(fromx, fromy, tox, toy, color){
    ctx.beginPath(); // create a new empty path (no subpaths!)
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.stroke();
  }

  function connectionHandler(data) {
    console.log('connections', connections);
    connections.text(data.connections + ' conectados');
  }

  function randomColor() {
    // from http://www.paulirish.com/2009/random-hex-color-code-snippets/
    return '#'+(function lol(m,s,c){return s[m.floor(m.random() * s.length)] +
    (c && lol(m,s,c-1));})(Math,'0123456789ABCDEF',4);
  }

  /**
   * Adjuntamos los eventos
   */
  socket.on('move', moveHandler);
  socket.on('connections', connectionHandler);
  canvas.on('mousedown', mousedownHandler);
  doc.on('mousemove', mousemoveHandler);
  doc.on('ready', resizeHandler);

  doc.bind('mouseup mouseleave',function(){
    drawing = false;
  });

  /**
   * Borramos sessiones viejas
   */
  var seg=1000;
  var min=60*seg;
  setInterval(function(){
    for(var ident in clients){
      if($.now() - clients[ident].updated > 10*seg){
        cursors[ident].remove();
        delete clients[ident];
        delete cursors[ident];
      }
    }
  },10000);




/* end touch events */
    var ongoingTouches = new Array;
    var 

    function colorForTouch(touch) {
      var id = touch.identifier;
      id = id.toString(16); // make it a hex digit
      return "#" + id + id + id;
    }
    
    function ongoingTouchIndexById(idToFind) {
      for (var i=0; i<ongoingTouches.length; i++) {
        var id = ongoingTouches[i].identifier;
        
        if (id == idToFind) {
          return i;
        }
      }
      return -1;    // not found
    }
    
    function handleStart(evt) {
      evt.preventDefault();
      var el = document.getElementById("paper");
      var ctx = el.getContext("2d");
      var touches = evt.changedTouches;
            
      for (var i=0; i<touches.length; i++) {
        ongoingTouches.push(touches[i]);
        var color = colorForTouch(touches[i]);
        ctx.fillStyle = color;
        ctx.fillRect(touches[i].pageX-2, touches[i].pageY-2, 4, 4);
      }
    }
  
    function handleMove(evt) {
      evt.preventDefault();
      var el = document.getElementById("paper");
      var ctx = el.getContext("2d");
      var touches = evt.changedTouches;
      
      ctx.lineWidth = 4;
            
      for (var i=0; i<touches.length; i++) {
        var color = colorForTouch(touches[i]);
        var idx = ongoingTouchIndexById(touches[i].identifier);

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
        ctx.lineTo(touches[i].pageX, touches[i].pageY);
        ctx.closePath();
        ctx.stroke();
        ongoingTouches.splice(idx, 1, touches[i]);  // swap in the new touch record
    }

    if($.now() - lastEmit > 30){
      var movement = {
        'x': e.pageX,
        'y': e.pageY,
        'drawing': drawing,
        'color': cursorColor,
        'id': id
      };
      socket.emit('mousemove', movement);
      lastEmit = $.now();
    }

    if(drawing){

      drawLine(prev.x, prev.y, e.pageX, e.pageY, cursorColor);

      prev.x = e.pageX;
      prev.y = e.pageY;
    }



















    }

    function handleEnd(evt) {
      evt.preventDefault();
      var el = document.getElementById("paper");
      var ctx = el.getContext("2d");
      var touches = evt.changedTouches;
      
      ctx.lineWidth = 4;
            
      for (var i=0; i<touches.length; i++) {
        var color = colorForTouch(touches[i]);
        var idx = ongoingTouchIndexById(touches[i].identifier);
        
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(ongoingTouches[i].pageX, ongoingTouches[i].pageY);
        ctx.lineTo(touches[i].pageX, touches[i].pageY);
        ongoingTouches.splice(i, 1);  // remove it; we're done
      }
    }
    
    function handleCancel(evt) {
      evt.preventDefault();
      var touches = evt.changedTouches;
      
      for (var i=0; i<touches.length; i++) {
        ongoingTouches.splice(i, 1);  // remove it; we're done
      }
    }

  
    function startup() {
      var el = document.getElementById("paper");
      el.addEventListener("touchstart", handleStart, false);
      el.addEventListener("touchend", handleEnd, false);
      el.addEventListener("touchcancel", handleCancel, false);
      el.addEventListener("touchleave", handleEnd, false);
      el.addEventListener("touchmove", handleMove, false);
    }
    startup();


/* end touch events */

});