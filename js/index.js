'use strict'

const taskname = document.querySelector('#taskName');
const taskCorP = document.querySelector('#taskCorP');
const taskPriority = document.querySelector('.priority');
const taskLevel = document.querySelector('.level');
const taskDay = document.querySelector('.day-task');
const addTask = document.querySelector('.add-task');
const toDolist = document.querySelector('.toDolist');
const doneList = document.querySelector('.doneList');
const close = document.querySelector('.close');
if(!localStorage.key('toDoTasks') && !localStorage.key('done')) {
    localStorage.setItem('toDoTasks',JSON.stringify([]));
    localStorage.setItem('done',JSON.stringify([]));
}

class toDoListAPP {
    toDoTasks = [];
    doneTasks = [];
    addTaskForm = document.querySelector('.add-task-form');
    constructor (){
        addTask.addEventListener('click', this.showForm.bind(this));
        close.addEventListener('click', this.hideForm.bind(this));
        this.addTaskForm.addEventListener('submit', this.addTaskFormSubmit.bind(this));
        if(localStorage.key('toDoTasks')) {
            this.toDoTasks = JSON.parse(localStorage.getItem('toDoTasks'));
            toDolist.insertAdjacentHTML('beforeend', this.toDoTasks.map(task => 
                this.renderTask(task)
            ).join(" "));
        }
        
        if(localStorage.key('done')) {
            this.doneTasks = JSON.parse(localStorage.getItem('done'));
            doneList.insertAdjacentHTML('beforeend', this.doneTasks.map(task => 
                this.renderTask(task)
            ).join(" "));
        }

        toDolist.addEventListener('click',this.makeDone.bind(this));

        const closeBtns = doneList.querySelectorAll('.close-task');
        closeBtns.forEach(btn => btn.classList.remove('hidden'))
        closeBtns.forEach(btn => 
        btn.addEventListener('click',function(e){
        const data = e.target.closest('.task');
        const data2 = this.doneTasks.find(task => data.id === task.taskname);
        this.doneTasks.splice(data2,1);
        doneList.removeChild(data);
        localStorage.setItem('done', JSON.stringify(this.doneTasks));
        console.log(data2)
        }.bind(this)));

        const editBtns = toDolist.querySelectorAll('.edit-task');
        editBtns.forEach(btn => btn.classList.remove('hidden'));
        editBtns.forEach(btn => btn.addEventListener('click',function(e){
        const data = e.target.closest('.task');
        const data2 = this.toDoTasks.find(task => data.id === task.taskname);
        this.addTaskForm.classList.remove('hidden');
        close.classList.add('hidden');
        this.toDoTasks.splice(data2,1);
        this.addTaskForm.addEventListener('submit', function(e){
            e.preventDefault();
            if(taskname.value.length > 0 && taskCorP.value.length > 0) {
                toDolist.removeChild(data);
            };
        }.bind(this));
        }.bind(this)))
    };

    renderTask(taskItems){
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

    addTaskFormSubmit(e){
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
        toDolist.insertAdjacentHTML('beforeend', this.renderTask(taskItems));
        this.toDoTasks.push(taskItems);
        localStorage.setItem('toDoTasks',JSON.stringify(this.toDoTasks));
        this.addTaskForm.classList.add('hidden');
        if(taskname.value.length > 0 && taskCorP.value.length > 0) {
            location.reload()
        };
    }

    makeDone(e) {
        if(e.target.closest('.edit-task')) return;
        const data = e.target.closest('.task');
        if(!data) return;
        const data2 = this.toDoTasks.find(task => task.taskname === data.id);
        console.log(data2)
        data2.taskType = 'done';
        console.log(data2)
    
        if(data2.taskType === 'done') {
            this.doneTasks.push(data2);
            localStorage.setItem('done',JSON.stringify(this.doneTasks));
        };
        this.toDoTasks.splice(data2,1);
        toDolist.removeChild(data);
        localStorage.setItem('toDoTasks',JSON.stringify(this.toDoTasks));
        doneList.insertAdjacentHTML('beforeend', this.renderTask(data2));
        location.reload();
    }

    showForm(e) {
        e.preventDefault();
        this.addTaskForm.classList.remove('hidden');
    }

    hideForm(e) {
        e.preventDefault();
        this.addTaskForm.classList.add('hidden');
    }
};

const toDoAPP = new toDoListAPP();
