const TASK_STATUS = {
    task: 1,
    todo: 2,
    done: 3
}

const DATA_KEY = "TODO_DATA"


//addFakeData();
function addFakeData(){
    let data = [
        {
            id: 1,
            value: 'Task 1',
            status: TASK_STATUS.task
        },
        {
            id: 2,
            value: 'Task 2',
            status: TASK_STATUS.todo
        },
        {
            id: 3,
            value: 'Task 3',
            status: TASK_STATUS.done
        },
        {
            id: 4,
            value: 'Task 4',
            status: TASK_STATUS.todo
        },
        {
            id: 5,
            value: 'Task 5',
            status: TASK_STATUS.done
        },

    ]
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
}

var dataAccessObject = {
    addTask(value, status = TASK_STATUS.task){
        let data = JSON.parse(localStorage.getItem(DATA_KEY));
        data.push({
            id: this.getAllTask().length + 1,
            value,
            status
        });
        localStorage.setItem(DATA_KEY, JSON.stringify(data));
    },
    deleteTask(id){
        let data = JSON.parse(localStorage.getItem(DATA_KEY));
        let index = data.findIndex(task => task.id == id);
        let deletedTask = data.splice(index, 1)[0];
        localStorage.setItem(DATA_KEY, JSON.stringify(data));
        return deletedTask;
    },
    getTaskByID(id){
        let data = JSON.parse(localStorage.getItem(DATA_KEY));
        return data.find(task => task.id == id);
    },

    getTaskByStatus(status){
        let data = JSON.parse(localStorage.getItem(DATA_KEY));
        return data.filter(task => task.status === status);
    },

    getAllTask(){
        return JSON.parse(localStorage.getItem(DATA_KEY));
    },

     updateTask(newTask){
        let data = JSON.parse(localStorage.getItem(DATA_KEY));
        data = data.map(task => {
            if (task.id === newTask.id){
                return newTask;
            } else{
                return task;
            }
        })
        localStorage.setItem(DATA_KEY, JSON.stringify(data));
    }
}