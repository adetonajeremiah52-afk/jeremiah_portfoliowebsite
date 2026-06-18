// --- Global State Variables ---
let currentUserEmail = "";
let userTasks = []; 
let selectedTaskId = null;

// --- DOM Elements ---
const globalNavbar = document.getElementById('globalNavbar');
const landingSection = document.getElementById('landingSection');
const authContainer = document.getElementById('authContainer');
const dashboardContainer = document.getElementById('dashboardContainer');

const loginBox = document.getElementById('loginBox');
const signupBox = document.getElementById('signupBox');

// Navigation Triggers
const brandLogo = document.getElementById('brandLogo');
const navHomeLink = document.getElementById('navHomeLink');
const navLoginBtn = document.getElementById('navLoginBtn');
const navRegisterBtn = document.getElementById('navRegisterBtn');

const landingGetStartedBtn = document.getElementById('landingGetStartedBtn');
const landingLoginBtn = document.getElementById('landingLoginBtn');
const backToHomeBtn = document.getElementById('backToHomeBtn');

const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

const userGreeting = document.getElementById('userGreeting');
const timeGreeting = document.getElementById('timeGreeting');
const todoInput = document.getElementById('todoInput');
const addTodoBtn = document.getElementById('addTodoBtn');
const todoList = document.getElementById('todoList');

// 🌟 NEW: Search Input DOM Reference
const taskSearchInput = document.getElementById('taskSearchInput');

const notesSection = document.getElementById('notesSection');
const activeTaskTitle = document.getElementById('activeTaskTitle');
const notesTextarea = document.getElementById('notesTextarea');
const saveNotesBtn = document.getElementById('saveNotesBtn');

// --- Navigation Routing Logic ---
function showSignupView() {
    landingSection.classList.add('hidden');
    dashboardContainer.classList.add('hidden');
    authContainer.classList.remove('hidden');
    loginBox.classList.add('hidden');
    signupBox.classList.remove('hidden');
    globalNavbar.classList.remove('hidden');
}

function showLoginView() {
    landingSection.classList.add('hidden');
    dashboardContainer.classList.add('hidden');
    authContainer.classList.remove('hidden');
    signupBox.classList.add('hidden');
    loginBox.classList.remove('hidden');
    globalNavbar.classList.remove('hidden');
}

function showHomeView() {
    authContainer.classList.add('hidden');
    dashboardContainer.classList.add('hidden');
    landingSection.classList.remove('hidden');
    globalNavbar.classList.remove('hidden');
}

landingGetStartedBtn.addEventListener('click', showSignupView);
navRegisterBtn.addEventListener('click', showSignupView);
landingLoginBtn.addEventListener('click', showLoginView);
navLoginBtn.addEventListener('click', showLoginView);
backToHomeBtn.addEventListener('click', showHomeView);
brandLogo.addEventListener('click', showHomeView);
navHomeLink.addEventListener('click', (e) => { e.preventDefault(); showHomeView(); });

document.getElementById('navFeaturesLink').addEventListener('click', (e) => {
    e.preventDefault();
    alert("Features: Sync profiles securely, record persistent tracking documents, and search entries instantly!");
});

// --- Auth Views Toggling ---
document.getElementById('toSignup').addEventListener('click', (e) => { e.preventDefault(); loginBox.classList.add('hidden'); signupBox.classList.remove('hidden'); });
document.getElementById('toLogin').addEventListener('click', (e) => { e.preventDefault(); signupBox.classList.add('hidden'); loginBox.classList.remove('hidden'); });

// --- Password Visibility Toggle ---
document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', function () {
        const input = this.previousElementSibling;
        if (input.type === "password") {
            input.type = "text";
            this.textContent = "🙈";
        } else {
            input.type = "password";
            this.textContent = "👁️";
        }
    });
});

function updateTimeGreeting() {
    const hours = new Date().getHours();
    if (hours < 12) timeGreeting.textContent = "Good morning";
    else if (hours < 18) timeGreeting.textContent = "Good afternoon";
    else timeGreeting.textContent = "Good evening";
}

// --- Registration Logic ---
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;

    if (password.length < 6) return alert('Password must be at least 6 characters long.');
    if (localStorage.getItem(`user_${email}`)) return alert('Account email already registered.');

    localStorage.setItem(`user_${email}`, JSON.stringify({ name, email, password }));
    localStorage.setItem(`tasks_${email}`, JSON.stringify([]));

    alert('Registration successful! Please sign in.');
    signupForm.reset();
    signupBox.classList.add('hidden');
    loginBox.classList.remove('hidden');
});

// --- Login Logic ---
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    const savedProfile = localStorage.getItem(`user_${email}`);
    if (!savedProfile) return alert('Account not found.');

    const profile = JSON.parse(savedProfile);
    if (profile.password !== password) return alert('Incorrect credentials.');

    currentUserEmail = email;
    userGreeting.textContent = profile.name;
    updateTimeGreeting();

    userTasks = JSON.parse(localStorage.getItem(`tasks_${email}`)) || [];
    taskSearchInput.value = ""; // Clear out search field values upon new user sessions
    renderTasks();

    authContainer.classList.add('hidden');
    globalNavbar.classList.add('hidden'); 
    dashboardContainer.classList.remove('hidden');
    loginForm.reset();
});

