import { useEffect, useState } from "react";

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
    e.preventDefault();
    fetch("/api/create-todo", {
      method: "POST",
      body: JSON.stringify({ title: e.target[0].value }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (res.status === 201) {
          setTitle("");
        } else {
          throw Error("Could not create todo");
        }
      })
      .catch((err) => {
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
      <main className="todo-list">
        {isLoading ? <p>Loading...</p> : <p>{todoList.length}</p>}
      </main>
    </div>
  );
};

export default Home;
