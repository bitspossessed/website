const SHAPE_CLASS_NAMES = [
  'bottom-center',
  'bottom-left',
  'bottom-right',
  'middle-left',
  'middle-right',
  'top-center',
  'top-left',
  'top-right',
];

const SHAPE_WIDTH = 250;
const SHAPE_HEIGHT = 250;
const SHAPE_RANDOMNESS = 50;

const MIN_SHAPE_COUNT = 0;
const MAX_SHAPE_COUNT = 5;

const MIN_SHAPE_CHANGE = 1000 * 1; // in ms
const MAX_SHAPE_CHANGE = 1000 * 2; // in ms

/**
 * Helper method returning a random number between a minimum and maximum
 **/
function randomRange(min, max) {
  return Math.round(min + Math.random() * (max - min));
}

/**
 * Helper method randomizing an array in-place.
 **/
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

function generateRandomPath(width, height, randomness) {
  const path = [];

  // Set some "control points" which form the rectangular shape. The basic
  // points look like that:
  //
  // *  *  *  *  *
  // *           *
  // *           *
  // *           *
  // *  *  *  *  *
  //          ^
  //          We start here and go clockwise
  //
  path.push({ x: (width / 4) * 3, y: 0 });
  path.push({ x: width / 2, y: 0 });
  path.push({ x: width / 4, y: 0 });
  path.push({ x: 0, y: 0 });

  path.push({ x: 0, y: height / 4 });
  path.push({ x: 0, y: height / 2 });
  path.push({ x: 0, y: (height / 4) * 3 });
  path.push({ x: 0, y: height });

  path.push({ x: width / 4, y: height });
  path.push({ x: width / 2, y: height });
  path.push({ x: (width / 4) * 3, y: height });
  path.push({ x: width, y: height });

  path.push({ x: width, y: (height / 4) * 3 });
  path.push({ x: width, y: height / 2 });
  path.push({ x: width, y: height / 4 });
  path.push({ x: width, y: 0 });

  // Randomize all points a little bit, this will make the shape look more
  // interesting
  path.forEach(({ x, y }, index) => {
    path[index] = {
      x: randomRange(x - randomness, x + randomness),
      y: randomRange(y - randomness, y + randomness),
    };
  });

  // Do not forget to connect the last point with the first, to close the path
  path.push({ x: path[0].x, y: path[0].y });
  path.push({ x: path[1].x, y: path[1].y });

  // Calculate catmull rom spline from the control points to smoothen the shape
  const d = [];
  path.forEach((coord, index, array) => {
    const p = [];

    if (index === 0) {
      d.push(`M${coord.x},${coord.y}`);
      p.push(array[array.length - 3]);
      p.push(array[index]);
      p.push(array[index + 1]);
      p.push(array[index + 2]);
    } else if (index === array.length - 2) {
      return;
    } else if (index === array.length - 1) {
      return;
    } else {
      p.push(array[index - 1]);
      p.push(array[index]);
      p.push(array[index + 1]);
      p.push(array[index + 2]);
    }

    const bp = [];
    bp.push({ x: p[1].x, y: p[1].y });
    bp.push({
      x: (-p[0].x + 6 * p[1].x + p[2].x) / 6,
      y: (-p[0].y + 6 * p[1].y + p[2].y) / 6,
    });
    bp.push({
      x: (p[1].x + 6 * p[2].x - p[3].x) / 6,
      y: (p[1].y + 6 * p[2].y - p[3].y) / 6,
    });
    bp.push({ x: p[2].x, y: p[2].y });

    d.push(`C${bp[1].x},${bp[1].y},${bp[2].x},${bp[2].y},${bp[3].x},${bp[3].y}`);
  });

  d.push('Z');

  return d.join(' ');
}

function getShapeElement(options) {
  const { width, height, randomness, colors, className } = options;

  // We can only assign ids once, so let's make sure they are unique
  let randomId = `gradient-${Date.now() + randomRange(0, 100)}`;

  // Create the main svg element holding the shape and gradient information
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.classList.add('shape');
  svg.classList.add(`shape-${className}`);

  // Generate the gradient definition
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const linearGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
  linearGradient.setAttribute('id', randomId);

  colors.forEach((color, index) => {
    const stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop.setAttribute('offset', `${(index / colors.length) * 100}%`);
    stop.setAttribute('stop-color', color);
    linearGradient.appendChild(stop);
  });
  defs.appendChild(linearGradient);

  // Add the path definition to the svg element
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('fill', `url(#${randomId})`);

  const changeShape = () => {
    const shape = generateRandomPath(width, height, randomness);
    path.setAttribute('d', shape);
  };

  // Set an initial shape
  changeShape();

  // Change it directly after to already make it an animation
  window.setTimeout(() => {
    changeShape();
  }, 1);

  // Do it after a while again, so its in constant change
  window.setInterval(() => {
    changeShape();
  }, randomRange(MIN_SHAPE_CHANGE, MAX_SHAPE_CHANGE));

  svg.appendChild(defs);
  svg.appendChild(path);

  return svg;
}

