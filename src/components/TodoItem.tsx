import { FaCheck } from "react-icons/fa";

export default function TodoItem({ item, isDone, onToggleCompletion }) {
    return (
        <div className={isDone ? "done-container" : "todo-container"}>
            <div
                className={isDone ? "done-circle" : "todo-circle"}
                onClick={() => onToggleCompletion(item, isDone)}
            >
                <FaCheck />
            </div>
            <p>{item.name}</p>
        </div>
    );
}
