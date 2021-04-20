const TASK_STATUS = {
    task: 1,
    todo: 2,
    done: 3
}
const RENDER_PROPERTIES = {
    "toReadDiv": {
        status: TASK_STATUS.task,
        moveDownButton:{
            label:"todo",
            new_task_status: TASK_STATUS.todo
        }

    },
    "toDoDiv": {
        status: TASK_STATUS.todo,
        moveUpButton:{
            label:"task",
            new_task_status: TASK_STATUS.task
        },
        moveDownButton:{
            label:"done",
            new_task_status: TASK_STATUS.done
        }
    },
    "doneDiv":{
        status: TASK_STATUS.done,
        moveUpButton:{
            label:"todo",
            new_task_status: TASK_STATUS.todo
        },
    },
    "addToDo":{
        status: TASK_STATUS.todo
    },
    "addToRead":{
        status: TASK_STATUS.task
    },
    "addDone":{
        status: TASK_STATUS.done
    }
}


let dataAccessObject = browser.extension.getBackgroundPage().dataAccessObject;

render()
addEventListenerForAddButton("addToRead");
addEventListenerForAddButton("addToDo");
addEventListenerForAddButton("addDone");

function render(){
    renderDiv("toReadDiv")
    renderDiv("toDoDiv")
    renderDiv("doneDiv")
}


function refresh(){
    refreshDiv("toReadDiv");
    refreshDiv("toDoDiv");
    refreshDiv("doneDiv");
}


function refreshDiv(divID){
    //remove all child elements
    let div = document.getElementById(divID);
    while(div.firstChild){
        div.removeChild(div.lastChild);
    }

}

function renderDiv(divID){
    let data = dataAccessObject.getTaskByStatus(RENDER_PROPERTIES[divID].status);
    if (data.length === 0){
        let div = document.getElementById(divID);
        div.innerHTML = "Empty";
    }
    data.forEach(task =>{
        renderRow(task, divID);
    });

}

function renderRow(data, divID){
    let render_properties = RENDER_PROPERTIES[divID];

    let div = document.getElementById(divID);
    let dataDiv = document.createElement("div");
    div.appendChild(dataDiv);
    dataDiv.draggable = true;
    dataDiv.classList.add("task");
    dataDiv.id = data.id;


    let valueSpan = document.createElement("span");
    dataDiv.appendChild(valueSpan);
    valueSpan.innerHTML = parseMarkdown(data.value);
    valueSpan.addEventListener("dblclick", doubleClick);

    let buttonGroup = document.createElement("div");
    dataDiv.appendChild(buttonGroup);
    buttonGroup.classList.add("buttonGroup");

    let deleteButton = document.createElement("button");
    buttonGroup.appendChild(deleteButton);
    deleteButton.innerHTML = "Delete";
    deleteButton.addEventListener("click", deleteTask);

    if (render_properties.moveUpButton !== undefined){
        let moveUpButton = document.createElement("button");
        buttonGroup.appendChild(moveUpButton);
        moveUpButton.value = render_properties.moveUpButton.new_task_status;
        moveUpButton.innerHTML = render_properties.moveUpButton.label;
        moveUpButton.classList.add("up");
        moveUpButton.addEventListener('click', updateTaskStatus);
    }

    if (render_properties.moveDownButton !== undefined){
        let moveDownButton = document.createElement("button");
        buttonGroup.appendChild(moveDownButton);
        moveDownButton.value = render_properties.moveDownButton.new_task_status;
        moveDownButton.innerHTML = render_properties.moveDownButton.label;
        moveDownButton.classList.add("down");
        moveDownButton.addEventListener('click', updateTaskStatus);
    }
}

function deleteTask(event){
    let id = event.target.parentElement.parentElement.id;
    dataAccessObject.deleteTask(id);
    refresh();
    render();
}

function updateTaskStatus(event){
    let button = event.target;
    let id = button.parentElement.parentElement.id;
    let newStatus = button.value;
    let task = dataAccessObject.getTaskByID(id);
    task.status = parseInt(newStatus);
    dataAccessObject.updateTask(task);
    refresh();
    render();
}

function addEventListenerForAddButton(buttonID){
    document.getElementById(buttonID).addEventListener("click", (e)=>{
        let header = e.target.parentElement;
        let textArea = document.createElement("textarea");
        header.parentElement.insertBefore(textArea, header.nextSibling);
        textArea.focus();
        textArea.addEventListener("keypress", e =>{
            if (e.key === 'Enter' && !e.shiftKey ) {
                dataAccessObject.addTask(e.target.value, RENDER_PROPERTIES[buttonID].status);
                e.target.parentElement.removeChild(e.target);
                refresh();
                render();
            }
        })
    })
}

function doubleClick(e){
    let span = e.target;
    if (e.target.tagName !== "SPAN"){
        span = $(e.target).parents("span")[0];
    }
    let id = span.parentElement.id;
    let task = dataAccessObject.getTaskByID(parseInt(id));
    let value = task.value;
    let textArea = document.createElement("textarea");
    textArea.value = value;
    span.parentElement.insertBefore(textArea, span.nextSibling);
    span.parentElement.removeChild(span);
    span.id = "textArea";

    textArea.focus();
    //add event when user enter to finnish writing in textArea
    textArea.addEventListener("keypress", e =>{
        if (e.key === 'Enter' && !e.shiftKey ) {
            let value = e.target.value;
            let id = e.target.parentElement.id;
            let task = dataAccessObject.getTaskByID(parseInt(id));
            task.value = value;
            dataAccessObject.updateTask(task);
            e.target.parentElement.removeChild(e.target);
            refresh();
            render();
        }
    });
}







