import {useEffect, useReducer, useState} from "react";
import {getTodoListAction} from "../service/TodoService.js";
import TodoCard from "./TodoCard.jsx";
import LoadPanel from "./LoadPanel.jsx";
import TodoAddModal from "./TodoAddModal.jsx";
import TodoDetailModal from "./TodoDetailModal.jsx";
// import {TodoListContext} from "../context/TodoContext.js";
import TodoReducer from "../reducer/TodoReducer.js";
import TodoStore from "../store/TodoStore.js";

export default function TodoList({ status }) {
    // const [ todoList, dispatch ] = useReducer(TodoReducer, []);
    const { todoList, setTodoList } = TodoStore();
    const [ isLoading, setIsLoading ] = useState(false);
    const [ isOpenAddModal, setIsOpenAddModal ] = useState(false);
    const [ isOpenDetailModal, setIsOpenDetailModal ] = useState(false);
    const [ currTodo, setCurrTodo ] = useState(null);

    const getTodoList = async (status) => {
        setIsLoading(true);
        const { isError, data } = await getTodoListAction(status);
        setIsLoading(false);

        if (isError) {
            alert(`ERROR !! >> ${data.errorMessage}`);
            return;
        }
        // dispatch({
        //     type: "setTodoList",
        //     payload: data
        // });
        setTodoList(data);
    };

    const clickTodoCard = (todo) => {
        setCurrTodo(todo);
        setIsOpenDetailModal(true);
    };

    useEffect(() => {
        getTodoList(status);
    }, [ status ]);

    return (
        // <TodoListContext.Provider value={{ todoList, dispatch }}>
        <>
            <LoadPanel isActive={isLoading} />
            <div className={'flex justify-end p-3'}>
                <button type="button"
                        className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                        onClick={() => setIsOpenAddModal(true)}>
                    Add
                </button>
            </div>
            {!isLoading && todoList.map(todo => {
                return (
                    <div key={todo.id} className={'flex justify-center mt-4'}>
                        <TodoCard todo={todo} className={'cursor-pointer'} onClick={clickTodoCard}/>
                    </div>
                )
            })}
            <TodoAddModal openModal={isOpenAddModal}
                          status={status}
                          onClose={() => setIsOpenAddModal(false)} />
            {currTodo &&
                <TodoDetailModal openModal={isOpenDetailModal}
                                 todo={currTodo}
                                 onClose={() => setIsOpenDetailModal(false)} />
            }
        </>
        // </TodoListContext.Provider>
    )
}