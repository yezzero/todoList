// components/TodoItem.js
import { useRouter } from "next/navigation";
import { FaCheck } from "react-icons/fa";

export default function TodoItem({ item, isDone, onToggleCompletion }) {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/items/${item.id}`); // 해당 항목의 ID를 포함한 경로로 이동
    };

    return (
        <div
        className={isDone ? "done-container" : "todo-container"}
        onClick={handleClick} // 항목 클릭 시 경로 이동
        >
            <div
                className={isDone ? "done-circle" : "todo-circle"}
                onClick={(e) => {
                e.stopPropagation(); // 클릭 이벤트 전파 방지 (항목 이동 방지)
                onToggleCompletion(item, isDone);
                }}
            >
                <FaCheck />
            </div>
            <p>{item.name}</p>
        </div>
    );
}
