//1.Находим элементы на странице
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');
const listItem = document.querySelector('.list-group-item');
const btnsDelete = document.querySelector('[data-action="delete"]');

let tasks = [];
if(localStorage.getItem('tasks')){
  tasks = JSON.parse(localStorage.getItem('tasks'))
}

tasks.forEach((task)=>{
  renderTask(task)
})

checkEmptyList();

//Функции
function addTask(event) {
  //3.Отменяем отправку формы
  event.preventDefault();
  //4. Достать текст из поля ввода
  const taskText = taskInput.value;

  //Описываем текст в виде задачи
  const newTasks = {
    id: Date.now(),
    text: taskText,
    done: false,
  };

  // Добавляем обьект в массив в виде задачи
  tasks.push(newTasks);

  saveToLocalStorage();

  renderTask(newTasks)

  //7. Очищаем поле ввода и возвращаем на него фокус
  taskInput.value = '';
  taskInput.focus();

  checkEmptyList();
}

function deleteTask(event) {
  //9.Проверяем что клик был по кнопке 'удалить задачу'
  if (event.target.dataset.action === 'delete') {
    //10. Находим родителя
    const parenNode = event.target.closest('.task-item');
    //определяем id задачи\
    const id = Number(parenNode.id);

    //11. Удаляем родителя из разметкиHTML
    parenNode.remove();

    //удаляем задачу через фильтрацию массивов
    tasks = tasks.filter((task) => task.id !== id);
  }
  saveToLocalStorage();
  checkEmptyList();
  // //12. Появление уведомления при пустом списке задач
  // if (tasksList.children.length == 1) {
  //   emptyList.classList.remove('none');
  // }
}

function doneTask(event) {
  if (event.target.dataset.action === 'done') {
    const parenNode = event.target.closest('.list-group-item');

    const id = Number(parenNode.id);

    const task = tasks.find((task) => {
      if (task.id === id) {
        return true;
      }
    });
    task.done = !task.done;
    saveToLocalStorage();

    const taskTitle = parenNode.querySelector('.task-title');
    taskTitle.classList.toggle('task-title--done');
  }
}

function checkEmptyList() {
  //8.Если в списке задач более одного элемента то мы его скрываем
  if (tasks.length === 0) {
    const emptyListHTML = `
    <li id="emptyList" class="list-group-item empty-list">
      <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3" />
      <div class="empty-list__title">Список дел пуст</div>
    </li>
    `;
    tasksList.insertAdjacentHTML('afterBegin', emptyListHTML);
  }

  if (tasks.length > 0) {
    const emptyListEl = document.querySelector('.empty-list');
    emptyListEl ? emptyListEl.remove() : null;
  }
}

function saveToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task){
  //Формируем css класс
  const cssClass = task.done ? 'task-title task-title--done' : 'task-title';

  //5.Формируем разметку для новой задачи
  let taskHTML = `
  <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
  <span class="${cssClass}">${task.text}</span>
  <div class="task-item__buttons">
  <button type="button" data-action="done" class="btn-action">
  <img src="./img/tick.svg" alt="Done" width="18" height="18">
  </button>
  <button type="button" data-action="delete" class="btn-action">
  <img src="./img/cross.svg" alt="Done" width="18" height="18">
  </button>
  </div>
  </li>
  `;

  //6.Добавить задачу на страницу
  tasksList.insertAdjacentHTML('beforeend', taskHTML);
}

//Отмечаем задачу завершенной
tasksList.addEventListener('click', doneTask);
//Добавление задачи
//2.Вешаем прослушку на форму
form.addEventListener('submit', addTask);
//Удаление задачи
tasksList.addEventListener('click', deleteTask);
