//Находим элементы на странице
const form = document.querySelector("#form"); // через рещетку ищем по id

//console.log(form);
const taskInput = document.querySelector("#taskInput"); // через рещетку ищем по id

//console.log(taskInput);
const tasksList = document.querySelector("#tasksList");

const emptyList = document.querySelector("#emptyList");
//Массив с одержащий все задачи

let tasks = [];

if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
}
tasks.forEach((newTask) => renderTask(newTask));

checkEmptyList();

//Добавление задачи
form.addEventListener("submit", addTask);

//function declaration - Если мы объявляем функцию так как описали ниже, то она может вызываться раньше кода

//Удаление задач/При клике по tasklist- сработает
tasksList.addEventListener("click", deleteTask);

//Отметка о выполненнии задач/При клике по tasklist- сработает
tasksList.addEventListener("click", doneTask);

//Функции
function addTask(event) {
  event.preventDefault(); //отменяет стандартное поведение,После этого страница обновляться не будет

  //Достаем текст из поля ввода
  const taskText = taskInput.value;

  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  };

  //Добавим задачу в массив с задачамиЫ
  tasks.push(newTask);

  renderTask(newTask);
  //Очищаем поле ввода
  taskInput.value = "";
  taskInput.focus();
  //Если списокдел не пуст, то убираем  информацию о том что он пуст
  // if (tasksList.children.length > 1) {
  //   emptyList.classList.add("none"); //Добавляем класс none, который скрывает
  // }
  checkEmptyList();

  saveToLocalStorage();
}
function deleteTask(event) {
  //console.log(event.target); //target-тот элемент по которому кликнули
  //в css .btn-action img -> pointer-events:none // Снимаем с элемента все события и клик как бы проходит сквозь него. //и если бы мы кликали по картинке мы бы видели тег img
  //У кнопок есть data-action в HTML(DELETE и DONE)
  if (event.target.dataset.action !== "delete") return;
  //Чтобы ужалить эту задачу мы найдем её тег li в который она вложена и его удалим
  const parentNode = event.target.closest("li"); // Поиск по родителям
  parentNode.remove();
  //Определяем ID задачи
  // const id = parentNode.id;
  const id = Number(parentNode.id);
  //Найдем индекс и удалим по индексу
  const index = tasks.findIndex((task) => task.id === id);
  //findIndex запускает функцию для каждого эл-та массива,
  //как и forEach, и если функция вернет true, будет считаться /
  //что этот элемент подходит под условия findIndex
  //и вернется индекс этого элемента. В ином случае вернет -1

  console.log(index);

  //Удаляем задачу из массива

  tasks.splice(index, 1); //splice вырезает объекты из массива (индекс с кот начинать вырезать, кол-во эл-ов)
  // чтобы отобразить убраный вкладыш пустого списка дел

  //Или можно вместо удаления по индексу отфильтровать
  //tasks = tasks.filter((task) => task.id !== id);

  // if (tasksList.children.length === 1) {
  //   emptyList.classList.remove("none"); //Добавляем класс none, который скрывает
  // }
  checkEmptyList();
  saveToLocalStorage();
}
function doneTask(event) {
  //task-title--done добавляется в html для выполненных задач
  if (event.target.dataset.action !== "done") return;
  //Ищем родительскую ноду
  const parentNode = event.target.closest(".list-group-item");
  //Ищем в ней наш span
  const id = Number(parentNode.id);
  //Делаем так чтобы на уровне данных done менялся
  const task = tasks.find((task) => task.id === id);

  task.done = !task.done;

  const taskTitle = parentNode.querySelector("span");
  //Добавляем ему новый
  taskTitle.classList.toggle("task-title--done");
  // toggle чтобы добавлялся и убирался
  saveToLocalStorage();
}

function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListHtml = `<li id="emptyList" class="list-group-item empty-list">
    <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3" />
    <div class="empty-list__title">Список дел пуст</div>
  </li>`;
    tasksList.insertAdjacentHTML("afterbegin", emptyListHtml);
  } else {
    tasks.length > 0;
    const emptyListEl = document.querySelector("#emptyList");
    emptyListEl ? emptyListEl.remove() : null;
  }
}
function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
function renderTask(newTask) {
  // для отображения после оюновления из localstorage
  //Формируем CSS класс
  const cssClass = newTask.done ? "task-title task-title--done" : "task-title";
  //Формируем разметку новой  задачи
  const taskHTML = `<li id="${newTask.id}" class="list-group-item d-flex justify-content-between task-item">
    <span class="${cssClass}">${newTask.text}</span>
    <div class="task-item__buttons">
        <button type="button" data-action="done" class="btn-action">
            <img src="./img/tick.svg" alt="Done" width="18" height="18">
        </button>
        <button type="button" data-action="delete" class="btn-action">
            <img src="./img/cross.svg" alt="Done" width="18" height="18">
        </button>
    </div>
  </li>`;
  //Добавляем задачу на странице
  tasksList.insertAdjacentHTML("beforeend", taskHTML);
}
