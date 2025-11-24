import Home from './pages/Home';
import Services from './pages/Services';
import Platforms from './pages/Platforms';
import Process from './pages/Process';
import Portfolio from './pages/Portfolio';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Legal from './pages/Legal';
import BlogPost from './pages/BlogPost';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Home": Home,
    "Services": Services,
    "Platforms": Platforms,
    "Process": Process,
    "Portfolio": Portfolio,
    "Pricing": Pricing,
    "About": About,
    "Blog": Blog,
    "Contact": Contact,
    "FAQ": FAQ,
    "Legal": Legal,
    "BlogPost": BlogPost,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};