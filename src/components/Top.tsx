import Image from "next/image"
import "../styles/home.css"

export default function Top() {
    const handleLogoClick = () => {
        window.location.href = "/"; // 현재 페이지를 새로고침
    };

    return (
        <div className="top-container">
            <Image src="/img/logo.png" alt="Logo" width={150} height={75} onClick={handleLogoClick} />
        </div>
    )
}