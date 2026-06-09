const data = window.siteData;

function getOrderedProjects() {
  return [...data.projects].reverse();
}

function projectAbbreviation(project) {
  return project.name
    .split(/[\s.-]+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((word) => word[0])
    .join("");
}

function statusClass(project) {
  return project.status.toLowerCase().includes("public") ? "public" : "";
}

function renderStack(stack) {
  return stack.slice(0, 5).map((item) => `<span>${item}</span>`).join("");
}

function renderProjects() {
  const target = document.querySelector("#project-list");
  const label = document.querySelector("#project-count-label");
  const projects = getOrderedProjects();
  const [featured, ...rows] = projects;

  if (label) {
    label.textContent = `// ${projects.length} systems`;
  }

  const title = featured.link === "#"
    ? featured.name
    : `<a class="project-link" href="${featured.link}" target="_blank" rel="noreferrer">${featured.name}</a>`;

  target.innerHTML = `
    <article class="project-featured">
      <div class="project-visual" aria-hidden="true">
        <strong>${projectAbbreviation(featured)}</strong>
      </div>
      <div class="project-body">
        <div class="project-meta">01 / ${featured.type} · ${featured.status}</div>
        <h3>${title}</h3>
        <p>${featured.summary}</p>
        <div class="project-stack">${renderStack(featured.stack)}</div>
        <div class="project-footer">
          <span><i class="status-dot ${statusClass(featured)}"></i>${featured.status}</span>
          ${featured.link === "#" ? "" : `<a class="project-link" href="${featured.link}" target="_blank" rel="noreferrer">View -></a>`}
        </div>
      </div>
    </article>
    ${rows.map((project, index) => {
      const number = String(index + 2).padStart(2, "0");
      const rowTitle = project.link === "#"
        ? project.name
        : `<a class="project-link" href="${project.link}" target="_blank" rel="noreferrer">${project.name}</a>`;

      return `
        <article class="project-row" tabindex="0" role="button" aria-expanded="false">
          <div class="project-number">${number}</div>
          <div class="project-row-main">
            <h3>${rowTitle}</h3>
            <span>${project.type} / ${project.status}</span>
          </div>
          <i class="status-dot ${statusClass(project)}"></i>
          <div class="project-chevron">v</div>
          <div class="project-detail">
            <p>${project.summary}</p>
            <div class="project-stack">${renderStack(project.stack)}</div>
          </div>
        </article>
      `;
    }).join("")}
  `;

  target.querySelectorAll(".project-row").forEach((row) => {
    const toggle = () => {
      const expanded = row.classList.toggle("expanded");
      row.setAttribute("aria-expanded", String(expanded));
    };

    row.addEventListener("click", (event) => {
      if (event.target.closest("a")) return;
      toggle();
    });

    row.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggle();
      }
    });
  });
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
