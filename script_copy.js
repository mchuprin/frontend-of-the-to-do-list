let allTasks = null;
let input = null;
let inputValue = '';
let activeEditTask = null;
let editTask = null;

window.onload = async function init() {
    input = document.getElementById('add-task');
    input.addEventListener('change', updateValue);
    const response = await fetch ('http://localhost:8000/allTasks', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8',
            'Access-Control-Allow-Origin': 'http://localhost:8080'
        },
    });
    let result = await response.json();
    allTasks = result.data;
    render ();
}

updateValue = (event) => {
    inputValue = event.target.value;
} 

onClickButton = async () => {
    const resp = await fetch ('http://localhost:8000/createTask', {
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
    let result = await resp.json();
    allTasks.push (result);
    input.value = '';
    inputValue = '';
    render ();
}    

render = () => {
    const content = document.getElementById('content');
    while (content.firstChild) {
        content.removeChild(content.firstChild)
    }
    
    allTasks.sort((a,b) => a.isCheck > b.isCheck ? 1 : a.isCheck < b.isCheck ? -1 : 0)

    allTasks.map((value, index) => {
        const container = document.createElement('div');
        content.appendChild(container);
        container.className = "task";
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = value.isCheck;
        checkbox.className = 'check';
        container.appendChild(checkbox)
        checkbox.onchange = function () {
            doneTask(value, index)
        };

        if (value.isCheck === false) {
            if(value._id === activeEditTask) {
                const inputTask = document.createElement('input');
                inputTask.type = 'text';
                inputTask.value = value.text;
                inputTask.addEventListener('change', updateTaskText);
                inputTask.addEventListener('blur', doneEditTask);
                container.appendChild(inputTask);
                const imageDone = document.createElement('img');
                imageDone.src = 'done.svg';
                imageDone.onclick = function () {
                    doneEditTask
                }
                container.appendChild(imageDone);
            } else {
                const text = document.createElement('p');
                text.innerText = value.text;
                container.appendChild(text);
                const imageEdit = document.createElement('img');
                container.appendChild(imageEdit);
                imageEdit.src = "pencil.svg";
                imageEdit.onclick = function () {
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
                imageDelete.src = "cross.svg";
                imageDelete.onclick = function () {
                    deleteTask(value);
                 };
                container.appendChild(imageDelete);
    });
    
}

doneEditTask = async (event) => {
    text = event.target.value;
    console.log('doneedit', activeEditTask)
    const resp = await fetch ('http://localhost:8000/updateTaskText', {
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
doneTask = async (value, index) => {
    allTasks[index].isCheck = !allTasks[index].isCheck;
    activeEditTask = value._id;
    const resp = await fetch ('http://localhost:8000/updateTask', {
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
    const response = await fetch ('http://localhost:8000/allTasks', {
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

deleteTask = async (event) => {
    const resp = await fetch (`http://localhost:8000/deleteTask?_id=${event._id}`, {
        method: 'DELETE'
    });
    activeEditTask = null;
    const response = await fetch ('http://localhost:8000/allTasks', {
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

updateTaskText = async (event) => {
    const resp = await fetch ('http://localhost:8000/updateTask', {
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
    const response = await fetch ('http://localhost:8000/allTasks', {
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



