import { useEffect, useState } from "react";
import { format } from "date-fns";

const Home = () => {
  const [title, setTitle] = useState("");
  const [todoList, setTodoList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = () => {
    setIsLoading(true);
    fetch("/api/todo-list")
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          throw Error("Could not load todo list");
        }
      })
      .then((data) => {
        setTodoList(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setIsLoading(false);
      });
  };

  const handleSubmitForm = (e) => {
    setIsLoading(true);
    e.preventDefault();
    fetch("/api/create-todo", {
      method: "POST",
      body: JSON.stringify({ title: e.target[0].value }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (res.status === 201) {
          setTitle("");
          setIsLoading(false);
          fetchData();
        } else {
          throw Error("Could not create todo");
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err.message);
      });
  };

  const handleDeleteTodo = (id) => {
    const deletedTodo = todoList.filter((todo) => todo._id === id)[0];
    const deletedItemIndex = todoList.findIndex((todo) => todo._id === id);
    setTodoList(todoList.filter((todo) => todo._id !== id));
    fetch("/api/delete-todo", {
      method: "POST",
      body: JSON.stringify({ id: id }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (res.status === 200) {
          return;
        } else {
          throw Error("Could not delete");
        }
      })
      .catch((err) => {
        console.log(err.message);
        const resetList = [...todoList];
        resetList.splice(deletedItemIndex, 0, deletedTodo);
        setTodoList(resetList);
      });
  };

  const handelIsChecked = (e) => {
    const targetId = e.target.id;
    const targetValue = e.target.checked;
    const todoIndex = todoList.findIndex((todo) => todo._id === targetId);
    const updatedTodo = todoList.filter((todo) => todo._id === targetId)[0];
    updatedTodo.completed = targetValue;
    const updatedList = todoList.filter((todo) => todo._id !== targetId);
    updatedList.splice(todoIndex, 0, updatedTodo);
    setTodoList(updatedList);
    fetch("/api/update-todo", {
      method: "POST",
      body: JSON.stringify({
        id: updatedTodo._id,
        title: updatedTodo.title,
        completed: updatedTodo.completed,
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (res.status === 201) {
          return;
        } else {
          throw Error("Could not update item");
        }
      })
      .catch((err) => {
        e.target.value = String(!targetValue);
        console.log(err.message);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="header-title">TODO List</h1>
        <form className="header-input-form" onSubmit={handleSubmitForm}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button type="submit" className="btn">
            ADD
          </button>
        </form>
      </header>
      <main className="todo-list-container">
        <ul className="todo-list">
          {isLoading && <p>Loading....</p>}
          {todoList.length !== 0 &&
            todoList.map((todo) => {
              return (
                <li className="todo-list-item" key={todo._id}>
                  <input
                    checked={todo.completed}
                    type="checkbox"
                    id={todo._id}
                    onChange={handelIsChecked}
                  />
                  <div className="todo-list-item--data">
                    <h4 className="todo-list-item--title">{todo.title}</h4>
                    <span className="todo-list-item--date">
                      {format(Date.parse(todo.date), "dd/MM/yyyy")}
                    </span>
                  </div>
                  <button
                    className="btn"
                    onClick={() => handleDeleteTodo(todo._id)}
                  >
                    DEL
                  </button>
                </li>
              );
            })}
        </ul>
      </main>
    </div>
  );
};

export default Home;
