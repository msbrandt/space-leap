jQuery(function($){

var op = document.getElementById('output');
var cats = {};
Leap.loop(function(frame) {
	frame.hands.forEach(function(hand, index){
		var cat = ( cats[index] || (cats[index] = new Cat()) );
		cat.setTransform(hand.screenPosition(), hand.roll());
	})

	// var controller = new Leap.Controller();
	// console.log(controller);
		// .use('screenPosition')
		// .connect()
		// .on('frame', function(frame){
		// 	use_fn();
		// });


}).use('screenPosition', {scale: 0.25});

var Cat = function(){
	var cat = this;

  	var el = document.createElement('div');
  	el.id = "test-obj";
	document.getElementById('main').appendChild(el);

  	el.change = function () {
  		console.log('fn is working');
	  // 	cat.setTransform([window.innerWidth/2,window.innerHeight/2], 0);
  	}

	cat.setTransform = function(position, rotation){
		var lp = position[0] - ($(el).width() / 2) + 'px',
			tp = position[1] - ($(el).height() /2)-300 + 'px';
		
		el.style.left = lp;
		el.style.top = tp;

		// console.log(rotation);

		el.style.transform = 'rotate(' + -rotation + 'rad)';

		el.style.webkitTransform = el.style.MozTransform = el.style.msTransform =
  		el.style.OTransform = el.style.transform;
	};
};
cats[0] = new Cat();

function use_fn(){
	// console.log('working');
}

});