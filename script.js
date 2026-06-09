const data = window.siteData;

function renderStack(stack) {
  return stack.slice(0, 4).map((item) => `<span>${item}</span>`).join("");
}

function renderProjects() {
  const target = document.querySelector("#project-list");
  const label = document.querySelector("#project-count-label");
  const projects = [...data.projects].reverse();

  if (label) {
    label.textContent = `// ${projects.length} projects`;
  }

  target.innerHTML = projects.map((project) => {
    const title = project.link === "#"
      ? project.name
      : `<a class="project-link" href="${project.link}" target="_blank" rel="noreferrer">${project.name}</a>`;

    return `
      <article class="project-card">
        <a class="project-image" href="${project.link}" ${project.link === "#" ? "" : 'target="_blank" rel="noreferrer"'} aria-label="Open ${project.name}">
          <img src="${project.image}" alt="${project.name} screenshot placeholder">
        </a>
        <div class="project-body">
          <div class="project-meta">${project.type} / ${project.status}</div>
          <h3>${title}</h3>
          <p>${project.summary}</p>
          <div class="project-stack">${renderStack(project.stack)}</div>
        </div>
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

function renderHeatmap() {
  const heatmap = document.querySelector("#heatmap");
  const count = document.querySelector("#contribution-count");
  count.textContent = `${data.contributionCount} contributions`;

  const days = 7 * 34;
  const activeSeeds = new Set([8, 15, 23, 52, 89, 96, 97, 102, 106, 117, 138, 157, 192, 205, 209, 211, 224, 229]);
  let html = "";

  for (let i = 0; i < days; i += 1) {
    const wave = Math.sin(i * 0.37) + Math.cos(i * 0.13);
    let level = 0;
    if (activeSeeds.has(i) || wave > 1.17) level = 1;
    if (activeSeeds.has(i - 1) || wave > 1.42) level = 2;
    if (activeSeeds.has(i - 7) || wave > 1.62) level = 3;
    if (i % 53 === 0 || i === 103 || i === 222) level = 4;
    html += `<span class="day" data-level="${level}" title="Contribution activity level ${level}"></span>`;
  }

  heatmap.innerHTML = html;
}

function attachCursorGlow() {
  const glow = document.querySelector(".cursor-glow");
  window.addEventListener("pointermove", (event) => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  });
}

renderProjects();
renderPlatforms();
renderHeatmap();
attachCursorGlow();
