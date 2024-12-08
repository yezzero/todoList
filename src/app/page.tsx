"use client";  // 클라이언트 컴포넌트로 명시

import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import Top from "@/components/Top";

export default function Home() {
  const [todo, setTodo] = useState([]);  // 완료되지 않은 항목
  const [done, setDone] = useState([]);  // 완료된 항목
  const [inputText, setInputText] = useState("");  // 입력된 텍스트를 상태로 관리

  const tenantId = "yezzero";
  const handleInputChange = (e) => {
    setInputText(e.target.value);  // 입력값을 상태로 업데이트
  };

  // 페이지가 마운트될 때 API로부터 Todo 리스트를 받아오는 함수
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch(`https://assignment-todolist-api.vercel.app/api/${tenantId}/items`);
        if (response.ok) {
          const todos = await response.json();  // 응답 받은 데이터를 todos로 저장

          // isCompleted 값에 따라 분류
          const todoItems = todos.filter(item => !item.isCompleted);  // isCompleted가 false인 항목들
          const doneItems = todos.filter(item => item.isCompleted);  // isCompleted가 true인 항목들

          setTodo(todoItems);  // 완료되지 않은 항목은 todo 배열에 저장
          setDone(doneItems);  // 완료된 항목은 done 배열에 저장
        } else {
          console.error("Todo 목록 불러오기 실패:", response.statusText);
        }
      } catch (error) {
        console.error("API 요청 실패:", error);
      }
    };

    fetchTodos();  // 컴포넌트 마운트 시에 Todo 목록을 가져오는 함수 호출
  }, []);  // 빈 배열을 의존성으로 두어, 마운트될 때 한 번만 실행

  // 할 일 입력 함수
  const handleAddTodo = async () => {
    if (inputText.trim()) {
      // 새로운 Todo 항목을 API에 추가
      const newTodo = {
        name: inputText.trim(),
      };

      try {
        const response = await fetch(`https://assignment-todolist-api.vercel.app/api/${tenantId}/items`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newTodo),
        });

        if (response.ok) {
          const addedTodo = await response.json();
          setTodo((prevTodos) => [addedTodo, ...prevTodos]);  // 성공적으로 추가된 항목을 목록에 추가
          setInputText("");  // 입력란 초기화
        } else {
          console.error("Todo 추가 실패:", response.statusText);
        }
      } catch (error) {
        console.error("API 요청 실패:", error);
      }
    }
  };

  // 할 일 isCompleted 상태 토글 함수
  const handleToggleCompletion = async (item, currentStatus) => {
    const { id, tenantId = "yezzero", ...updatedItem } = item; // id는 제외하고 나머지 값을 updatedItem에 복사
    
    const newItem = { 
      ...updatedItem, 
      isCompleted: !currentStatus,  // 상태 변경
      memo: updatedItem.memo || "",  // memo가 없으면 빈 문자열
      imageUrl: updatedItem.imageUrl || "" // imageUrl이 없으면 빈 문자열
    };
  
    try {
      const response = await fetch(`https://assignment-todolist-api.vercel.app/api/${tenantId}/items/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),  // id를 제외한 updatedItem을 전송
      });
  
      if (response.ok) {
        const updatedTodo = await response.json();
        
        // 상태 업데이트 로직
        if (newItem.isCompleted) {
          setTodo((prevTodos) => prevTodos.filter(todo => todo.id !== id));  // todo에서 제거
          setDone((prevDone) => {
            // 이전 상태에서 중복된 항목이 없도록 확인하고 추가
            if (!prevDone.find(doneItem => doneItem.id === updatedTodo.id)) {
              return [updatedTodo, ...prevDone];
            }
            return prevDone;
          });  // done에 추가
        } else {
          setDone((prevDone) => prevDone.filter(done => done.id !== id));  // done에서 제거
          setTodo((prevTodos) => {
            // 이전 상태에서 중복된 항목이 없도록 확인하고 추가
            if (!prevTodos.find(todoItem => todoItem.id === updatedTodo.id)) {
              return [updatedTodo, ...prevTodos];
            }
            return prevTodos;
          });  // todo에 추가
        }
      } else {
        console.error("상태 변경 실패:", item, newItem, response.statusText);
      }
    } catch (error) {
      console.error("API 요청 실패:", error);
    }
  };
  
  // 할 일 삭제
  const handleDelete = async (e, id) => {
    e.stopPropagation();  // 클릭 이벤트의 전파를 막음
  
    try {
      const response = await fetch(`https://assignment-todolist-api.vercel.app/api/${tenantId}/items/${id}`, {
        method: "DELETE",  // DELETE 요청
      });
  
      if (response.ok) {
        // 삭제가 성공하면 해당 항목을 todo나 done에서 제거
        setTodo((prevTodos) => prevTodos.filter(todo => todo.id !== id));  // todo에서 제거
        setDone((prevDone) => prevDone.filter(done => done.id !== id));  // done에서 제거
        console.log("항목 삭제 성공");
      } else {
        console.error("삭제 실패:", response.statusText);
      }
    } catch (error) {
      console.error("API 요청 실패:", error);
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
          placeholder="할 일을 입력해주세요."
        />
        <button onClick={handleAddTodo}><FaPlus />추가하기</button>
      </div>

      <div className="home-content">
        <div className="home-todo">
          <h1>TO DO</h1>
          <div className="home-todo-list">
            {todo.map((item) => (
              <div
                key={item.id}
                className="todo-container"
                onClick={() => handleToggleCompletion(item, false)}  // todo를 클릭하면 완료로 변경
              >
                <div className="todo-circle"><FaCheck /></div>
                <p>{item.name}</p>
                {/* <button onClick={(e) => handleDelete(e, item.id)}>삭제</button> */}
              </div>
            ))}
          </div>
        </div>

        <div className="home-done">
          <h1>DONE</h1>
          <div className="home-done-list">
            {done.map((item) => (
              <div
                key={item.id}
                className="done-container"
                onClick={() => handleToggleCompletion(item, true)}  // done을 클릭하면 미완료로 변경
              >
                <div className="done-circle"><FaCheck /></div>
                <p>{item.name}</p>
                {/* <button onClick={(e) => handleDelete(e, item.id)}>삭제</button> */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Todo({ text }) {
  return (
    <div className="todo-container">
      <div className="todo-circle" />
      <p>{text}</p>
    </div>
  );
}

function Done({ text }) {
  return (
    <div className="done-container">
      <div className="done-circle" />
      <p>{text}</p>
    </div>
  );
}