// --- Logout Logic ---
document.getElementById('logoutBtn').addEventListener('click', () => {
    currentUserEmail = "";
    userTasks = [];
    selectedTaskId = null;
    closeNotesWorkspace();
    showHomeView();
});

// --- Task Manager App Core Logic ---
function saveToLocalStorage() {
    if (currentUserEmail) {
        localStorage.setItem(`tasks_${currentUserEmail}`, JSON.stringify(userTasks));
    }
}

addTodoBtn.addEventListener('click', createNewTask);
todoInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') createNewTask(); });

function createNewTask() {
    const text = todoInput.value.trim();
    if (!text) return;

    userTasks.push({ id: Date.now().toString(), text, completed: false, note: "" });
    saveToLocalStorage();
    
    // Clear out active filters when adding a new project so they see it instantly
    taskSearchInput.value = ""; 
    renderTasks();
    todoInput.value = '';
}

// 🌟 NEW: Live Query Filter Listener
taskSearchInput.addEventListener('input', renderTasks);

function renderTasks() {
    todoList.innerHTML = '';
    
    // 🌟 Read search parameter text query safely in lowercase
    const searchQuery = taskSearchInput.value.toLowerCase().trim();

    userTasks.forEach(task => {
        // 🌟 Search Check logic: Skip entry if it doesn't match the search keywords
        if (searchQuery !== "" && !task.text.toLowerCase().includes(searchQuery)) {
            return; 
        }

        const li = document.createElement('li');
        if (selectedTaskId === task.id) li.classList.add('active-task');

        li.innerHTML = `
            <div class="task-left-block">
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
                <input type="text" class="edit-input hidden" value="${task.text}" style="flex: 1; padding: 4px; border: 1px solid var(--border-color); border-radius: 4px;">
            </div>
            <div class="task-actions" style="display: flex; gap: 8px;">
                <button class="edit-task-btn" style="color: var(--primary-color); background:none; border:none; cursor:pointer; font-weight:600;">Edit</button>
                <button class="delete-task-btn" style="color: var(--danger-color); background:none; border:none; cursor:pointer; font-weight:600;">Delete</button>
            </div>
        `;

        const checkbox = li.querySelector('.task-checkbox');
        const taskSpan = li.querySelector('.task-text');
        const editInput = li.querySelector('.edit-input');
        const editBtn = li.querySelector('.edit-task-btn');
        const deleteBtn = li.querySelector('.delete-task-btn');

        checkbox.addEventListener('click', (e) => {
            e.stopPropagation();
            task.completed = checkbox.checked;
            taskSpan.classList.toggle('completed', task.completed);
            saveToLocalStorage();
        });

        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (li.classList.contains('editing')) {
                const val = editInput.value.trim();
                if (val) {
                    task.text = val;
                    taskSpan.textContent = val;
                    editBtn.textContent = 'Edit';
                    taskSpan.classList.remove('hidden');
                    editInput.classList.add('hidden');
                    li.classList.remove('editing');
                    saveToLocalStorage();
                    if (selectedTaskId === task.id) activeTaskTitle.textContent = `Working on: "${val}"`;
                }
            } else {
                editInput.value = taskSpan.textContent;
                editBtn.textContent = 'Save';
                taskSpan.classList.add('hidden');
                editInput.classList.remove('hidden');
                li.classList.add('editing');
                editInput.focus();
            }
        });
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm(`Are you sure you want to delete "${task.text}"?`)) {
                userTasks = userTasks.filter(t => t.id !== task.id);
                if (selectedTaskId === task.id) closeNotesWorkspace();
                saveToLocalStorage();
                renderTasks();
            }
        });
        li.addEventListener('click', () => {
            if (li.classList.contains('editing')) return;
            openNotesWorkspace(task);
        });
        todoList.appendChild(li);
    });
}function openNotesWorkspace(task) {
    selectedTaskId = task.id;
    document.querySelectorAll('#todoList li').forEach(li => li.classList.remove('active-task'));
    renderTasks();
    notesSection.classList.remove('section-disabled');
    activeTaskTitle.textContent = `Working on: "${task.text}"`;
    notesTextarea.value = task.note;
    notesTextarea.removeAttribute('disabled');
    saveNotesBtn.removeAttribute('disabled');
    notesTextarea.focus();
}function closeNotesWorkspace() {
    selectedTaskId = null;
    activeTaskTitle.textContent = "No task selected";
    notesTextarea.value = "";
    notesTextarea.setAttribute('disabled', true);
    saveNotesBtn.setAttribute('disabled', true);
    notesSection.classList.add('section-disabled');
}saveNotesBtn.addEventListener('click', () => {
    if (!selectedTaskId) return;
    const targetTask = userTasks.find(t => t.id === selectedTaskId);
    if (targetTask) {
        targetTask.note = notesTextarea.value;
        saveToLocalStorage();
        alert(`Progress notes for "${targetTask.text}" saved!`);
    }
});