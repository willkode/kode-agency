/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import AISystems from './pages/AISystems';
import APIDevelopment from './pages/APIDevelopment';
import About from './pages/About';
import Admin from './pages/Admin';
import AdminBlogEdit from './pages/AdminBlogEdit';
import AdminPortfolioEdit from './pages/AdminPortfolioEdit';
import AppDevelopment from './pages/AppDevelopment';
import AppFoundation from './pages/AppFoundation';
import Apply from './pages/Apply';
import Base44ER from './pages/Base44ER';
import BaseCMS from './pages/BaseCMS';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Branding from './pages/Branding';
import BuildSprint from './pages/BuildSprint';
import CROServices from './pages/CROServices';
import ClientAppReviews from './pages/ClientAppReviews';
import ClientPortal from './pages/ClientPortal';
import Contact from './pages/Contact';
import ContentMarketing from './pages/ContentMarketing';
import DevOps from './pages/DevOps';
import EmailMarketing from './pages/EmailMarketing';
import FAQ from './pages/FAQ';
import FullFunnelMarketing from './pages/FullFunnelMarketing';
import Home from './pages/Home';
import Legal from './pages/Legal';
import MVPDevelopment from './pages/MVPDevelopment';
import MobileAppConversion from './pages/MobileAppConversion';
import PaidAds from './pages/PaidAds';
import Platforms from './pages/Platforms';
import Portfolio from './pages/Portfolio';
import Pricing from './pages/Pricing';
import Process from './pages/Process';
import ProjectTasks from './pages/ProjectTasks';
import PublicQuote from './pages/PublicQuote';
import RefundPolicy from './pages/RefundPolicy';
import SEOServices from './pages/SEOServices';
import SaaSDevelopment from './pages/SaaSDevelopment';
import Services from './pages/Services';
import ThankYou from './pages/ThankYou';
import UIUXDesign from './pages/UIUXDesign';
import WebsiteDevelopment from './pages/WebsiteDevelopment';
import FrontendExporter from './pages/FrontendExporter';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AISystems": AISystems,
    "APIDevelopment": APIDevelopment,
    "About": About,
    "Admin": Admin,
    "AdminBlogEdit": AdminBlogEdit,
    "AdminPortfolioEdit": AdminPortfolioEdit,
    "AppDevelopment": AppDevelopment,
    "AppFoundation": AppFoundation,
    "Apply": Apply,
    "Base44ER": Base44ER,
    "BaseCMS": BaseCMS,
    "Blog": Blog,
    "BlogPost": BlogPost,
    "Branding": Branding,
    "BuildSprint": BuildSprint,
    "CROServices": CROServices,
    "ClientAppReviews": ClientAppReviews,
    "ClientPortal": ClientPortal,
    "Contact": Contact,
    "ContentMarketing": ContentMarketing,
    "DevOps": DevOps,
    "EmailMarketing": EmailMarketing,
    "FAQ": FAQ,
    "FullFunnelMarketing": FullFunnelMarketing,
    "Home": Home,
    "Legal": Legal,
    "MVPDevelopment": MVPDevelopment,
    "MobileAppConversion": MobileAppConversion,
    "PaidAds": PaidAds,
    "Platforms": Platforms,
    "Portfolio": Portfolio,
    "Pricing": Pricing,
    "Process": Process,
    "ProjectTasks": ProjectTasks,
    "PublicQuote": PublicQuote,
    "RefundPolicy": RefundPolicy,
    "SEOServices": SEOServices,
    "SaaSDevelopment": SaaSDevelopment,
    "Services": Services,
    "ThankYou": ThankYou,
    "UIUXDesign": UIUXDesign,
    "WebsiteDevelopment": WebsiteDevelopment,
    "FrontendExporter": FrontendExporter,
}

export const pagesConfig = {
    mainPage: "Home",
    Pages: PAGES,
    Layout: __Layout,
};