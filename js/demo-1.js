(function () {

	var width, height, MainEl, canvas, ctx, points, target, animateHeader = true;

	// Main
	initHeader();
	initAnimation();
	addListeners();

	function initHeader() {
		width = window.innerWidth;
		height = window.innerHeight;
		target = {
			x: undefined,
			y: undefined
		};

		MainEl = document.getElementById('main');
		//largeHeader.style.height = height + 'px';

		canvas = document.getElementById('canvas-el');
		canvas.width = width;
		canvas.height = height;
		ctx = canvas.getContext('2d');

		// create points
		points = [];
		for (var x = -50; x < width; x = x + width / 14) {
			for (var y = -50; y < height; y = y + height / 14) {
				var px = x + Math.random() * width / 14;
				var py = y + Math.random() * height / 14;
				var p = {x: px, originX: px, y: py, originY: py };
				points.push(p);
			}
		}

		// for each point find the 5 closest points
		for (var i = 0; i < points.length; i++) {
			var closest = [];
			var p1 = points[i];
			for (var j = 0; j < points.length; j++) {
				var p2 = points[j]
				if (!(p1 == p2)) {
					var placed = false;
					for (var k = 0; k < 5; k++) {
						if (!placed) {
							if (closest[k] == undefined) {
								closest[k] = p2;
								placed = true;
							}
						}
					}

					for (var k = 0; k < 5; k++) {
						if (!placed) {
							if (getDistance(p1, p2) < getDistance(p1, closest[k])) {
								closest[k] = p2;
								placed = true;
							}
						}
					}
				}
			}
			p1.closest = closest;
		}

		// assign a circle to each point
		for (var i in points) {
			var c = new Circle(points[i], 3 + Math.random() * 2, 'rgba(255,255,255,0.3)');
			points[i].circle = c;
			points[i].circle.active = 0;
		}
	}

	// Event handling
	function addListeners() {
		if (!('ontouchstart' in window)) {
			window.addEventListener('mousemove', mouseMove);
		}
		//window.addEventListener('scroll', scrollCheck);
		window.addEventListener('resize', resize);
	}

	function mouseMove(e) {
		var posx = 0;
		var posy = 0;
		if (e.pageX || e.pageY) {
			posx = e.pageX;
			posy = e.pageY;
		}
		else if (e.clientX || e.clientY) {
			posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
		target.x = posx;
		target.y = posy;
	}

	/*function scrollCheck() {
		if (document.body.scrollTop > height) animateHeader = false;
		else animateHeader = true;
	}*/

	function resize() {
		initHeader();
	}

	// animation
	function initAnimation() {
		animate();
	}

	function animate() {
		ctx.clearRect(0, 0, width, height);
		var powerz = Math.pow(10, 1);
		for (var i in points) {

			var currentPoint = points[i];
			var currentCircle = currentPoint.circle;

			var distance = getDistance(target, currentPoint);

			if (distance < 50000) {
				currentPoint.active = 1;
				shiftPoint(currentPoint);
				if (currentCircle.active <= 1) {
					currentCircle.active += Math.round((1 - distance / 50000) * powerz) / powerz;
				}

			} else {
				currentPoint.active = 0;
				if (currentCircle.active >= 0) {
					currentCircle.active -= 0.05;
				}
			}

			drawLines(currentPoint);
			currentCircle.draw();
		}
		requestAnimationFrame(animate);
	}

	function shiftPoint(p) {
		TweenLite.to(
			p,
				2 + 1 * Math.random(),
			{
				x: p.originX - 50 + Math.random() * 100,
				y: p.originY - 50 + Math.random() * 100,
				ease: Sine.easeInOut/*,
				 onComplete: function() {
					if (p.active) {
						console.log(p.active);
						shiftPoint(p);
					}
				}*/
			}
		);
	}

	// Canvas manipulation
	function drawLines(p) {
		//if(!p.active) return;
		var color = 'rgba(255,255,255,0.2)';
		var pX = p.x;
		var pY = p.y;
		var pClosest;
		for (var i in p.closest) {
			pClosest = p.closest[i];
			ctx.beginPath();
			ctx.moveTo(pX, pY);
			ctx.lineTo(pClosest.x, pClosest.y);
			ctx.strokeStyle = color;
			ctx.lineWidth = 2;
			ctx.stroke();
			ctx.closePath();
		}
	}

	function Circle(pos, rad, color) {
		var _this = this;

		// constructor
		(function () {
			_this.pos = pos || null;
			_this.radius = rad || null;
			_this.color = color || null;
		})();

		this.draw = function () {
			if (!_this.active) return;
			ctx.beginPath();
			ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
			ctx.fillStyle = 'rgba(255,255,255,' + _this.active + ')';
			ctx.fill();
		};
	}

	// Util
	function getDistance(p1, p2) {
		return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
	}

})();
