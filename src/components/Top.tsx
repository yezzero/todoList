import { useState, useEffect } from "react";
import Image from "next/image";
import "../styles/home.css";

export default function Top() {
    const [windowWidth, setWindowWidth] = useState(0); // 초기 상태값 설정
    const [logoSrc, setLogoSrc] = useState("/img/logo.png"); // 기본 이미지 경로 설정

    // 로고 클릭 시 새로고침
    const handleLogoClick = () => {
        window.location.href = "/"; // 현재 페이지를 새로고침
    };

    // 화면 크기 감지 및 로고 변경 함수
    useEffect(() => {
        const updateLogo = () => {
            const width = window.innerWidth;
            setWindowWidth(width);
            setLogoSrc(width < 640 ? "/img/logoSmall.png" : "/img/logo.png");
        };

        updateLogo();
        window.addEventListener("resize", updateLogo);

        return () => {
            window.removeEventListener("resize", updateLogo);
        };
    }, []);

    return (
        <div className="top-container">
            <Image
                src={logoSrc}
                alt="Logo"
                width={windowWidth < 640 ? 75 : 150}
                height={75}
                onClick={handleLogoClick}
            />
        </div>
    );
}
