/**
 * Interactive Paper.js sketch for the intro canvas.
 * @param {HTMLCanvasElement} canvas
 * @param {*} Paper - default export from the `paper` package
 * @returns {() => void}
 */
export function initSketch(canvas, Paper) {
	const scope = new Paper.PaperScope();
	scope.setup(canvas);
	scope.activate();
	const tool = new scope.Tool();

	const { Path, Point, Size, view } = scope;

	/** Logical size in CSS px (Paper view space — not backing-store pixels). */
	let width = 1;
	let height = 1;

	/** Normalized 0..1 view coords; first point = mousedown, rest = drag. Wide figure-8 (Gerono lemniscate) + light 4ω wobble. */
	const INTRO_STROKE_PATH = [
		[0.5, 0.5],
		[0.6187, 0.6476],
		[0.7286, 0.7136],
		[0.8216, 0.6821],
		[0.8907, 0.6034],
		[0.9308, 0.5355],
		[0.939, 0.489],
		[0.9146, 0.4339],
		[0.8595, 0.3557],
		[0.7777, 0.2921],
		[0.6753, 0.3063],
		[0.5599, 0.4202],
		[0.4401, 0.5798],
		[0.3247, 0.6937],
		[0.2223, 0.7079],
		[0.1405, 0.6443],
		[0.0854, 0.5661],
		[0.061, 0.511],
		[0.0692, 0.4645],
		[0.1093, 0.3966],
		[0.1784, 0.3179],
		[0.2714, 0.2864],
		[0.3813, 0.3524]
	];

	const INTRO_DURATION_MS = 500;

	/** @type {ReturnType<typeof setTimeout>[]} */
	let introTimeouts = [];

	const colors = [
		'rgb(236,112,99)',
		'rgb(155,96,52)',
		'rgb(245,189,75)',
		'rgb(231,231,130)',
		'rgb(234,240,183)',
		'rgb(173,213,167)',
		'rgb(106,183,128)',
		'rgb(109,191,137)',
		'rgb(34,95,62)',
		'rgb(124,199,177)',
		'rgb(106,188,204)',
		'rgb(131,207,240)',
		'rgb(184,209,236)',
		'rgb(62,88,167)',
		'rgb(212,175,207)',
		'rgb(245,219,234)',
		'rgb(250,190,208)',
		'rgb(245,187,203)',
		'rgb(211,3,34)',
		'rgb(90,86,88)',
		'rgb(113,113,113)',
		'rgb(202,202,202)'
	];

	let path = new Path();
	/** @type {any[]} */
	let circles = [];
	let segmentsAdded = 0;
	let circlesAdded = 0;

	function syncSize() {
		const rect = canvas.getBoundingClientRect();
		const w = Math.max(1, Math.round(rect.width));
		const h = Math.max(1, Math.round(rect.height));
		// CanvasView already applies devicePixelRatio and ctx.scale — do not set canvas.width/height manually.
		view.setViewSize(new Size(w, h));
		width = w;
		height = h;
		configureStroke();
	}

	function configureStroke() {
		// minDistance is in view (CSS) space; 0.1 × width was meant for full-viewport sketches — scale down for a column layout.
		tool.minDistance = 75;
		path.strokeWidth = 1.5;
	}

	syncSize();
	queueMicrotask(() => {
		requestAnimationFrame(() => syncSize());
	});

	path.strokeCap = 'round';
	path.strokeColor = '#0B0A0F';

	function lilFibPick() {
		return [1, 2, 3, 5];
	}
	function bigFibPick() {
		return [3, 5, 8, 13];
	}
	function biggestFibPick() {
		return [21, 34, 55];
	}

	/** @param {number} n */
	function pointInCircle(n) {
		const u = Math.random();
		const v = Math.random();
		const theta = u * 2.0 * Math.PI;
		const phi = Math.acos(2.0 * v - 1.0);
		const r = Math.cbrt(Math.random());
		const x = r * Math.sin(phi) * Math.cos(theta);
		const y = r * Math.sin(phi) * Math.sin(theta);
		return new Point(n * x, n * y);
	}

	/** @param {InstanceType<typeof Point>} base @param {InstanceType<typeof Point>} offset */
	function addPoints(base, offset) {
		return new Point(base.x + offset.x, base.y + offset.y);
	}

	/**
	 * @template T
	 * @param {readonly T[]} arr
	 * @returns {T}
	 */
	function randof(arr) {
		return arr[Math.floor(Math.random() * arr.length)];
	}

	/** @param {number} event */
	function animate(event) {
		for (let i = 0; i < circles.length; i++) {
			if (i % 2 === 0) {
				circles[i].position.y += 0.5 * Math.random() * Math.sin(event + i);
			} else {
				circles[i].position.y += 2.5 * Math.random() * Math.cos(event + i);
			}
		}
		const bf = bigFibPick();
		for (let i = 0; i < path.segments.length; i++) {
			path.segments[i].point.x += 0.9 * Math.random() * Math.sin(0.3 * event + Math.random() + randof(bf) * i);
			path.segments[i].point.y += 0.781 * Math.random() * Math.cos(0.5 * event + Math.random() + randof(bf) * i);
			path.segments[i].handleIn += Math.random() * Math.cos(8 * event + Math.random() + randof(bf) * i);
			path.segments[i].handleOut += 1.2 * Math.random() * Math.sin(13 * event + Math.random() + randof(bf) * i);
		}
	}

	/** @param {{ count: number; point: InstanceType<typeof Point> }} event */
	function onMouseDown(event) {
		animate(event.count - Math.random());
		const lf = lilFibPick();
		const bfp = bigFibPick();
		const bgf = biggestFibPick();
		for (let i = 0; i < randof(lf); i++) {
			const pt = pointInCircle(21 * randof(bfp));
			path.add(addPoints(event.point, pt));
			path.simplify();
			path.smooth({ type: 'catmull-rom', factor: 0.0 });
			segmentsAdded++;
		}
		const c2 = new Path.Circle(new Point(event.point.y, Math.random() * width), randof(bgf));
		c2.fillColor = randof(colors);
		if (Math.random() < 0.49) {
			c2.insertBelow(path);
		} else {
			c2.shadowColor = 'rgb(0,0,0,0.18)';
			c2.shadowBlur = 21;
			c2.shadowOffset = new Point(0, 0);
		}
		circles.push(c2);
		circlesAdded++;
	}

	/** @param {{ count: number; point: InstanceType<typeof Point> }} event */
	function onMouseDrag(event) {
		animate(event.count - Math.random());
		const lf = lilFibPick();
		const bfp = bigFibPick();
		const bgf = biggestFibPick();
		for (let i = 0; i < randof(lf); i++) {
			const pt = pointInCircle(16 * randof(bfp));
			path.add(addPoints(event.point, pt));
			path.simplify();
			path.smooth({ type: 'catmull-rom', factor: 0.0 });
			// path.blendMode = 'difference';
			segmentsAdded++;
		}
		const c1 = new Path.Circle(new Point(event.point.x, Math.random() * height), randof(bgf));
		c1.fillColor = randof(colors);
		for (let i = 0; i < c1.segments.length; i++) {
			c1.segments[i].point.x += i * Math.random() * 5;
			c1.segments[i].point.y -= i * Math.random() * 5;
		}
		if (Math.random() < 0.49) {
			c1.insertBelow(path);
			c1.shadowColor = 'rgb(0,0,0,0.05)';
			c1.shadowBlur = 12;
			c1.shadowOffset = new Point(0, 0);
		} else {
			c1.shadowColor = 'rgb(0,0,0,0.1)';
			c1.shadowBlur = 34;
			c1.shadowOffset = new Point(0, 12);
			// c1.blendMode = 'difference';
		}
		circles.push(c1);
		circlesAdded++;
	}

	function onMouseUp() {
		if (path.segments.length > 50) {
			for (let i = 0; i < segmentsAdded * (0.3 + Math.random()); i++) {
				setTimeout(() => {
					if (path.segments.length) {
						path.removeSegment(0);
						segmentsAdded--;
					}
				}, 50 + 70 * i);
			}
		}
		for (let i = 0; i < circles.length; i++) {
			circles[i].tween(
				{ fillColor: randof(colors), rotation: randof([-1 * Math.random(), 1 * Math.random()]) * 135 },
				{ easing: 'easeInOutCubic', duration: 100 + 10 * i }
			);
		}
		if (circles.length > 20) {
			for (let i = 0; i < circlesAdded * (0.2 + Math.random()); i++) {
				const idx = i;
				setTimeout(() => {
					if (circles.length) {
						circles[0].remove();
						circlesAdded--;
						circles.shift();
					}
				}, 50 + 200 * idx);
			}
		}
	}

	/** @param {{ count: number; point: InstanceType<typeof Point> }} event */
	// function onMouseMove(event) {
	// 	animate(event.count - 0.5 * Math.random());
	// }

	tool.onMouseDown = onMouseDown;
	tool.onMouseDrag = onMouseDrag;
	tool.onMouseUp = onMouseUp;
	// tool.onMouseMove = onMouseMove;

	function clearIntroTimeouts() {
		for (const id of introTimeouts) clearTimeout(id);
		introTimeouts = [];
	}

	function scheduleIntroStroke() {
		clearIntroTimeouts();
		syncSize();
		const pts = INTRO_STROKE_PATH;
		const n = pts.length;
		if (n === 0) return;
		for (let i = 0; i < n; i++) {
			const delay = n <= 1 ? 0 : (i / (n - 1)) * INTRO_DURATION_MS;
			const id = setTimeout(() => {
				const pt = new Point(pts[i][0] * width, pts[i][1] * height);
				const ev = { count: i + 1, point: pt };
				if (i === 0) onMouseDown(ev);
				else onMouseDrag(ev);
			}, delay);
			introTimeouts.push(id);
		}
	}

	requestAnimationFrame(() => {
		requestAnimationFrame(() => {
			scheduleIntroStroke();
		});
	});

	const ro = new ResizeObserver(() => {
		requestAnimationFrame(() => syncSize());
	});
	ro.observe(canvas);
	if (canvas.parentElement) ro.observe(canvas.parentElement);

	function onWinResize() {
		syncSize();
	}
	window.addEventListener('resize', onWinResize);

	return () => {
		clearIntroTimeouts();
		window.removeEventListener('resize', onWinResize);
		ro.disconnect();
		tool.remove();
		scope.project.clear();
		scope.remove();
	};
}
