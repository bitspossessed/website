function randomRange(min, max) {
  return Math.round(min + (Math.random() * (max - min)));
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
  let d = [];
  path.forEach((coord, index, array) => {
    const p = [];

    if (index === 0) {
      d.push(`M${coord.x},${coord.y}`);
      p.push(array[array.length - 3])
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
  const { width, height, randomness, colors } = options;

  // Generate a "random" rectangular shape
  const shape = generateRandomPath(width, height, randomness);

  // We can only assign ids once, so let's make sure they are unique
  let randomId = `gradient-${Date.now() + randomRange(0, 100)}`;

  // Create the main svg element holding the shape and gradient information
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

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
  path.setAttribute('d', shape);

  svg.appendChild(defs);
  svg.appendChild(path);

  return svg;
}

const shapes = document.getElementById('shapes');
shapes.appendChild(getShapeElement({
  width: 500,
  height: 500,
  randomness: 50,
  colors: ['#ed6ea0', '#ec8c69'],
}));
