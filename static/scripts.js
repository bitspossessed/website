function randomRange(min, max) {
  return min + (Math.random() * (max - min));
}

function generateRandomPath(width, height) {
  const path = []

  // Set some "control points" which form the rectangular shape with slight
  // randomization
  path.push({ x: randomRange(46, 54), y: randomRange(0, 3) })
  path.push({ x: randomRange(5, 10), y: randomRange(0, 10) })
  path.push({ x: randomRange(0, 5), y: randomRange(30, 60) })
  path.push({ x: randomRange(0, 10), y: randomRange(90, 100) })

  path.push({ x: randomRange(40, 60), y: randomRange(95, 100) })
  path.push({ x: randomRange(90, 100), y: randomRange(90, 100) })
  path.push({ x: randomRange(95, 100), y: randomRange(30, 60) })
  path.push({ x: randomRange(90, 100), y: randomRange(0, 10) })

  path.push({ x: path[0].x, y: path[0].y })
  path.push({ x: path[1].x, y: path[1].y })

  // Construct a catmull rom spline from the control points to smoothen the shape
  let d = ''

  path.forEach((coord, index, array) => {
    const p = []

    if (index === 0) {
      d += `M${coord.x},${coord.y} `
      p.push(array[array.length - 3])
      p.push(array[index])
      p.push(array[index + 1])
      p.push(array[index + 2])
    } else if (index === array.length - 2) {
      p.push(array[index - 1])
      p.push(array[index])
      p.push(array[index + 1])
      p.push(array[0])
    } else if (index === array.length - 1) {
      p.push(array[index - 1])
      p.push(array[index])
      p.push(array[0])
      p.push(array[1])
    } else {
      p.push(array[index - 1])
      p.push(array[index])
      p.push(array[index + 1])
      p.push(array[index + 2])
    }

    const bp = []
    bp.push({ x: p[1].x, y: p[1].y })
    bp.push({
      x: (-p[0].x + 6 * p[1].x + p[2].x) / 6,
      y: (-p[0].y + 6 * p[1].y + p[2].y) / 6
    })
    bp.push({
      x: (p[1].x + 6 * p[2].x - p[3].x) / 6,
      y: (p[1].y + 6 * p[2].y - p[3].y) / 6
    })
    bp.push({ x: p[2].x, y: p[2].y })

    d +=
      'C' +
      bp[1].x +
      ',' +
      bp[1].y +
      ' ' +
      bp[2].x +
      ',' +
      bp[2].y +
      ' ' +
      bp[3].x +
      ',' +
      bp[3].y +
      ' '
  })

  d += 'Z'

  return d;
}

function getShapeElement(options) {
  const { width, height, colors } = options;

  // Generate a "random" rectangular shape
  const shape = generateRandomPath(width, height);

  // We can only assign ids once, so let's make sure they are unique
  let randomId = `gradient-${Date.now() + Math.round(randomRange(0, 100))}`;

  // Create the main svg element holding the shape and gradient information
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  // Give the view box some padding, to avoid clipping when points fall a
  // little outside the boundaries
  svg.setAttribute('viewBox', '-25 -25 150 150');
  svg.setAttribute('preserveAspectRatio', 'none');

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

document.body.appendChild(getShapeElement({
  width: 100,
  height: 50,
  colors: ['#ed6ea0', '#ec8c69'],
}));
