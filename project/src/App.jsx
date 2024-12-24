import "./App.css";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import HomeWork from "./components/HomeWork.jsx";
import OfficeWork from "./components/OfficeWork.jsx";

export default function App() {
    return (
        <>
            <Header />
            <main className="container my-20">
                <HomeWork />
                <OfficeWork />
            </main>
            <Footer />
        </>
    );
}
