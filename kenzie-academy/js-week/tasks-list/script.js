
const Storage = {
    get() {
        return JSON.parse(localStorage.getItem('task-list')) || []
    },

    set(tasks) {
        localStorage.setItem("task-list",JSON.stringify(tasks));
    }
}

const Tasks = {
    all: Storage.get(),
    
    // add tarefa
    add(task){
        Tasks.all.push(task);

        App.reload();
    },
    // remover tarefa

    remove(index) {
        Tasks.all.splice(index, 1);

        App.reload();
    },

    removeAll(){
        Tasks.all = [];

        App.reload();
    },

    selectAll() {
        let inputElements = document.getElementsByTagName("input");

        for(let i = 0; i < inputElements.length; i++){
            if(inputElements[i].type === 'checkbox' && inputElements[i].checked === false){
                inputElements[i].checked = true;
            }
        };

        DOM.updateInfo();
    },

    deselectAll() {
        let inputElements = document.getElementsByTagName("input");

        for(let i = 0; i < inputElements.length; i++){
            if(inputElements[i].type === 'checkbox' && inputElements[i].checked === true){
                inputElements[i].checked = false;
            }
        }

        DOM.updateInfo();
    },

    toDo() {
        let toDo = 0;
        let inputElements = document.getElementsByTagName("input");
        let liElements = document.getElementsByTagName('li');

        for(let i = 0; i < inputElements.length; i++){
            if(inputElements[i].type === 'checkbox' && inputElements[i].checked === false){
                toDo++;
                liElements[i-1].querySelector('.task-title').classList.remove('completed');
                console.log(liElements[i-1].querySelector('.task-title'));
            }
        };
        
        return toDo
    },

    done() {
        let done = 0;
        let inputElements = document.getElementsByTagName("input");
        let liElements = document.getElementsByTagName('li');

        for(let i = 0; i < inputElements.length; i++){
            if(inputElements[i].type === 'checkbox' && inputElements[i].checked === true){
                done++;
                liElements[i-1].querySelector('.task-title').classList.add('completed');
                console.log(liElements[i-1].querySelector('.task-title'));
            }
        };
        
        return done
    },

    total() {
        return Tasks.toDo() + Tasks.done()
    }

}

const DOM = {
    tasksContainer: document.getElementById('tasks-list'),

    addTask(task, index) {
        const li = document.createElement('li');
        li.innerHTML = DOM.innerHTMLTasks(task, index);
        li.dataset.index = index;

        DOM.tasksContainer.appendChild(li);
    },

    innerHTMLTasks(task, index) {


        const html = `
            <label>
                <input onclick="DOM.updateInfo()" type="checkbox" class="check-task" name="task">
                
                <span class="task-title">${task.description}</span>
            </label>
            <div class="image-container">
                <svg onclick="Tasks.remove(${index})" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-12v-2h12v2z"/></svg>    
            </div>
        `;

        return html
    },

    updateInfo() {
        document
            .getElementById('tasks-to-do')
            .innerHTML = Tasks.toDo();
        document
            .getElementById('tasks-done')
            .innerHTML = Tasks.done();
        document
            .getElementById('tasks-all')
            .innerHTML = Tasks.total();   
    },

    clearTasks() {
        DOM.tasksContainer.innerHTML = "";
    }
}

const Data = {

    getValues() {
        return document.getElementById('add-task-field').value
    },

    validateField() {
        const description = Data.getValues();
        
        if(description.trim() === ""){
            throw new Error('Por favor, preencha o campo.')
        }
    },

    clearTaskField() {
        document.getElementById('add-task-field').value = '';
    },

    submit(event) {
    
        try {
            const task = {
                id: 'incompleted',
                description: Data.getValues()
            };
            Data.validateField();
            Tasks.add(task);
            Data.clearTaskField();

        } catch (error) {
            alert(error.message);
        }
    }

}

const App = {
    init() {
        Tasks.all.forEach( (task,index) => {
            DOM.addTask(task, index);
        });

        DOM.updateInfo();

        Storage.set(Tasks.all);
    },

    reload() {
        DOM.clearTasks();
        App.init();
    }
}

App.init();

document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      Data.submit();
    }
  });
