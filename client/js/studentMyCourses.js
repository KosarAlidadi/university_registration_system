const tbody = document.getElementById("myCoursesTbody");
const emptyState = document.getElementById("emptyState");

const STORAGE_KEY = "student_my_courses";

/* =======================
   SEED DEFAULT COURSES
======================= */

const DEFAULT_COURSES = [
  {
    id: 1,
    title: "Database Systems",
    code: "CS301",
    units: 3,
    time: "Mon 10-12",
    location: "Room 204"
  },
  {
    id: 2,
    title: "Operating Systems",
    code: "CS302",
    units: 4,
    time: "Wed 14-16",
    location: "Room 105"
  },
  {
    id: 3,
    title: "Computer Networks",
    code: "CS303",
    units: 3,
    time: "Tue 8-10",
    location: "Room 110"
  }
];

// Seed only once
if (!localStorage.getItem(STORAGE_KEY)) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_COURSES));
}

/* =======================
   MOCK API (LOCAL)
======================= */

function apiGetMyCourses() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(JSON.parse(localStorage.getItem(STORAGE_KEY)));
    }, 300);
  });
}

function apiRemoveMyCourse(courseId) {
  return new Promise(resolve => {
    setTimeout(() => {
      let courses = JSON.parse(localStorage.getItem(STORAGE_KEY));
      courses = courses.filter(c => c.id !== courseId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
      resolve({ success: true });
    }, 300);
  });
}

/* =======================
   UI LOGIC
======================= */

let myCourses = [];

async function loadMyCourses() {
  myCourses = await apiGetMyCourses();
  renderMyCourses();
}

function renderMyCourses() {
  tbody.innerHTML = "";

  if (!myCourses.length) {
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";

  myCourses.forEach(c => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${c.title}</td>
      <td>${c.code}</td>
      <td>${c.units}</td>
      <td>${c.time}</td>
      <td>${c.location}</td>
      <td class="actions-cell">
        <button
          class="action-btn btn-delete drop-course-btn"
          data-id="${c.id}">
          Remove
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".drop-course-btn");
  if (!btn) return;

  const courseId = Number(btn.dataset.id);

  if (!confirm("Are you sure you want to remove this course?")) return;

  await apiRemoveMyCourse(courseId);
  await loadMyCourses();
});

/* =======================
   INIT
======================= */

loadMyCourses();
