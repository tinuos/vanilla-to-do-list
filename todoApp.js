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
function createTodo(todo) {
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

// 할 일 수정용 데이터 객체 생성 함수
function createUpdateObject(event) {
  const liEl = event.target.parentElement;
  const pEl = liEl.querySelector('p');
  const inputEl = liEl.querySelector('input');
  const controlBoxEls = liEl.querySelector('.control-box');
  const otherLiEls = [].slice.call(todoListEl.querySelectorAll('.todo-item'));

  return { liEl, pEl, inputEl, controlBoxEls, otherLiEls };
}

// 수정 기능에서 벗어날 때 기본 뷰 형태 처리 함수
function backToBasicView({liEl, pEl, inputEl, controlBoxEls, otherLiEls}) {
  inputEl.type = 'hidden';
  pEl.style.display = 'block';

  formInputEl.disabled = false;
  submitBtnEl.disabled = false;
  controlBoxEls.classList.toggle('updating');

  otherLiEls.forEach(li => {
    if (li.id !== liEl.id) {
      li.classList.toggle('updating');
    }
  });

}

// 할 일 내용 수정 관련 이벤트 처리
function checkUpdateEvent(event) {
  const dataForUpdate = createUpdateObject(event);
  const { liEl, pEl, inputEl } = dataForUpdate;

  // 1. 입력 양식이 빈 문자열이 아니면서 엔터키가 입력되었을 때
  // - 수정 기능 처리
  if (inputEl.value !== '' && event.key === 'Enter') {
    todoList = todoList.map(todo => {
      if (todo.id.toString() === liEl.id) {
        todo.title = inputEl.value;
      }
      return todo;
    })
    
    saveTodos(todoList);
    backToBasicView(dataForUpdate);
    pEl.textContent = inputEl.value;
    // 2. 입력 양식이 빈 문자열이면서 포커스 아웃되었을 때
    // - 기존 뷰 형태로 돌아가기
  } else if (inputEl.value === '' && event.type === 'focusout') {
    backToBasicView(dataForUpdate);
  }
}

// 할 일 내용 수정
function updateTodo(event) {
  const {
    liEl,
    pEl,
    inputEl,
    controlBoxEls,
    otherLiEls
  } = createUpdateObject(event);
 
  if(!liEl.classList.contains('completed')) {
    pEl.style.display = 'none';
    inputEl.type = 'text';
    inputEl.focus();
    inputEl.value = pEl.textContent;
    inputEl.placeholder = pEl.textContent;
      
    inputEl.addEventListener('focusout', checkUpdateEvent);
    inputEl.addEventListener('keydown', checkUpdateEvent);

    formInputEl.disabled = true;
    submitBtnEl.disabled = true;
    controlBoxEls.classList.toggle('updating');

    otherLiEls.forEach(li => {
      if (li.id !== liEl.id) {
        li.classList.toggle('updating');
      }
    });
  }  
}

// 제출 버튼 감지
function checkSubmit(event) {
  event.preventDefault();

  const inputText = formInputEl.value;
  const todo = {};
  
  if (inputText !== '') {
    todo.id = new Date().getTime();
    todo.title = inputText;
    todo.completed = false;
    createTodo(todo);  
  }

  formInputEl.value = '';
}

// 할 일 요소 렌더링
function renderTodo(todo) {
    const li = document.createElement('li');
    const template = `
      <p>${todo.title}</p>
      <input type="hidden"/>
      <div class="control-box">
        <i class="fa-solid fa-check fa-xl"></i>
        <i class="fa-solid fa-trash-can fa-xl"></i>
      </div>
    `
    li.innerHTML = template;
    li.classList.add('todo-item');
    li.id = todo.id;

    const todoContent = li.querySelector('p');
    const checkBtnIcon = li.querySelector('.todo-item > .control-box i:first-child');
    const deletBtnIcon = li.querySelector('.todo-item > .control-box i:last-child');
    
    if (todo.completed) {
      li.classList.add('completed');
    }

    todoContent.addEventListener('dblclick', updateTodo);
    checkBtnIcon.addEventListener('click', checkCompleted);
    deletBtnIcon.addEventListener('click', deleteTodo);

    todoListEl.appendChild(li);
}


function init() {
  getTodos();
  submitBtnEl.addEventListener('click', checkSubmit);
}

init();