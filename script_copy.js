let allTasks = null;
let input = null;
let inputValue = '';
let activeEditTask = null;
let editTask = null;
const link = 'http://localhost:8000';

window.onload = async function init() {
    input = document.getElementById('add-task');
    input.addEventListener('change', updateValue);
    const response = await fetch (link + '/allTasks', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Access-Control-Allow-Origin': 'http://localhost:8080'
        },
    });
    const  result = await response.json();
    allTasks = result.data;
    render ();
}

const updateValue = (event) => {
    inputValue = event.target.value;
} 

const onClickButton = async () => {
    const resp = await fetch (link + '/createTask', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            text: inputValue,
            isCheck: false,
        })
    });
    if (resp.status === 200) {
        const result = await resp.json();
        allTasks.push (result);
        input.value = '';
        inputValue = '';
        render ();
    } else {
        alert('Упс, что-то пошло не так');
    }
}    

const render = () => {
    const content = document.getElementById('content');
    while (content.firstChild) {
        content.removeChild(content.firstChild)
    }
    allTasks
        .sort ((a, b) => {
            if (a.name === b.name) return 0;
            return (a.name > b.name) ? 1 : -1
        })
        .map((value, index) => {
            const container = document.createElement('div');
            content.appendChild(container);
            container.className = "task";
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = value.isCheck;
            checkbox.className = 'check';
            container.appendChild(checkbox)
            checkbox.onchange = () => {doneTask(value, index)};

            if (!value.isCheck === true) {
                if(value._id === activeEditTask) {
                    const inputTask = document.createElement('input');
                    inputTask.type = 'text';
                    inputTask.value = value.text;
                    inputTask.addEventListener('change', updateTaskText);
                    inputTask.addEventListener('blur', doneEditTask);
                    container.appendChild(inputTask);
                    const imageDone = document.createElement('img');
                    imageDone.src = 'img/done.svg';
                    imageDone.onclick = () => {doneEditTask()};
                    container.appendChild(imageDone);
                } else {
                    const text = document.createElement('p');
                    text.innerText = value.text;
                    container.appendChild(text);
                    const imageEdit = document.createElement('img');
                    container.appendChild(imageEdit);
                    imageEdit.src = "img/pencil.svg";
                    imageEdit.onclick = () => {
                        activeEditTask = value._id;
                    render (); 
                    }
                    text.className = 'task';
            } 
            } else {
                const text = document.createElement('p');
                text.innerText = value.text;
                container.appendChild(text);
                text.className = 'done-task';
            };
            const imageDelete = document.createElement('img');
                    imageDelete.src = "img/cross.svg";
                    imageDelete.onclick = () => {deleteTask(value)};
                    container.appendChild(imageDelete);
        });
}

const doneEditTask = async (event) => {
    text = event.target.value;
    console.log('doneedit', activeEditTask)
    const resp = await fetch (link + '/updateTaskText', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Access-Control-Origin': '*'
        },
        body: JSON.stringify({
            id: activeEditTask,
            text: text
        })
    });
    event.text = text;
    activeEditTask = null;
    render();
}

const doneTask = async (value, index) => {
    allTasks[index].isCheck = !allTasks[index].isCheck;
    activeEditTask = value._id;
    const resp = await fetch (link + '/updateTask', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Access-Control-Origin': '*'
        },
        body: JSON.stringify({
            id: activeEditTask,
            isCheck: allTasks[index].isCheck
        })
    });
    const response = await fetch (link + '/allTasks', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Access-Control-Allow-Origin': 'http://localhost:8000'
        },
    });
    let result = await response.json();
    allTasks = result.data;
    activeEditTask = null;
    render ();
}

const deleteTask = async (event) => {
    const resp = await fetch (link + `/deleteTask?_id=${event._id}`, {
        method: 'DELETE'
    });
    activeEditTask = null;
    const response = await fetch (link + '/allTasks', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Access-Control-Allow-Origin': 'http://localhost:8000'
        },
    });
    let result = await response.json();
    allTasks = result.data;
    render();
}

const updateTaskText = async (event) => {
    const resp = await fetch (link + '/updateTask', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Access-Control-Origin': '*'
        },
        body: JSON.stringify({
            id: activeEditTask,
            text: event.target.value
        })
    });
    const response = await fetch (link + '/allTasks', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Access-Control-Allow-Origin': 'http://localhost:8000'
        },
    });
    let result = await response.json();
    allTasks = result.data;
    render();
}



