import React, { useEffect, useState } from "react";
import "./todo.css";
import { useDispatch, useSelector } from "react-redux";
import { addTodos, getTodos, removeTodos, updateTodos } from './redux/actions/index'
import Spinner from './Spinner'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const Todo = () => {

  const dispatch = useDispatch();
  const show = useSelector((state) => state.TodoReducers.todos);

  const [loading, setLoading] = useState(false);
  const [addloading, setaddLoading] = useState(false);
  const [input, setInput] = useState({ todo: '' });
  const [find, setFind] = useState("-1");
  const [check, setcheck] = useState(true);
  const [filter, setFilter] = useState("");
  const [edited, setEdited] = useState({ id: '', todo: '' });
  const [found, setFound] = useState([]);
  const [clicked, setClicked] = useState(false);
  const [flag, setFlag] = useState(true);
  const [showw, setShoww] = useState(false);
  const handleClose = () => setShoww(false);
  const [findvalue, setfindvalue] = useState("");

  useEffect(() => {
    dispatch(getTodos());
  }, [dispatch]);

  useEffect(() => {
    if (show.length===0) {
      setFlag(false);
    }
  }, [show])
  

  const add = (e) => {
    e.preventDefault();
    setaddLoading(true);
    setTimeout(() => {
      if (input.todo !== "") {
        dispatch(addTodos(input));
        setcheck(true);
        setFind(-1);
      }
      setaddLoading(false);
      setFilter("");
      setInput({ id: "", todo: "" });
    }, 1000);
  };

  const search = (e) => {
    setFilter("");
    setfindvalue(show.find(x => x.id === e.target.value))
    setFind(e.target.value);
    if (e.target.value !== "-1") {
      setcheck(false);
    }
    else {
      setcheck(true);
    }
  }
    
  const filterTodo = () => {
    setClicked(true);
    if (filter !== "") {
      const arrayy = show.filter(item => {
        if (filter === "") {
          return show
        } else if (item.todo.toLowerCase().includes(filter.toLowerCase())) {
          return item
        }
      })
      setFound(arrayy);
    }
    else if (filter === "") {
      setcheck(true);
      setFilter("");
    }
    else {
      setcheck(false);
    }
  }

  const remove = (index) => {
    dispatch(removeTodos(index));
    setClicked(false);
    setcheck(true);
    setFind(-1);
  };

  const edit = (item) => {
    setShoww(true);
    setEdited(item);
  };

  const editItem = (e) => {
    e.preventDefault();
    if (edited.todo !== "") {
      setLoading(true);
      setTimeout(() => {
        dispatch(updateTodos(edited));
        setLoading(false);
        setShoww(false);
        setClicked(false);
        setcheck(true);
        setFind(-1);
      }, 2000);
    }
  };

  return (
    <>
      <h3 className="text-center mt-5">Simple Todo App</h3>
      <div className="main mt-5">
        <form className="inputValue mb-4" onSubmit={add}>
          <input
            placeholder="Enter todo"
            type="text"
            onChange={(e) => {
              setInput({ ...input, todo: e.target.value })
            }}
            value={input.todo}
            required
          />
          <button type="submit" className="btn btn-primary">
            {
              addloading ? (<Spinner />) : ("Add todo")
            }
          </button>
        </form>
        <div className="setValue">
          <div className="search">
            <select value={find} onChange={(e) => search(e)} className="form-select">
              <option value="-1">Select</option>
              {
                show.map((item, index) => {
                  return (
                    <option key={index} value={item.id}>{item.todo}</option>
                  )
                })
              }
            </select>

            <input type="text"
              value={filter}
              onChange=
              {(e) => {
                setClicked(false);
                setFilter(e.target.value);
                setFind(-1);
                setcheck(true);
              }
              }
              placeholder="Search todos" />

            <button type="button" onClick={filterTodo} className="btn btn-success">
              Search
            </button>
          </div>

          <table className="table text-center">
            <thead className="thead table-primary">
              <tr>
                <th width="50%">Todos</th>
                <th width="50%">Operations</th>
              </tr>
            </thead>
            {
              (show.length > 0) ?
                (
                  (check ?
                    (
                      (clicked ? (filter === "" ? (show) : (found)) : (show))
                        .map((item, index) => {
                          return (
                            <tbody className="table-success" key={index}>
                              <tr>
                                <td>{item.todo}</td>
                                <td>
                                  <Button
                                    type="button"
                                    onClick={() => remove(item.id)}
                                    className="btnn btn btn-sm btn-danger"
                                  >
                                    Delete
                                  </Button>

                                  <Button
                                    type="button"
                                    variant="primary"
                                    onClick={() => edit(item)}
                                    className="btn btn-sm btn-warning"
                                  >
                                    Edit
                                  </Button>
                                </td>
                              </tr>
                            </tbody>
                          );
                        }
                        )
                    ) 
                    :
                    <tbody>
                      <tr className="table-success">
                        <td>{findvalue.todo}</td>
                        <td>
                          <Button
                            type="button"
                            onClick={() => {

                              remove(findvalue.id)
                            }}
                            className="btn btnn btn-sm btn-danger"
                          >
                            Delete
                          </Button>

                          <Button
                            type="button"
                            variant="primary"
                            onClick={() => edit(findvalue)}
                            className="btn btn-sm btn-warning"
                          >
                            Edit
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  )
                ) :
                (flag ?
                  (
                    <tbody>
                      <tr>
                        <td colSpan="2"><Spinner /></td>
                      </tr>
                    </tbody>
                  ) :
                  (
                    <div>No todos to show please enter some...</div>
                  )
                )
            }
          </table>

          <Modal
            show={showw}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
          >
            <form onSubmit={editItem}>
              <Modal.Header closeButton>
                <Modal.Title>Modal title</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <input
                  placeholder="Donot left this empty"
                  type="text"
                  onChange={(e) => {
                    setEdited({ ...edited, todo: e.target.value });
                  }
                  }
                  value={edited.todo}
                  required
                />
              </Modal.Body>
              <Modal.Footer>
                <Button type="submit" variant="primary">
                  {
                    loading ? (<Spinner />) : ("Done Editing")
                  }
                </Button>
              </Modal.Footer>
            </form>
          </Modal>

        </div>
      </div >
    </>
  );
};

export default Todo;
