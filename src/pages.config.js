import Home from './pages/Home';
import Services from './pages/Services';
import Platforms from './pages/Platforms';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Services": Services,
    "Platforms": Platforms,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};