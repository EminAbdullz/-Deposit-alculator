let arrayOfTodos = [];
let arrayOfUsers = [];
const todoList = document.querySelector('#todoList');
const userTodo = document.querySelector('#userTodo');
const newTodo = document.querySelector('#newTodo');
//! Attach Event
document.addEventListener('DOMContentLoaded' , initApp);
newTodo.addEventListener('submit' , handleSubmit);
//! Event Logic
function initApp() {
    Promise.all([getTodos() , getUsers()]).then(values => {
        [arrayOfTodos , arrayOfUsers] = values;

        arrayOfTodos.forEach((todo)=>printTodo(todo));
        arrayOfUsers.forEach((user)=>printUserName(user));
    })
}
function handleSubmit(event) {
    event.preventDefault();
    createTodo({
        userId : + newTodo.user.value,
        title : newTodo.todo.value,
        completed : false,
    });
}
function handleChange() {
    const todoId = this.parentElement.dataset.id;
    const response = this.completed;

    toggleCompletedTodo(todoId,response);
}
function handleClose() {
    const todoId = this.parentElement.dataset.id;
    deleteTodo(todoId);
}
//! Basic logic
function printTodo({userId,id,title,completed}){
    const li = document.createElement('li');
    li.className = 'listItem';
    li.dataset.id = id;
    li.innerHTML = `<span>${title} <i>by</i> <b>${getUserNameById(userId)}</b></span>`
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = completed;
    input.addEventListener('change' , handleChange)
    const removeTodo = document.createElement('span');
    removeTodo.innerHTML = '&times;';
    removeTodo.addEventListener('click' , handleClose)
    li.prepend(input);
    li.append(removeTodo);
    todoList.prepend(li);
}
function getUserNameById(userId){
    const userName = arrayOfUsers.find((user)=>user.id === userId);
    return userName.name;
}
function printUserName(user){
    const option = document.createElement('option');
    option.value = user.id;
    option.innerText = user.name;
    userTodo.prepend(option);
}
function removeTodo(todoId) {
    arrayOfTodos = arrayOfTodos.filter((item) => item.id!==todoId);
    const todo = todoList.querySelector(`[data-id = "${todoId}"]`);
    todo.querySelector('input').removeEventListener('change' , handleChange);
    todo.querySelector('span').removeEventListener('click' , handleClose);
    todo.remove();
}
function alertError(error) {
    alert(error.message);
}
//! Async logic
async function getTodos() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos');
        const data = await response.json();
        return data;
        
    } catch (error) {
        alertError(error);
    }
}
async function getUsers(){
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const data = await response.json();
        return data;
        
    } catch (error) {
        alertError(error);
    }
}
async function createTodo(todo){
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos' , {
            method : 'POST',
            body : JSON.stringify(todo),
            headers : {
                'Content-Type' : 'application/json',
            },
        });
        const data = await response.json();
        printTodo(data);
        
    } catch (error) {
        alertError(error)
    }
}
async function toggleCompletedTodo(todoId , completed){
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}` , {
            method : 'PATCH',
            body : JSON.stringify({completed}),
            headers : {
                'Content-Type' : 'application/json',
            },
        });
        if(!response.ok) throw new Error('Failed to connet to the server')
    } catch (error) {
        alertError(error);
    }
}
async function deleteTodo(todoId){
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}` , {
            method : 'DELETE',
            headers : {
                'Content-Type' : 'application/json',
            },
        });
        if(response.ok){
            removeTodo(todoId);
        }else{
            throw new Error('Failed to connet to the server');
        }
        
    } catch (error) {
        alertError(error);
    }
}