var posters = [
	'/images/1157545_503162539771566_1409663390_n.jpg',
	'/images/946545_485505011537319_1545746861_n.jpg',
	'/images/970031_10153233571210261_1319488419_n.jpg'
];

var _startX = 0;
var _startY = 0;
var _offsetX = 0;
var _offsetY = 0;
var _dragElement;
var _oldZIndex = 0;
var _zindex = 10;

var fadeOut = function() {
  document.getElementById('photos').style.display = 'none';  
  document.getElementById('close').style.display = 'none';
};

function initDragDrop() {
    document.onmousedown = onMouseDown;
    document.onmouseup = onMouseUp;
}

function extractNumber(value) {
    var n = parseInt(value);
    return n == null || isNaN(n) ? 0 : n;
}

function onMouseDown(e) {
	if (e == null) e = window.event; 
	var target = e.target != null ? e.target : e.srcElement;
    
	if ((e.button == 1 && window.event != null || 
		e.button == 0) && 
		target.className.indexOf('drag') > -1) {
		_startX = e.clientX;
		_startY = e.clientY;
		_offsetX = extractNumber(target.style.left);
		_offsetY = extractNumber(target.style.top);
		_oldZIndex = target.style.zIndex;
		target.style.zIndex = 10000;
		_dragElement = target;
		document.onmousemove = onMouseMove;
		document.body.focus();
		document.onselectstart = function () { return false; };
		target.ondragstart = function() { return false; };
		return false;
	}
}

function onMouseMove(e) {
	if (e == null) var e = window.event; 
	_dragElement.style.left = (_offsetX + e.clientX - _startX) + 'px';
	_dragElement.style.top = (_offsetY + e.clientY - _startY) + 'px';
	_dragElement.style.top + ')';   
}

function onMouseUp(e) {
	if (_dragElement != null) {
		_dragElement.style.zIndex = ++_zindex;
		document.onmousemove = null;
		document.onselectstart = null;
		_dragElement.ondragstart = null;
		_dragElement = null;
        
	}
}

var photosInitialized = false;
function displayImages() {

  if(!photosInitialized) {
    photosInitialized = true;
    showPictures();
    initDragDrop();
  }

  document.getElementById('photos').style.display = 'block';  
  document.getElementById('close').style.display = 'block';  
};

document.querySelector('#close').onclick = fadeOut;

document.querySelector('#pics-link').onclick = function(e) {
  e.preventDefault();
  displayImages();
}

var w = window,
  d = document,
  e = d.documentElement,
  g = d.getElementsByTagName('body')[0],
  x = (d.innerWidth || e.clientWidth || g.clientWidth) - 160,
  y = d.innerHeight || w.innerHeight || e.clientHeight|| g.clientHeight;

var showPictures = function() {
  var photos = [
    '0001.jpg',
    '0002.jpg',
    '0003.jpg',
    '0004.jpg',
    '0005.jpg',
    '0006.jpg',
    '0007.jpg',
    '0008.jpg',
    '0009.jpg',
    '0010.jpg',
    '0011.gif',
    '0012.jpg',
    '0013.jpg',
    '0014.jpg',
    '0015.jpg',
    '0016.jpg',
    '0017.jpg',
    '0018.jpg',
    '0019.jpg',
    '0020.jpg'
  ];

  for(var i = 0; i < photos.length; i++) {
    var div = document.querySelector('#photos');
    var photo = photos[i];
    var image = document.createElement('img');
    image.src = 'images/' + photo;
    image.className = 'drag';
    image.style.top = '' + Math.random() * (y) + 'px';
    image.style.left = '' + (Math.random() * (x) - 160) + 'px';
    div.appendChild(image);
  }
};

(function() {
  displayImages();
})();
