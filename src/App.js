import { useEffect, useMemo, useState } from 'react';
import axios from 'axios'
import './App.css';

function App() {
  const [data, setData] = useState([])
  const [todo, setTodo] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const queryUser = async () => {
    const { data } = await axios.get('http://localhost:9000/user').catch(e => console.error(e))
    setData(data)
  }

  const queryTodo = async () => {
    const { data } = await axios.get('http://localhost:9000/todo').catch(e => console.error(e))
    setTodo(data)
  }

  const addTodo = async () => {
    const data = { title, description }
    const result = await axios.post('http://localhost:9000/todo', data)
    setTitle('')
    setDescription('')
    queryTodo()
    console.log('result', result)
  }

  const handleFinish = async (id) => {
    const result = await axios.patch(`http://localhost:9000/todo/finish/${id}`)
    queryTodo()
    console.log(result)
  }

  const handleUnFinish = async (id) => {
    const result = await axios.patch(`http://localhost:9000/todo/waiting/${id}`)
    queryTodo()
    console.log(result)
  }

  useEffect(
    () => {
      queryUser()
      queryTodo()
    },
    []
  )

  const renderSucces = useMemo(() => {
    const newTodo = todo.filter((item) => {
      return item.status === true
    })

    if (newTodo.length === 0) {
      return <li>Empty Data</li>
    } else {
      return newTodo.map((item) => {
        return <li>{item.title}  <button type="button" onClick={() => handleUnFinish(item._id)}>unfinish</button></li>
      })
    }
  }, [todo])

  return (
    <div className="App">
      <h1>My Todo List</h1>
      <div>
        Title: <input type="text" value={title} onChange={(e) => { setTitle(e.target.value)} } />
        <br />
        Description: <input type="text" value={description} onChange={(e) => { setDescription(e.target.value)}} />
        <br />
        <button type="button" onClick={() => addTodo()} >Add</button>
      </div>
      <hr />
      <h1>Show All</h1>
      <ul>
        {todo.map((item, key) => {
          return <li>{item.title}</li>
        })}
      </ul>
      <h1>Success</h1>
      <ul>
        { renderSucces }
        {
          todo
            .filter((item) => {
              return item.status === true
            }).map((item, key) => {
              return <li>{item.title} <button type="button" onClick={() => handleUnFinish(item._id)}>unfinish</button></li>
            })
        }
      </ul>
      <h1>Waiting</h1>
      <ul>
        {
          todo
            .filter((item) => {
              return item.status === false
            })
            .map((item, key) => {
              return <li>{item.title} <button type="button" onClick={() => handleFinish(item._id)}>Finish</button></li>
            })
        }
      </ul>
    </div>
  );
}

export default App;
