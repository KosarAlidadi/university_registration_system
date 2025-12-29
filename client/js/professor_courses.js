document.addEventListener("DOMContentLoaded", function () {
  const coursesTbody = document.getElementById("coursesTbody");
  const studentsTbody = document.getElementById("studentsTbody");
  const studentsSection = document.getElementById("studentsSection");

  const STORAGE_KEY = "professor_courses";

  /* =======================
     SEED DATA (Default Courses + Students)
  ======================== */
  const DEFAULT_DATA = [
    {
      id: 1,
      title: "Database Systems",
      code: "CS301",
      units: 3,
      students: [
        { id: 11, first_name: "Ali", last_name: "Ahmadi", student_id: "401001" },
        { id: 12, first_name: "Sara", last_name: "Hosseini", student_id: "401002" },
        { id: 13, first_name: "Reza", last_name: "Karimi", student_id: "401003" }
      ]
    },
    {
      id: 2,
      title: "Operating Systems",
      code: "CS302",
      units: 4,
      students: [
        { id: 14, first_name: "Mina", last_name: "Abbasi", student_id: "401004" },
        { id: 15, first_name: "Hamed", last_name: "Zarei", student_id: "401005" },
        { id: 16, first_name: "Neda", last_name: "Shahri", student_id: "401006" }
      ]
    },
    {
      id: 3,
      title: "Computer Networks",
      code: "CS303",
      units: 3,
      students: [
        { id: 17, first_name: "Sina", last_name: "Mohammadi", student_id: "401007" },
        { id: 18, first_name: "Laleh", last_name: "Rahimi", student_id: "401008" }
      ]
    }
  ];

  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DATA));
  }

  /* =======================
     MOCK API
  ======================== */
  function apiGetProfessorCourses() {
    return Promise.resolve(JSON.parse(localStorage.getItem(STORAGE_KEY)));
  }

  function apiRemoveStudent(courseId, studentId) {
    const courses = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const course = courses.find(c => c.id === courseId);
    if (!course) return Promise.resolve({ success: false });
    course.students = course.students.filter(s => s.id !== studentId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
    return Promise.resolve({ success: true });
  }

  /* =======================
     UI LOGIC
  ======================== */
  let courses = [];
  let activeCourseId = null;

  async function loadCourses() {
    courses = await apiGetProfessorCourses();
    renderCourses();
  }

  function renderCourses() {
    coursesTbody.innerHTML = "";
    courses.forEach(c => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${c.title}</td>
        <td>${c.code}</td>
        <td>${c.units}</td>
        <td class="actions-cell">
          <button class="action-btn" data-course="${c.id}">View Students</button>
        </td>
      `;
      coursesTbody.appendChild(tr);
    });
  }

  function renderStudents(courseId) {
    activeCourseId = courseId;
    studentsSection.style.display = "block";
    studentsTbody.innerHTML = "";

    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    const sortedStudents = [...course.students].sort((a, b) =>
      a.last_name.localeCompare(b.last_name)
    );

    sortedStudents.forEach(s => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${s.first_name}</td>
        <td>${s.last_name}</td>
        <td>${s.student_id}</td>
        <td class="actions-cell">
          <button class="action-btn btn-delete remove-student-btn" data-student="${s.id}">
            Remove
          </button>
        </td>
      `;
      studentsTbody.appendChild(tr);
    });
  }

  /* =======================
     EVENTS
  ======================== */
  document.addEventListener("click", async (e) => {
    const viewBtn = e.target.closest("[data-course]");
    if (viewBtn) {
      renderStudents(Number(viewBtn.dataset.course));
    }

    const removeBtn = e.target.closest(".remove-student-btn");
    if (removeBtn) {
      const studentId = Number(removeBtn.dataset.student);
      if (!confirm("Remove this student from the course?")) return;

      await apiRemoveStudent(activeCourseId, studentId);
      courses = await apiGetProfessorCourses();
      renderStudents(activeCourseId);
    }
  });

  /* =======================
     INIT
  ======================== */
  loadCourses();
});
