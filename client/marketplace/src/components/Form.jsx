import { useState } from "react";
import  Todo  from "./Todo";

export const Form = () => {
  const [todos, setTodos] = useState([]);//{todo:'hola'},{}
  const [todo, setTodo] = useState('')//hola

  const handleChange = (e)=>{setTodo(e.target.value)}

  const handleClick = () => {
    if(todo.trim() === ''){
        alert('el campo no puede estar vacio')
    return
}
    setTodos([...todos, {todo}])
  }
  
const deleteTodo = (indice)=>{
const newTodos = [...todos]
newTodos.splice(indice, 1)
setTodos(newTodos)
}
  return (
    <>
      <form onSubmit={(e)=>e.preventDefault()}>
        <label>Agregar Tarea</label> <br />
        <input type="text"
               name="todo"
               onChange={handleChange}/>
        <button onClick={handleClick}>Agregar</button>
      </form>
      {todos.map((value, index) => (
        <Todo tarea={value.todo} key={index} index={index} deleteTodo={deleteTodo} />
      ))}
    </>
  );
};
