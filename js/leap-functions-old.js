jQuery(function($){

var can = document.getElementById('canvas'),
	ctx = can.getContext("2d");
var options = {
	enableGestures: true,
	frameEventName: 'animationFrame'
};

// console.log($(window).width())
Leap.loop(options, function(frame) {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	// if(frame.pointables.length > 0){
	frame.gestures.forEach(function(gesture){
		if(gesture.type != "swipe") return;
		var start = frame.interactionBox.normalizePoint(gesture.startPosition),
			end = frame.interactionBox.normalizePoint(gesture.position);

		var startX = ctx.canvas.width * start[0],
			startY = ctx.canvas.width * (1 - start[1]);

		var endX = ctx.canvas.width * end[0],
			endY = ctx.canvas.width * (1 - end[1]);

		ctx.beginPath();
		ctx.moveTo(startX, startY);
		ctx.lineTo(endX, endY);
		ctx.stroke();
	});	

	frame.pointables.forEach(function(pointable){
		var position = pointable.stabilizedTipPosition;
		var normalized = frame.interactionBox.normalizePoint(position);
		
		var x = ctx.canvas.width * normalized[0],
			y = ctx.canvas.height * (1 - normalized[1]);

		ctx.beginPath();
		ctx.rect(x, y, 20, 20);
		ctx.fill();
	});
		// var el = document.getElementById("test-obj");

		// var main = document.getElementById("main"),
		// 	w = $(main).width() - 100,
		// 	h = $(main).height() - 100;

		// var x = window.innerWidth * normalized[0];
		// var y = window.innerHeight * (1 - normalized[1]);
		// if(x < w && x > 0){
		// 	el.style.left = x + 'px';
		// }
		// if(y < h && y > 0){
		// 	el.style.top = y + 'px';

		// }
	// }
});



});