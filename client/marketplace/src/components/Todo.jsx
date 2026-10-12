const Todo = ({tarea, index, deleteTodo}) =>{
    return(
        <>
        <h2>{tarea}</h2>
        <button onClick={()=>deleteTodo(index)}>X</button>
        </>
    )
}

export default Todo