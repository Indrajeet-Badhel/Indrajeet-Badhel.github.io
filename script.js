const data = window.siteData;

function renderProjects() {
  const target = document.querySelector("#project-list");
  target.innerHTML = data.projects.map((project) => {
    const stack = project.stack.map((item) => `<span>${item}</span>`).join("");
    const linkedTitle = project.link === "#"
      ? project.name
      : `<a class="project-link" href="${project.link}" target="_blank" rel="noreferrer">${project.name}</a>`;

    return `
      <article class="project-card">
        <div>
          <div class="project-meta">${project.type} / ${project.status}</div>
          <h3>${linkedTitle}</h3>
          <p>${project.summary}</p>
        </div>
        <div class="project-stack">${stack}</div>
      </article>
    `;
  }).join("");
}

function renderPlatforms() {
  const target = document.querySelector("#platform-grid");
  target.innerHTML = data.platforms.map((platform) => `
    <a class="platform-card" href="${platform.href}" target="_blank" rel="noreferrer">
      <div>
        <strong>${platform.name}</strong>
        <span>${platform.handle}</span>
      </div>
      <small>${platform.metric}</small>
    </a>
  `).join("");
}

function renderLogs() {
  const target = document.querySelector("#log-list");
  target.innerHTML = data.logs.map((entry) => `
    <a class="log-card" href="${entry.href}">
      <span>${entry.meta}</span>
      <h3>${entry.title}</h3>
      <p>${entry.text}</p>
    </a>
  `).join("");
}

function renderHeatmap() {
  const heatmap = document.querySelector("#heatmap");
  const count = document.querySelector("#contribution-count");
  count.textContent = `${data.contributionCount} contributions`;

  const days = 7 * 32;
  const activeSeeds = new Set([8, 15, 23, 52, 89, 96, 97, 102, 106, 117, 138, 157, 192, 205, 209, 211]);
  let html = "";

  for (let i = 0; i < days; i += 1) {
    const wave = Math.sin(i * 0.37) + Math.cos(i * 0.13);
    let level = 0;

    if (activeSeeds.has(i) || wave > 1.17) level = 1;
    if (activeSeeds.has(i - 1) || wave > 1.42) level = 2;
    if (activeSeeds.has(i - 7) || wave > 1.62) level = 3;
    if (i % 53 === 0 || i === 103) level = 4;

    html += `<span class="day" data-level="${level}" title="Contribution activity level ${level}"></span>`;
  }

  heatmap.innerHTML = html;
}

function drawSignalCanvas() {
  const canvas = document.querySelector("#signal-canvas");
  const context = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let frame = 0;

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function draw() {
    context.clearRect(0, 0, width, height);
    context.strokeStyle = "rgba(216, 70, 50, 0.20)";
    context.lineWidth = 1;

    for (let i = 0; i < 10; i += 1) {
      const y = height * (0.16 + i * 0.075);
      context.beginPath();
      for (let x = 0; x < width; x += 18) {
        const drift = Math.sin((x * 0.012) + frame * 0.018 + i) * 8;
        const signal = y + drift;
        if (x === 0) context.moveTo(x, signal);
        context.lineTo(x, signal);
      }
      context.stroke();
    }

    frame += 1;
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  draw();
}

renderProjects();
renderPlatforms();
renderLogs();
renderHeatmap();
drawSignalCanvas();
