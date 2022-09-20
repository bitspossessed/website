function normalVariate(a, b) {
  return a + (((Math.random() * 2 + Math.random() * 2 + Math.random() * 2 - 3) / 3) * b) / 2;
}

// This code is still a little messy as it was minified before, but it works!
class Tree {
  constructor(element) {
    this.canvas2d = element;
    this.ctx2d = element.getContext("2d");
    this.string = "lL[+L][-L]";
    this.branchTexture;
    this.treePosY = 0;
    this.iterations = 5;
    this.angleMean = (20 / 180) * Math.PI;
    this.angleVariation = (10 / 180) * Math.PI;
    this.length = 30;
    this.lengthReduction = 0.8;
    this.thickness = 15;
    this.thicknessReduction = 0.65;
    this.rules = {
      L: {
        developsInto: [
          "l",
          "+lL",
          "-lL",
          "L[+LL][-LL]l",
          "[+L][-L]",
          "L[+lLL]",
          "L[-lLL]",
        ],
      },
      l: { developsInto: ["l"] },
      "[": { developsInto: ["["] },
      "]": { developsInto: ["]"] },
      "+": { developsInto: ["+"] },
      "-": { developsInto: ["-"] },
    };
    this.leafTextures = [];
    this.leafScaleVariation = 0.5;
    this.leafMinDepth = 4;
    this.leafProba = 0.5;
    this.leafScale = 1;
    this.leafTotalPerBranch = 1;
    this.leafProbaLighterMult = 0.5;
    this.curveXVariation = 10;
    this.curveYVariation = 5;
    this.shadowProba = 0.2;
    this.shadowAlpha = 0.025;
    this.shadowRadius = 40;
  }

  draw() {
    const n = this.ctx2d;
    n.setTransform(1, 0, 0, 1, 0, 0);
    n.save();

    try {
      let r = this.string;
      let d;
      for (let m = 0; m < this.iterations; m++) {
        d = "";
        for (let s = 0; s < r.length; s++) {
          const g = r[s];
          const c = this.rules[g].developsInto;
          if (c.length <= 0) {
            continue;
          }
          const a = c[parseInt(Math.random() * c.length)];
          d += a;
        }
        r = d;
      }
      let w = 0.1;
      const f = 1 / this.iterations;
      n.strokeStyle = '#fff';
      n.lineWidth = this.thickness;
      n.lineCap = "round";
      let p = 1;
      let h = 0;
      n.clearRect(0, 0, this.canvas2d.width, this.canvas2d.height);
      n.translate(this.canvas2d.width / 2, this.canvas2d.height - this.treePosY);
      for (let s = 0; s < d.length; s++) {
        const b = d[s];
        if (b == "l") {
          n.strokeStyle = '#fff';
          n.beginPath();
          n.moveTo(0, 0);
          n.quadraticCurveTo(
            normalVariate(0, this.curveXVariation),
            normalVariate(0, this.curveYVariation) - this.length / 2,
            0,
            -this.length
          );
          n.stroke();
          if (Math.random() <= this.shadowProba) {
            n.save();
            n.globalCompositeOperation = "source-atop";
            n.globalAlpha = this.shadowAlpha;
            n.beginPath();
            n.arc(0, 0, this.shadowRadius, 0, Math.PI * 2, false);
            n.fill();
            n.restore();
          }
          h++;
          n.translate(0, -this.length);
          n.fillStyle = "#efefef";
          if (
            p >= this.leafMinDepth &&
            Math.random() <= this.leafProba
          ) {
            for (let q = 0; q < this.leafTotalPerBranch; q++) {
              n.save();
              if (
                Math.random() <=
                (p / this.iterations) * this.leafProbaLighterMult
              ) {
                n.globalCompositeOperation = "lighter";
              }
              n.rotate(Math.random() * Math.PI * 2);
              n.fillRect(0, 0, 10, 10);
              n.restore();
            }
          }
        } else {
          if (b == "+") {
            n.rotate(normalVariate(this.angleMean, this.angleVariation));
          } else {
            if (b == "-") {
              n.rotate(
                -normalVariate(this.angleMean, this.angleVariation)
              );
            } else {
              if (b == "[") {
                n.save();
                this.length *= this.lengthReduction;
                p++;
                w += f;
                n.lineWidth *= this.thicknessReduction;
              } else {
                if (b == "]") {
                  this.length *= 1 / this.lengthReduction;
                  p--;
                  w -= f;
                  n.restore();
                }
              }
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
    }

    n.restore();
  }
}

const canvas = document.getElementById('responsive-canvas');
const tree = new Tree(canvas);
const heightRatio = 1.5;
canvas.height = canvas.width * heightRatio;

window.setInterval(() => {
  tree.draw();
}, 250);
