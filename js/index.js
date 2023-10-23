'use strict'

let toDoTasks = [];
let doneTasks = [];

if(localStorage.length === 0) {
    localStorage.setItem('done',JSON.stringify(doneTasks));
    localStorage.setItem('toDoTasks',JSON.stringify(toDoTasks));
}

const addTaskForm = document.querySelector('.add-task-form');
const taskname = document.querySelector('#taskName');
const taskCorP = document.querySelector('#taskCorP');
const taskPriority = document.querySelector('.priority');
const taskLevel = document.querySelector('.level');
const taskDay = document.querySelector('.day-task');
const addTask = document.querySelector('.add-task');
const toDolist = document.querySelector('.toDolist');
const doneList = document.querySelector('.doneList');
const close = document.querySelector('.close');

addTask.addEventListener('click', function(e) {
    e.preventDefault();
    addTaskForm.classList.remove('hidden');
});

close.addEventListener('click', function(e) {
    e.preventDefault();
    addTaskForm.classList.add('hidden')
});

const renderTask = function(taskItems){
    const easy = `
        <span class="priority-level ${taskItems.taskPriority} rounded-bl-3xl rounded-r ml-3 "></span>
        <span class="priority-level empty rounded-bl-3xl rounded-r ml-3 "></span>
        <span class="priority-level empty rounded-bl-3xl rounded-r ml-3 "></span>
    `;

    const moderated = `
        <span class="priority-level ${taskItems.taskPriority} rounded-bl-3xl rounded-r ml-3 "></span>
        <span class="priority-level ${taskItems.taskPriority} rounded-bl-3xl rounded-r ml-3 "></span>
        <span class="priority-level empty rounded-bl-3xl rounded-r ml-3 "></span>
    `;

    const hard = `
        <span class="priority-level ${taskItems.taskPriority} rounded-bl-3xl rounded-r ml-3 "></span>
        <span class="priority-level ${taskItems.taskPriority} rounded-bl-3xl rounded-r ml-3 "></span>
        <span class="priority-level ${taskItems.taskPriority} rounded-bl-3xl rounded-r ml-3 "></span>
    `;
    return `
        <div id="${taskItems.taskname}"  class="task hover:cursor-pointer hover:shadow-2xl hover:shadow-indigo-500 duration-200 rounded-md
        my-3 p-3">
            <div class="flex">
                <h2 class="font-sans pl-3 font-bold text-2xl">${taskItems.taskname}</h2>
                <button class="close-task hidden ml-auto">
                    <img class="w-fit" src="../icons/delete.svg" alt="delete">
                </button>
                <button class="
                edit-task 
                duration-200 
                font-sans
                font-bold 
                sm:text-3xl 
                text-2xl 
                rounded 
                hover:rounded 
                hover:text-white 
                p-3
                hidden 
                ml-auto">
                    Edit
                </button>
            </div>
            <div class="task-desc m-3 pt-4 sm:flex">

                <!----------- Priority ------------->
                <div class="priority ${taskItems.taskPriority}-priority">
                    <span class="date ${taskItems.taskPriority} ${taskItems.taskDay === "None" ? 'hidden' : taskItems.taskDay} p-3 rounded-xl font-sans sm:text-lg text-sm font-bold">${taskItems.taskDay}</span>
                    
                    ${taskItems.taskLevel === 'Easy' 
                    ? easy 
                    : taskItems.taskLevel === 'Moderate'
                    ? moderated
                    : hard}

                </div>

                <h4 class="desc font-sans sm:ml-auto md:text-2xl text-md">
                    ${taskItems.taskCorP}
                </h4>
            </div>
        </div>
    `;
}

addTaskForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const taskItems = {
        taskname: taskname.value,
        taskCorP: taskCorP.value,
        taskPriority: taskPriority.value,
        taskLevel: taskLevel.value,
        taskDay: taskDay.value,
        taskType: 'to-do'
    }
    
    if(taskItems.taskname === "") {
        const err = document.querySelector('.err-task');
        err.classList.remove('hidden')
        taskname.addEventListener('click', () => err.classList.add('hidden'));
    } 
    
    if(taskItems.taskCorP === "") {
        const err = document.querySelector('.err-cp');
        err.classList.remove('hidden')
        taskCorP.addEventListener('click', () => err.classList.add('hidden'));
    }

    if(taskItems.taskname === "" || taskItems.taskCorP === '') return;

    taskItems.taskType = 'To-do'
    toDolist.insertAdjacentHTML('beforeend', renderTask(taskItems));
    toDoTasks.push(taskItems);
    localStorage.setItem('toDoTasks',JSON.stringify(toDoTasks));
    addTaskForm.classList.add('hidden');
    if(taskname.value.length > 0 && taskCorP.value.length > 0) {
        location.reload()
    };
});


toDolist.addEventListener('click',function(e) {
    if(e.target.closest('.edit-task')) return;
    const data = e.target.closest('.task');
    if(!data) return;
    const data2 = toDoTasks.find(task => task.taskname === data.id);
    const data3 = toDoTasks.findIndex(task => task.taskname === data.id);
    data2.taskType = 'done';
    console.log(data2)

    if(data2.taskType === 'done') {
        doneTasks.push(data2);
        localStorage.setItem('done',JSON.stringify(doneTasks));
    };
    toDoTasks.splice(data3,1);
    toDolist.removeChild(data);
    localStorage.setItem('toDoTasks',JSON.stringify(toDoTasks));
    doneList.insertAdjacentHTML('beforeend', renderTask(data2));
    location.reload();
});

if(localStorage.key('toDoTasks')) {
    toDoTasks = JSON.parse(localStorage.getItem('toDoTasks'));
    toDolist.insertAdjacentHTML('beforeend', toDoTasks.map(task => 
        renderTask(task)
    ).join(" "));
}

if(localStorage.key('done')) {
    doneTasks = JSON.parse(localStorage.getItem('done'));
    doneList.insertAdjacentHTML('beforeend', doneTasks.map(task => 
        renderTask(task)
    ).join(" "));
}

const closeBtns = doneList.querySelectorAll('.close-task');
closeBtns.forEach(btn => btn.classList.remove('hidden'))
closeBtns.forEach(btn => 
    btn.addEventListener('click',function(e){
    const data = e.target.closest('.task');
    const data2 = doneTasks.find(task => data.id === task.taskname);
    doneTasks.splice(data2,1);
    doneList.removeChild(data);
    localStorage.setItem('done', JSON.stringify(doneTasks));
    console.log(data2)
}));

const editBtns = toDolist.querySelectorAll('.edit-task');
editBtns.forEach(btn => btn.classList.remove('hidden'));
editBtns.forEach(btn => btn.addEventListener('click',function(e){
    const data = e.target.closest('.task');
    const data2 = toDoTasks.find(task => data.id === task.taskname);
    addTaskForm.classList.remove('hidden');
    close.classList.add('hidden');
    toDoTasks.splice(data2,1);
    addTaskForm.addEventListener('submit', function(e){
        e.preventDefault();
        if(taskname.value.length > 0 && taskCorP.value.length > 0) {
            toDolist.removeChild(data);
        };
    })
}))












