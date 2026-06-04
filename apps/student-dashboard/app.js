const student = {
  name: "Pap",
  level: "IGCSE Year 10",
  focus: {
    title: "Algebra: Quadratic Functions",
    course: "IGCSE Mathematics",
    time: "4:30 PM – 5:30 PM",
    teacher: "Mr. Ethan Lee",
    progress: 65
  },
  learningPath: [
    { title: "IGCSE Mathematics", progress: 67, status: "active" },
    { title: "IGCSE Physics", progress: 48, status: "in-progress" },
    { title: "IGCSE English", progress: 33, status: "in-progress" },
    { title: "CAT4 Prep", progress: 0, status: "locked" }
  ],
  tasks: [
    {
      title: "Homework: Forces Worksheet",
      course: "IGCSE Physics",
      due: "Due tomorrow"
    },
    {
      title: "Essay Draft: Discursive Writing",
      course: "IGCSE English",
      due: "Due Sun, May 25"
    }
  ],
  teacherInsight: {
    teacher: "Mr. Ethan Lee",
    role: "Mathematics Teacher",
    message:
      "You’re showing strong analytical thinking, especially in algebra and problem solving. Keep practicing exam-style questions to build even more confidence."
  }
};

const icons = {
  home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 10 9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></svg>',
  path: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19c5-12 11 2 16-10"/><circle cx="4" cy="19" r="2"/><circle cx="20" cy="9" r="2"/></svg>',
  tasks: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
  progress: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-7"/></svg>',
  notes: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v16H4z"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>',
  search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m16 16 4 4"/></svg>',
  bell: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></svg>',
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7z"/></svg>',
  lock: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
  book: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z"/></svg>',
  message: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/></svg>'
};

function Sidebar() {
  const items = [
    ["Home", "home", true],
    ["Path", "path", false],
    ["Tasks", "tasks", false],
    ["Progress", "progress", false],
    ["Notes", "notes", false]
  ];

  return `
    <aside class="sidebar glass-panel" aria-label="Primary navigation">
      <div class="brand" aria-label="KEAES Tutorial School">
        <div class="brand-mark">K</div>
        <div class="brand-copy">
          <strong>KEAES</strong>
          <span>Tutorial</span>
        </div>
      </div>
      <nav class="nav-list">
        ${items.map(([label, icon, active]) => `
          <button class="nav-item ${active ? "active" : ""}" aria-label="${label}" ${active ? 'aria-current="page"' : ""}>
            ${icons[icon]}
            <span>${label}</span>
          </button>
        `).join("")}
      </nav>
      <div class="streak" aria-label="Study streak">
        <span>Study streak</span>
        <strong>8 days</strong>
      </div>
    </aside>
  `;
}

function TopBar(data) {
  return `
    <header class="topbar glass-panel">
      <label class="search" aria-label="Search">
        ${icons.search}
        <input type="search" placeholder="Search anything…" aria-label="Search anything">
      </label>
      <div class="top-meta">
        <div class="date-block">
          <span>Friday</span>
          <strong>May 23, 2025</strong>
        </div>
        <span class="status-pill">Focused</span>
        <button class="icon-button" aria-label="Notifications">${icons.bell}</button>
        <div class="profile" aria-label="Student profile">
          <div class="avatar">P</div>
          <div>
            <strong>${data.name}</strong>
            <span>${data.level}</span>
          </div>
        </div>
      </div>
    </header>
  `;
}

function HologramOrb() {
  return `
    <div class="orb-stage" aria-label="Holographic quadratic learning visual">
      <div class="orb">
        <div class="ring ring-one"></div>
        <div class="ring ring-two"></div>
        <div class="ring ring-three"></div>
        <svg class="curve" viewBox="0 0 160 160" aria-hidden="true">
          <path class="axis" d="M30 120H132M50 136V30"/>
          <path class="grid" d="M72 35v97M94 35v97M116 35v97M32 98h102M32 76h102M32 54h102"/>
          <path class="quad" d="M36 116 C58 116 66 48 82 48 C99 48 106 116 130 116"/>
          <circle cx="82" cy="48" r="4"/>
        </svg>
      </div>
    </div>
  `;
}

function FocusHero(data) {
  return `
    <section class="focus-hero glass-panel reveal">
      <div class="focus-copy">
        <p class="greeting">Good morning, ${data.name} <span aria-hidden="true">👋</span></p>
        <h1>Today’s Focus</h1>
        <span class="eyebrow">Next Session</span>
        <h2>${data.focus.title}</h2>
        <div class="lesson-meta">
          <span>${data.focus.course}</span>
          <span>${data.focus.time}</span>
          <span>${data.focus.teacher}</span>
        </div>
        <button class="primary-button">${icons.play}<span>Resume</span></button>
      </div>
      ${HologramOrb()}
    </section>
  `;
}

function LearningPath(items) {
  return `
    <section class="learning-path glass-panel reveal" aria-labelledby="learning-path-title">
      <div class="section-head">
        <h2 id="learning-path-title">Learning Path</h2>
        <span>Journey map</span>
      </div>
      <div class="timeline" role="list">
        ${items.map((item, index) => {
          const locked = item.status === "locked";
          return `
            <article class="timeline-item ${item.status}" role="listitem">
              <div class="node" aria-label="${locked ? "Locked" : `${item.progress}% complete`}">
                ${locked ? icons.lock : `<span>${index + 1}</span>`}
              </div>
              <div class="timeline-copy">
                <strong>${item.title}</strong>
                <span>${locked ? "Locked" : `${item.progress}% Complete`}</span>
              </div>
            </article>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function PriorityTasks(tasks) {
  return `
    <section class="compact-panel glass-panel reveal" aria-labelledby="tasks-title">
      <div class="section-head">
        <h2 id="tasks-title">Priority Tasks</h2>
      </div>
      <div class="task-list">
        ${tasks.map(task => `
          <article class="task-row">
            <div class="task-icon">${icons.book}</div>
            <div class="task-copy">
              <strong>${task.title}</strong>
              <span>${task.course}</span>
            </div>
            <span class="due">${task.due}</span>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function TeacherInsight(insight) {
  return `
    <section class="compact-panel insight glass-panel reveal" aria-labelledby="insight-title">
      <div class="soft-orb" aria-hidden="true"></div>
      <div class="section-head">
        <h2 id="insight-title">Teacher Insight</h2>
      </div>
      <blockquote>
        <span class="quote-mark" aria-hidden="true">“</span>
        <p>${insight.message}</p>
      </blockquote>
      <div class="teacher-row">
        <div>
          <strong>${insight.teacher}</strong>
          <span>${insight.role}</span>
        </div>
        <button class="secondary-button">${icons.message}<span>Message</span></button>
      </div>
    </section>
  `;
}

function StudentDashboard(data) {
  return `
    <div class="app-shell">
      ${Sidebar()}
      <main class="main-area">
        ${TopBar(data)}
        ${FocusHero(data)}
        ${LearningPath(data.learningPath)}
        <div class="bottom-grid">
          ${PriorityTasks(data.tasks)}
          ${TeacherInsight(data.teacherInsight)}
        </div>
      </main>
    </div>
  `;
}

document.getElementById("app").innerHTML = StudentDashboard(student);
