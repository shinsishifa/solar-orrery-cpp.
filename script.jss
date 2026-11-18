const canvas = document.getElementById('cosmosCanvas');
const ctx = canvas.getContext('2d');

const speedSlider = document.getElementById('speedSlider');
const speedVal = document.getElementById('speedVal');
const planetTitle = document.getElementById('planetTitle');
const planetDesc = document.getElementById('planetDesc');
const planetStats = document.getElementById('planetStats');

let width, height;
let timeScale = 1.0;
let stars = [];
let selectedPlanet = null;

const planets = [
  { name: 'Mercury', radius: 4, distance: 70, speed: 0.04, color: '#aaaaaa', desc: 'The smallest and closest planet to the Sun. Experiences extreme temperature fluctuations.', stats: 'Distance: 57.9M km | Orbit: 88 Earth days' },
  { name: 'Venus', radius: 7, distance: 110, speed: 0.03, color: '#e3bb76', desc: 'Hottest planet in the solar system due to a runaway greenhouse effect beneath thick clouds.', stats: 'Distance: 108.2M km | Orbit: 225 Earth days' },
  { name: 'Earth', radius: 8, distance: 160, speed: 0.025, color: '#00f0ff', desc: 'Our home planet—the only astronomical object known to harbor life and liquid surface water.', stats: 'Distance: 149.6M km | Orbit: 365.25 days' },
  { name: 'Mars', radius: 6, distance: 220, speed: 0.02, color: '#ff4444', desc: 'The Red Planet, home to Olympus Mons, the largest volcano in the solar system.', stats: 'Distance: 227.9M km | Orbit: 687 Earth days' },
  { name: 'Jupiter', radius: 16, distance: 300, speed: 0.012, color: '#e0ae6f', desc: 'The largest gas giant in our solar system, famous for its massive Great Red Spot storm.', stats: 'Distance: 778.5M km | Orbit: 11.9 Earth years' },
  { name: 'Saturn', radius: 13, distance: 380, speed: 0.009, color: '#f4e2bb', desc: 'Dazzling ringed giant composed mostly of hydrogen and helium with icy ring particles.', stats: 'Distance: 1.43B km | Orbit: 29.5 Earth years' },
  { name: 'Uranus', radius: 10, distance: 450, speed: 0.006, color: '#73d2de', desc: 'An ice giant with a unique sideways axial tilt, causing extreme 42-year seasons.', stats: 'Distance: 2.87B km | Orbit: 84 Earth years' },
  { name: 'Neptune', radius: 10, distance: 520, speed: 0.004, color: '#3366ff', desc: 'The windiest and most distant major planet, featuring supersonic dynamic storms.', stats: 'Distance: 4.50B km | Orbit: 165 Earth years' }
];

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Initialize Starfield
for (let i = 0; i < 200; i++) {
  stars.push({
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 1.5,
    alpha: Math.random()
  });
}

function selectPlanet(planet) {
  selectedPlanet = planet;
  planetTitle.innerText = planet.name;
  planetDesc.innerText = planet.desc;
  planetStats.innerText = planet.stats;
}

// Default select Earth
selectPlanet(planets[2]);

// Click detection for planets
canvas.addEventListener('click', (e) => {
  const cx = width / 2;
  const cy = height / 2;
  const clickX = e.clientX;
  const clickY = e.clientY;

  planets.forEach(p => {
    const angle = Date.now() * 0.0005 * p.speed * timeScale;
    const px = cx + Math.cos(angle) * p.distance;
    const py = cy + Math.sin(angle) * p.distance;

    const dist = Math.hypot(clickX - px, clickY - py);
    if (dist < p.radius + 10) {
      selectPlanet(p);
    }
  });
});

function draw() {
  ctx.clearRect(0, 0, width, height);

  const cx = width / 2;
  const cy = height / 2;

  // Draw Stars
  ctx.fillStyle = '#ffffff';
  stars.forEach(s => {
    ctx.globalAlpha = s.alpha;
    ctx.fillRect(s.x, s.y, s.size, s.size);
  });
  ctx.globalAlpha = 1.0;

  // Draw Sun
  ctx.beginPath();
  ctx.arc(cx, cy, 32, 0, Math.PI * 2);
  let sunGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, 32);
  sunGrad.addColorStop(0, '#ffff00');
  sunGrad.addColorStop(0.7, '#ff8800');
  sunGrad.addColorStop(1, '#ff2200');
  ctx.fillStyle = sunGrad;
  ctx.shadowBlur = 30;
  ctx.shadowColor = '#ff5500';
  ctx.fill();
  ctx.shadowBlur = 0;

  // Draw Orbits & Planets
  planets.forEach(p => {
    // Orbit line
    ctx.beginPath();
    ctx.arc(cx, cy, p.distance, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Planet position
    const angle = Date.now() * 0.0005 * p.speed * timeScale;
    const px = cx + Math.cos(angle) * p.distance;
    const py = cy + Math.sin(angle) * p.distance;

    // Draw Planet
    ctx.beginPath();
    ctx.arc(px, py, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.shadowBlur = 8;
    ctx.shadowColor = p.color;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Highlight selected planet
    if (selectedPlanet === p) {
      ctx.beginPath();
      ctx.arc(px, py, p.radius + 6, 0, Math.PI * 2);
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  });

  requestAnimationFrame(draw);
}

speedSlider.addEventListener('input', (e) => {
  timeScale = parseFloat(e.target.value);
  speedVal.innerText = `${timeScale.toFixed(1)}x`;
});

function setSpeed(val) {
  timeScale = val;
  speedSlider.value = val;
  speedVal.innerText = `${val.toFixed(1)}x`;
}

draw();
