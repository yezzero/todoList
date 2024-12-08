import Image from "next/image"
import "../styles/home.css"

export default function Top() {
    return (
        <div className="top-container">
            <Image src="/img/logo.png" alt="Logo" width={150} height={75} />
        </div>
    )
}