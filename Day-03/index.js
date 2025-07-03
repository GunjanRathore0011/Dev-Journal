const ToDoContainer = document.querySelector('.To-Do-container');
const addTodo = document.querySelector('#add-todo');
const taskValue = document.querySelector('.task-value');

function createTodoElement(todo) {
    const Todo = document.createElement('div');
    Todo.setAttribute('class', 'glow-todo todo-item');

    Todo.innerHTML = `
    <input type="checkbox" class="check-checkbox check-box">
    <p class="text-field text-box">${todo.task}</p>
    <i class="fa-solid fa-trash trash-icon"></i>
  `;

    Todo.classList.add('todo-item')

    const textField = Todo.querySelector('.text-field');
    textField.classList.add('text-box')

    const trashIcon = Todo.querySelector('.trash-icon');
    trashIcon.addEventListener('click', () => {
        deleteTodoTask(todo.task);
    });
    trashIcon.classList.add('trash-icon');

    const checkBox = Todo.querySelector('.check-checkbox');
    checkBox.classList.add('check-box');

    checkBox.checked = todo.completed;

    checkBox.addEventListener('click', () => {
        updateTodoStatus(todo.task, checkBox.checked);
    });
    ToDoContainer.appendChild(Todo);
}
function updateTodoStatus(task, isCompleted) {
    let preTodos = JSON.parse(localStorage.getItem('todos')) || [];
    
    preTodos.forEach((todo) => {
        if (todo.task == task) todo.completed = isCompleted;
    })
    localStorage.setItem('todos', JSON.stringify(preTodos))
}

function renderTodos() {
    ToDoContainer.innerHTML = "";
    const preTodos = JSON.parse(localStorage.getItem('todos')) || [];

    if(preTodos.length==0){
        const noTask=document.createElement('div');
        noTask.innerHTML = `Yay! Koi kaam pending nahi hai ✨`;
        noTask.classList.add('no-task');
        ToDoContainer.appendChild(noTask)
    }

    preTodos.forEach(todo => {
        createTodoElement(todo);
    });
}

function addItems() {
    const taskText = taskValue.value.trim();

    if (taskText === "") {
        alert("Please enter a task.");
        return;
    }
    const newTodo = { task: taskText, completed: false }
    const preTodos = JSON.parse(localStorage.getItem('todos')) || [];
    preTodos.push(newTodo);
    localStorage.setItem('todos', JSON.stringify(preTodos));

    renderTodos();
    taskValue.value = "";
}

function deleteTodoTask(task) {
    let preTodos = JSON.parse(localStorage.getItem('todos')) || [];
    preTodos = preTodos.filter(todo => todo.task !== task);
    localStorage.setItem('todos', JSON.stringify(preTodos));
    renderTodos();
}

addTodo.addEventListener('click', addItems);
renderTodos();

function filterTodos(filterType) {
    const todos = document.querySelectorAll('.todo-item');

    todos.forEach(todo => {
        const checkbox = todo.querySelector('input[type="checkbox"]');

        if (filterType === 'completed' && checkbox.checked) {
            todo.style.display = 'flex';
        } else if (filterType === 'pending' && !checkbox.checked) {
            todo.style.display = 'flex';
        } else if (filterType === 'all') {
            todo.style.display = 'flex';
        } else {
            todo.style.display = 'none';
        }
    });
}
filter = document.querySelector('.filters')

filter.addEventListener('click', (event) => {
    if (!event.target.classList.contains('filter-btn')) return;

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    const filterType = event.target.getAttribute('data-filter');
    filterTodos(filterType);
});
 

const micBtn = document.querySelector('.mic-icon'); // give your mic icon a class
const taskInput = document.querySelector('.task-value');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US'; // or 'hi-IN' if you want Hindi
    recognition.interimResults = false;

    micBtn.addEventListener('click', () => {
        taskInput.value = "Listening..."; 
        recognition.start();
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        taskInput.value = transcript;
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error", event);
    };
} else {
    console.warn("Speech Recognition not supported in this browser.");
}