// We randomize the class names before so it looks a little different every time
const classNames = shuffleArray(SHAPE_CLASS_NAMES);

// Let's generate some random shapes and put them in the background of the page
const shapes = document.getElementById('shapes');

const colorElectricViolet = '#B100FF'; //rgb(177, 0, 255)
const colorPersianBlue = '#1116C8'; //rgb(17, 22, 200)
const colorBlackRussian = '#020024'; //rgb(2, 0, 36)
const colorDeepBlush = '#ED6EA0'; //rgb(237, 110, 160)
const colorApricot = '#ec8c69';

function hslToHex(h, s, l) {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0'); // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToHSL(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  r = parseInt(result[1], 16);
  g = parseInt(result[2], 16);
  b = parseInt(result[3], 16);
  (r /= 255), (g /= 255), (b /= 255);
  var max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  var h,
    s,
    l = (max + min) / 2;
  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  var HSL = new Object();
  HSL['h'] = h;
  HSL['s'] = s;
  HSL['l'] = l;
  return HSL;
}

function generateShadesColors(hexColor) {
  const hexColorHSL = hexToHSL(hexColor);

  const firstShade = 'hsl(' + parseFloat(hexColorHSL.h.toFixed(2)) * 100 + ', ' + parseFloat(hexColorHSL.s.toFixed(2)) * 100 + '%, ' + 90 + '%)';
  const secondShade = 'hsl(' + parseFloat(hexColorHSL.h.toFixed(2)) * 100 + ', ' + parseFloat(hexColorHSL.s.toFixed(2)) * 100 + '%, ' + 70 + '%)';
  const thirdShade = 'hsl(' + parseFloat(hexColorHSL.h.toFixed(2)) * 100 + ', ' + parseFloat(hexColorHSL.s.toFixed(2)) * 100 + '%, ' + 50 + '%)';
  const fourthShade = 'hsl(' + parseFloat(hexColorHSL.h.toFixed(2)) * 100 + ', ' + parseFloat(hexColorHSL.s.toFixed(2)) * 100 + '%, ' + 30 + '%)';
  const fifthShade = 'hsl(' + parseFloat(hexColorHSL.h.toFixed(2)) * 100 + ', ' + parseFloat(hexColorHSL.s.toFixed(2)) * 100 + '%, ' + 10 + '%)';

  const shades = [firstShade, secondShade, thirdShade, fourthShade, fifthShade];

  console.log('shades', shades);
  return shades;
}

function generateAnaloguesColors(hexColor) {
  const hexColorHSL = hexToHSL(hexColor);
  const h = parseFloat(hexColorHSL.h.toFixed(2)) * 100;
  const s = parseFloat(hexColorHSL.s.toFixed(2)) * 100;
  const l = parseFloat(hexColorHSL.l.toFixed(2)) * 100;

  function correctiveHue(x) {
    if (h + x > 360) {
      return h + x - 360;
    } else {
      return h + x;
    }
  }

  function correctiveSat(x) {
    if (s + x > 100) {
      return s + x - 100;
    } else {
      return s + x;
    }
  }

  function correctiveLight(x) {
    if (l + x > 100) {
      return l - x;
    } else {
      return l + x;
    }
  }

  const firstAnalogues = 'hsl(' + correctiveHue(-60) + ', ' + correctiveSat(-15) + '%, ' + correctiveLight(10) + '%)';
  const secondAnalogues = 'hsl(' + correctiveHue(-30) + ', ' + correctiveSat(15) + '%, ' + correctiveLight(10) + '%)';
  const thirdAnalogues = 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
  const fourthAnalogues = 'hsl(' + correctiveHue(30) + ', ' + correctiveSat(-15) + '%, ' + correctiveLight(10) + '%)';
  const fifthAnalogues = 'hsl(' + correctiveHue(60) + ', ' + correctiveSat(15) + '%, ' + correctiveLight(10) + '%)';

  const analogues = [firstAnalogues, secondAnalogues, thirdAnalogues, fourthAnalogues, fifthAnalogues];

  console.log('analogues', analogues);

  return analogues;
}

generateShadesColors('#ed6ea0');
generateAnaloguesColors('#ed6ea0');

for (let i = 0; i < randomRange(MIN_SHAPE_COUNT, MAX_SHAPE_COUNT); i += 1) {
  shapes.appendChild(
    getShapeElement({
      width: SHAPE_WIDTH,
      height: SHAPE_HEIGHT,
      randomness: SHAPE_RANDOMNESS,
      className: classNames[i % classNames.length],
      colors: generateAnaloguesColors('#ed6ea0'),
    }),
  );
}
