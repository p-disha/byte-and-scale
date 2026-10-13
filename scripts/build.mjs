import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = join(root, "content");
const pagesDir = join(root, "pages");

// The build must never render unvalidated content onto a page.
execFileSync(process.execPath, [join(root, "scripts", "validate-content.mjs")], {
  stdio: "inherit",
  cwd: root,
});

function loadContent(name) {
  return JSON.parse(readFileSync(join(contentDir, `${name}.json`), "utf8"));
}

const courses = loadContent("courses");
const instructors = loadContent("instructors");
const pricing = loadContent("pricing");
const testimonials = loadContent("testimonials");
const schedule = loadContent("schedule");

const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

const NAV = `
<nav class="nav">
  <div class="container">
    <a class="nav-brand" href="index.html">Byte &amp; <span>Scale</span></a>
    <div class="nav-links">
      <a href="python-track.html">Python</a>
      <a href="system-design-track.html">System Design</a>
      <a href="pricing.html">Pricing</a>
      <a href="about.html">Instructors</a>
      <a href="styleguide.html">Style Guide</a>
      <a class="btn btn-primary" href="contact.html">Book a session</a>
    </div>
  </div>
</nav>`;

const FOOTER = `
<footer class="footer">
  <div class="container row" style="justify-content:space-between;">
    <div>Byte &amp; Scale Tutoring</div>
    <div class="row">
      <a href="python-track.html">Python</a>
      <a href="system-design-track.html">System Design</a>
      <a href="contact.html">Contact</a>
    </div>
    <div class="text-muted">&copy; 2026 Byte &amp; Scale</div>
  </div>
</footer>`;

function renderCourseCard(course) {
  const prereq = course.prerequisites?.length
    ? `<p class="text-muted"><strong>Prerequisite:</strong> ${esc(course.prerequisites.join(", "))}</p>`
    : "";
  return `
<div class="card card-course">
  <div class="row" style="justify-content:space-between;">
    <span class="badge-level badge-level--${course.level}">${esc(course.level)}</span>
    <span class="text-muted">${course.duration_weeks} week${course.duration_weeks === 1 ? "" : "s"}</span>
  </div>
  <h3>${course.order}. ${esc(course.title)}</h3>
  <p class="text-muted">${esc(course.summary)}</p>
  <ul>${course.topics.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
  ${prereq}
</div>`;
}

function renderPricingCard(plan) {
  const unit = { "per-session": "/ session", "per-month": "/ month", "one-time": "one-time" }[plan.billing_unit];
  return `
<div class="card card-trust">
  ${plan.highlighted ? '<span class="badge-success">Most popular</span>' : ""}
  <h3>${esc(plan.name)}</h3>
  <p><span class="stat-number">$${plan.price_usd}</span> <span class="text-muted">${unit}</span></p>
  <p class="text-muted">${plan.sessions_included} session${plan.sessions_included === 1 ? "" : "s"} included</p>
  <ul>${plan.features.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>
  <a class="btn ${plan.highlighted ? "btn-indigo" : "btn-outline"}" href="contact.html">Choose ${esc(plan.name)}</a>
</div>`;
}

function renderTestimonialCard(t) {
  return `
<div class="card card-trust">
  <div class="badge-track badge-track--${t.track}">${t.track === "python" ? "Python" : "System Design"}</div>
  <p>&ldquo;${esc(t.quote)}&rdquo;</p>
  <p class="text-muted"><strong>${esc(t.student_name)}</strong> &middot; ${"★".repeat(t.rating)}${"☆".repeat(5 - t.rating)}</p>
</div>`;
}

function renderInstructorCard(p) {
  return `
<div class="card card-trust text-center">
  <div class="badge-level" style="width:48px;height:48px;line-height:34px;font-size:var(--text-lg);">${esc(p.initials)}</div>
  <h3>${esc(p.name)}</h3>
  <p class="text-muted">${esc(p.role)}</p>
  <p>${esc(p.bio)}</p>
  <ul style="text-align:left;">${p.credentials.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>
  <div class="row" style="justify-content:center;">
    ${p.specialties.map((s) => `<span class="badge-track badge-track--${s}">${s === "python" ? "Python" : "System Design"}</span>`).join("")}
  </div>
</div>`;
}

function renderScheduleRow(s) {
  return `
<div class="card card-trust row" style="justify-content:space-between;">
  <div>
    <span class="badge-track badge-track--${s.track}">${s.track === "python" ? "Python" : "System Design"}</span>
    <strong>${s.day} ${s.start_time}&ndash;${s.end_time}</strong>
    <span class="text-muted">(${s.format})</span>
  </div>
  <span class="badge-success">${s.seats_available} seat${s.seats_available === 1 ? "" : "s"} left</span>
</div>`;
}

function render(template) {
  return template
    .replace("<!--NAV-->", NAV)
    .replace("<!--FOOTER-->", FOOTER)
    .replace("<!--COURSES:python-->", courses.filter((c) => c.track === "python").sort((a, b) => a.order - b.order).map(renderCourseCard).join(""))
    .replace("<!--COURSES:system-design-->", courses.filter((c) => c.track === "system-design").sort((a, b) => a.order - b.order).map(renderCourseCard).join(""))
    .replace("<!--PRICING-->", pricing.map(renderPricingCard).join(""))
    .replace("<!--TESTIMONIALS-->", testimonials.map(renderTestimonialCard).join(""))
    .replace("<!--INSTRUCTORS-->", instructors.map(renderInstructorCard).join(""))
    .replace("<!--SCHEDULE-->", schedule.map(renderScheduleRow).join(""));
}

const templates = readdirSync(pagesDir).filter((f) => f.endsWith(".template.html"));
for (const file of templates) {
  const template = readFileSync(join(pagesDir, file), "utf8");
  const output = render(template);
  const outName = file.replace(".template.html", ".html");
  writeFileSync(join(root, outName), output);
  console.log(`built ${outName}`);
}
