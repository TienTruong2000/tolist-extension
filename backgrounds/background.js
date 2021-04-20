let winID;
let notificationCount = 0;


browser.browserAction.onClicked.addListener(openPanel);

browser.commands.onCommand.addListener(function(command) {
    if (command === 'open_panel'){
        openPanel();
    }
});


function openPanel() {
    if (winID !== undefined){
        browser.windows.remove(winID).then().catch(error => console.log(error));
    }
    browser.windows.create({
        url: browser.runtime.getURL("panel/panel.html"),
        type: "popup",
        height: 500, width: 500
    })
        .then(window => {
            winID = window.id;
        });
}

browser.contextMenus.create({
    id: "todo",
    title: "Add to Todo",
    contexts: ["all"]
});
browser.contextMenus.create({
    id: "task",
    title: "Add to Task",
    contexts: ["all"]
});

browser.contextMenus.onClicked.addListener((info, tab) => {
    switch (info.menuItemId) {
        case "todo":
            handleToDo(info, tab);
            break;
        case "task":
            handleTask(info, tab);
            break;
    }
})

function handleToDo(info, tab) {

    let message = ""
    if (info.selectionText === undefined) {
        dataAccessObject.addTask(tab.title, TASK_STATUS.todo);
        message = `Add ${tab.title} to ToDo List`;
    } else{
        dataAccessObject.addTask(info.selectionText, TASK_STATUS.todo);
        message = `Add ${info.selectionText} to ToDo List`;
    }
    makeNotification(message);
    let popupPage  = browser.extension.getViews({windowId: winID})[0];
    popupPage.refresh();
    popupPage.render();
}



function handleTask(info, tab) {

    let message = ""
    if (info.selectionText === undefined) {
        dataAccessObject.addTask(tab.title, TASK_STATUS.task);
        message = `Add ${tab.title} to Task List`;
    } else{
        dataAccessObject.addTask(info.selectionText, TASK_STATUS.task);
        message = `Add ${info.selectionText} to Task List`;
    }
    makeNotification(message);
    let popupPage  = browser.extension.getViews({windowId: winID})[0];
    popupPage.refresh();
    popupPage.render();
}


function makeNotification(message){
    notificationCount++;
    browser.notifications.create(String(notificationCount), {
        "type": "basic",
        "iconUrl": "image/note.png",
        "title": "To Do List",
        "message": message
    }).then();

    setTimeout(function() {
        browser.notifications.clear(String(notificationCount));
    }, 5000);
}