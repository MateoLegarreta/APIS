import React, { useEffect, useState } from 'react'

function ExampleComponent() {
    const [count, setCount] = useState(0)

    useEffect(()=>{
        document.title = `Contador: ${count}`
    }, [count])

  return (
    <div>
      <button onClick={()=>{setCount(count + 1)}}>Incrementar</button>
      <h3>Contador: {count}</h3>
    </div>
  )
}

export default ExampleComponent
