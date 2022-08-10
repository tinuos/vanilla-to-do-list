// 데이터 저장용
let todoList = [];

// 요소 특정
const todoFormEl = document.querySelector('form.todo-form');
const formInputEl = todoFormEl.querySelector('input');
const submitBtnEl = todoFormEl.querySelector('button');
const todoListEl = document.querySelector('ul.todo-list');

// 첫 페이지 로드 시 데이터 불러오기
function getTodos() {
  todoList = JSON.parse(localStorage.getItem('todos'));

  if (todoList !== null) {
    todoList.forEach(todo => renderTodo(todo));
  }
}

// 데이터 저장
function saveTodos(todoList) {
  localStorage.setItem('todos', JSON.stringify(todoList));
}

// 할 일 데이터 추가 및 저장
function createTodo() {
  const inputText = formInputEl.value;
  const todo = {};

  if (inputText !== '') {
    todo.id = new Date().getTime();
    todo.title = inputText;
    todo.completed = false;
  }
  formInputEl.value = '';

  // getTodos 동작에 따라 null이 부여될 수 있어 다시 빈배열을 할당
  if (todoList === null) {
    todoList = []; 
  }
  todoList.push(todo);
  
  // 화면에 보여주기
  renderTodo(todo);

  // 데이터 저장하기
  saveTodos(todoList);
}

// 할 일 데이터 완료 체크
function checkCompleted(event) {
  const liEl = event.target.parentElement.parentElement;

  liEl.classList.toggle('completed'); // 스타일 제어
  
  todoList.forEach((todo) => {
    if (todo.id.toString() === liEl.id) {
      todo.completed = (todo.completed ? false : true);
    }
  })

  saveTodos(todoList);
}

// 할 일 데이터 삭제
function deleteTodo(event) {
  const liEl = event.target.parentElement.parentElement;
  liEl.remove();

  const newTodoList = todoList.filter((todo) => {
    return (todo.id.toString() !== liEl.id);
  })
  
  todoList = newTodoList;

  saveTodos(todoList);
}

// 제출 버튼 감지
function checkSubmit(event) {
  event.preventDefault();

  createTodo();  
}

// 할 일 요소 렌더링
function renderTodo(todo) {
    const li = document.createElement('li');
    const template = `
      <p>${todo.title}</p>
      <div>
        <i>✅</i>
        <i>❌</i>
      </div>
    `
    li.innerHTML = template;
    li.classList.add('todo-item');
    li.id = todo.id;

    const checkIcon = li.querySelector('.todo-item i:first-child');
    const deleteIcon = li.querySelector('.todo-item i:last-child');
    
    if (todo.completed) {
      li.classList.add('completed');
    }

    checkIcon.addEventListener('click', checkCompleted);
    deleteIcon.addEventListener('click', deleteTodo);

    todoListEl.appendChild(li);
}


function init() {
  getTodos();
  submitBtnEl.addEventListener('click', checkSubmit);
}

init();