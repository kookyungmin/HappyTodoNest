import {Modal} from "flowbite-react";
import { FaPlus, FaPlusCircle } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
import {addTodoFileAction, getTodoFilesAction, removeTodoAction, saveTodoAction} from "../service/TodoService.js";
import {useContext, useEffect, useState} from "react";
import TodoStore from "../store/TodoStore.js";
import FileUploader from "./FileUploader.jsx";
import {FILE_API_URL, getImageAction} from "../service/FileService.js";
// import {TodoListContext} from "../context/TodoContext.js";


export default function TodoDetailModal({ openModal, onClose, todo }) {
    const [ title, setTitle ] = useState(todo.title);
    const [ isEditTitle, setIsEditTitle ] = useState(false);
    const [ files, setFiles ] = useState([]);
    // const { dispatch } = useContext(TodoListContext);
    const { removeTodo, changeTodo } = TodoStore();

    const remove = async () => {
        if (!confirm('Are you sure to Remove?')) return;
        const { isError, data } = await removeTodoAction(todo.id);
        if (isError) {
            alert(`${data.errorMessage}`);
            return;
        }
        // dispatch({
        //     type: 'removeTodo',
        //     payload: todo.id
        // })
        removeTodo(todo.id);
        closeModal();
    };

    const onEnter = (event) => {
        if (event.code !== 'Enter') return;
        saveTodo({
            id: todo.id,
            title: title,
            content: todo.content,
            statusCode: todo.statusCode
        })
    }

    const saveTodo = async (newTodo) => {
        const { isError, data } = await saveTodoAction(newTodo);
        if (isError) {
            alert(data.errorMessage);
            return;
        }
        setIsEditTitle(false);
        // dispatch({
        //     type: 'changeTodo',
        //     payload: newTodo
        // })
        changeTodo(newTodo);
    };

    const closeModal = () => {
        initialize();
        onClose();
    };

    const uploadTodoFiles = async (uploadedFiles) => {
        uploadedFiles.forEach(async (file) => {
            file.domainId = todo.id;
            file.blob = await getImageBlob(file);
        });
        const { data, isError } = await addTodoFileAction(uploadedFiles);
        if (isError) {
            alert(data.errorMessage);
            return;
        }
        setFiles([...files, ...uploadedFiles]);
    };

    useEffect(() => {
        initialize();
        getTodoFiles();
    }, [ todo ]);

    const initialize = () => {
        setIsEditTitle(false);
        setTitle(todo.title);
    };

    const getTodoFiles = async () => {
        const { data, isError } = await getTodoFilesAction(todo.id);
        if (isError) {
            alert(data.errorMessage);
            return;
        }
        for(let f of data) {
            if (f.blob) continue;
            const blob = await getImageBlob(f);
            f.blob = blob;
        }
        setFiles(data);
    }

    const getImageBlob = async (file) => {
        const { data, isError } = await getImageAction(file?.uniqueFileName);
        if (isError) {
            alert(data.errorMessage);
            return;
        }
        const reader = new FileReader();

        await new Promise((resolve, reject) => {
            reader.onload = resolve;
            reader.onerror = reject;
            reader.readAsDataURL(data);
        });

        return reader.result;
    }

    return (
        <>
            <Modal show={openModal} onClose={closeModal}>
                <Modal.Header>
                    {isEditTitle ?
                        <>
                            <input value={title}
                                   onChange={(event) => setTitle(event.target.value) }
                                   onKeyUp={onEnter}/>
                        </>
                        : <div onClick={() => setIsEditTitle(true)}>{title}</div>}
                    <div className={'text-gray-500 cursor-pointer'}
                         style={{ position: 'absolute', top: '25px', right: '65px' }}
                         onClick={remove}>
                        <FaRegTrashAlt />
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div className={'h-[100px]'}>
                        {todo.content}
                    </div>
                    <h2 className={'text-xl'}>Item</h2>
                    <hr/>
                    <ul className={'mt-4'}>
                        <li className={'text-base text-gray-500 flex items-center cursor-pointer'}>
                            <FaPlus className={'mr-2'} />
                            Add Item
                        </li>
                    </ul>
                    <h2 className={'text-xl mt-4'}>Files</h2>
                    <hr className={'mb-4'}/>
                    <div className={'flex'}>
                        <FileUploader multiple={true}
                                      onUploaded={uploadTodoFiles}
                                      onError={(data) => alert(data.errorMessage)}>
                            <div className={'w-[100px] h-[100px] flex items-center justify-center cursor-pointer border-2 rounded-md mr-2'}>
                                <FaPlusCircle className={'text-xl'}/>
                            </div>
                        </FileUploader>
                        {files.map(file =>
                            (
                                <div key={file.id} className={'w-[100px] h-[100px] flex items-center justify-center cursor-pointer border-2 rounded-md mr-2'}>
                                    <img src={file.blob} alt={file.fileName} />
                                </div>
                            )
                        )}
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}