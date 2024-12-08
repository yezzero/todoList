"use client";

import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import Image from "next/image";
import Top from "@/components/Top";
import TodoItem from "@/components/TodoItem";

export default function Home() {
  const [todo, setTodo] = useState([]);
  const [done, setDone] = useState([]);
  const [inputText, setInputText] = useState("");

  const tenantId = "yezzero";

  const handleInputChange = (e) => setInputText(e.target.value);
  const handleKeyDown = (e) => e.key === "Enter" && handleAddTodo();

  // 할 일 목록을 가져오는 함수
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch(
          `https://assignment-todolist-api.vercel.app/api/${tenantId}/items`
        );
        if (response.ok) {
          const todos = await response.json();
          setTodo(todos.filter((item) => !item.isCompleted));
          setDone(todos.filter((item) => item.isCompleted));
        }
      } catch (error) {
        console.error("API 요청 실패:", error);
      }
    };

    fetchTodos();
  }, []);

  // 할 일을 추가하는 함수
  const handleAddTodo = async () => {
    if (inputText.trim()) {
      const newTodo = { name: inputText.trim() };
      try {
        const response = await fetch(
          `https://assignment-todolist-api.vercel.app/api/${tenantId}/items`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTodo),
          }
        );
        if (response.ok) {
          const addedTodo = await response.json();
          setTodo((prev) => [addedTodo, ...prev]);
          setInputText("");
        }
      } catch (error) {
        console.error("Todo 추가 실패:", error);
      }
    }
  };

  // 할 일의 isCompleted를 토글하는 함수
  const handleToggleCompletion = async (item, currentStatus) => {
    const { id, tenantId="yezzero", ...updatedItem } = item;
    const newItem = { ...updatedItem, isCompleted: !currentStatus };
    try {
      const response = await fetch(
        `https://assignment-todolist-api.vercel.app/api/${tenantId}/items/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newItem),
        }
      );
      if (response.ok) {
        const updatedTodo = await response.json();
        if (newItem.isCompleted) {
          setTodo((prev) => prev.filter((todo) => todo.id !== id));
          setDone((prev) => [updatedTodo, ...prev]);
        } else {
          setDone((prev) => prev.filter((done) => done.id !== id));
          setTodo((prev) => [updatedTodo, ...prev]);
        }
      }
    } catch (error) {
      console.error("상태 변경 실패:", error);
    }
  };

  return (
    <div className="home-container">
      <Top />
      <hr />
      <div className="home-input">
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="할 일을 입력해주세요."
        />
        <button onClick={handleAddTodo}>
          <FaPlus />
          <p>추가하기</p>
        </button>
      </div>

      <div className="home-content">
        <div className="home-todo">
          <h1 style={{ backgroundColor: "rgb(190, 242, 100)", color: "rgba(21, 128, 61, 1)" }}>
            TO DO
          </h1>
          {todo.length === 0 ? (
            <div className="home-todo-empty">
              <Image src="/img/emptyLogoTodo.png" alt="emptyTodo" height={200} width={200} />
              <p>
                할 일이 없어요. <br />
                TODO를 새롭게 추가해주세요!
              </p>
            </div>
          ) : (
            <div className="home-todo-list">
              {todo.map((item) => (
                <TodoItem
                  key={item.id}
                  item={item}
                  isDone={false}
                  onToggleCompletion={handleToggleCompletion}
                />
              ))}
            </div>
          )}
        </div>

        <div className="home-done">
          <h1 style={{ backgroundColor: "rgba(21, 128, 61, 1)", color: "rgba(252, 211, 77, 1)" }}>
            DONE
          </h1>
          {done.length === 0 ? (
            <div className="home-done-empty">
              <Image src="/img/emptyLogoDone.png" alt="emptyTodo" height={200} width={200} />
              <p>
                아직 다 한 일이 없어요. <br />
                해야 할 일을 체크해 보세요!
              </p>
            </div>
          ) : (
            <div className="home-done-list">
              {done.map((item) => (
                <TodoItem
                  key={item.id}
                  item={item}
                  isDone={true}
                  onToggleCompletion={handleToggleCompletion}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
