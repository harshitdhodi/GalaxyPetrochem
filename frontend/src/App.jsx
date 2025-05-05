import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import Layout from './layout/Layout';
import './App.css';

// Loading component for Suspense
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
  </div>
);


// Website Components - Lazy loaded
const Navbar = lazy(() => import('./website/Navbar'));
const HomePage = lazy(() => import('./website/pages/HomePage'));
const ParentProductCategory = lazy(() => import('./website/pages/ParentProductCategory'));

const ProductCategoryPage = lazy(() => import('./website/pages/ProductCategoryPage'));

const AlphabetsBaseCategory = lazy(() => import('./website/componets/alphabetbaseCategory/AlphabetsBaseCategory'));

const ContactPage = lazy(() => import('./website/pages/ContactPage'));
const BlogPage = lazy(() => import('./website/pages/BlogPage'));


// Dashboard Components - Lazy loaded
const DashboardPage = lazy(() => import('./dashboard/DashboardPage'));
const AdminLogin = lazy(() => import('./login/LoginPage'));

// Chemical Management - Lazy loaded
const ChemicalTable = lazy(() => import('./chemical/ChemicalTablePage'));

const ChemicalTypes = lazy(() => import('./chemical/ChemicalTypesTable'));
const SearchSuppliers = lazy(() => import('./chemical/SearchSuppliers'));
const UnitsPage = lazy(() => import('./chemical/UnitTable'));
const CategoriesPage = lazy(() => import('./chemical/ChemicalCategoryPage'));
const CategoryForm = lazy(() => import('./chemical/chemicalCategory/CategoryForm'));
const UpdateCategoryForm = lazy(() => import('./chemical/chemicalCategory/EditCategoryForm'));
import { ChemicalProvider } from './chemical/ChemicalContext';

// Supplier Management - Lazy loaded
const SuppliersTable = lazy(() => import('./supplier/SupplierTablePage'));
const SupplierForm = lazy(() => import('./supplier/SupplierForm'));
const ChemicalMapping = lazy(() => import('./supplier/ChemicalMapping'));
const ChemicalSearch = lazy(() => import('./supplier/SearchChamicals'));

// Customer Management - Lazy loaded
const CustomerTable = lazy(() => import('./customer/CustomerTable'));
const CustomerForm = lazy(() => import('./customer/CustomerForm'));
const CustomerChemicalMapping = lazy(() => import('./customer/ChemicalMapping'));

// Email Management - Lazy loaded
const SMTPTable = lazy(() => import('./email/smtp_setting/smtpTable'));
const EditSMTP = lazy(() => import('./email/smtp_setting/editForm'));
const CreateSMTP = lazy(() => import('./email/smtp_setting/CreateSMTP'));
const TemplateTable = lazy(() => import('./email/template/TemplateTable'));
const AddTemplateForm = lazy(() => import('./email/template/AddTemplate'));
const EditTemplateForm = lazy(() => import('./email/template/EditTemplate'));

// Inquiry Management - Lazy loaded
const InquiryList = lazy(() => import('./inquiry/InquiryTable'));
const AddInquiryForm = lazy(() => import('./inquiry/AddInquiry'));
const EditInquiryForm = lazy(() => import('./inquiry/EditInquiry'));
const SourceTable = lazy(() => import('./inquiry/source/SourceTable'));
const StatusTable = lazy(() => import('./inquiry/status/StatusTable'));

// Blog Management - Lazy loaded
const BlogCategory = lazy(() => import('./BlogCategory/BlogCategoryTable'));
const Blogcategoryform = lazy(() => import('./BlogCategory/BlogCategoryForm'));
const BlogTable = lazy(() => import('./blog/BlogPage'));
const BlogForm = lazy(() => import('./blog/BlogForm'));
const Hello = lazy(() => import('./Hello'));
const Saperator = lazy(() => import('./website/Saparator'));
const BlogSaparator = lazy(() => import('./website/pages/BlogSaparator'));
const EmailForm = lazy(() => import('./email/emailForm/EmailForm'));
const EditCustomerForm = lazy(() => import('./customer/EditCustomerForm'));
const EditSupplierForm = lazy(() => import('./supplier/EditSupplierForm'));
const ProductSearchBar = lazy(() => import('./website/componets/productSearch/ProductSearchBar'));
const ProductInquiryTable = lazy(() => import('./websiteBackend/productInquiry/ProductInquiry'));
const AboutUsTable = lazy(() => import('./websiteBackend/aboutus/AboutUsTable'));
const AboutUsForm = lazy(() => import('./websiteBackend/aboutus/AboutUsForm'));
const BannerTable = lazy(() => import('./websiteBackend/banner/BannerTable'));
const AddBannerForm = lazy(() => import('./websiteBackend/banner/AddBannerForm'));
const EditBannerForm = lazy(() => import('./websiteBackend/banner/EditBannerForm'));
const AboutDescription = lazy(() => import('./website/componets/home/AboutUs'));
const Introduction = lazy(() => import('./website/pages/Introduction'));
const MainContent = lazy(() => import('./website/componets/Introduction/MainContent'));
const CareerForm = lazy(() => import('./website/pages/Career'));

const CareerTable = lazy(() => import('./websiteBackend/career/CareerTable'));
const CareerAdminForm = lazy(() => import('./websiteBackend/career/CareerForm'));
const EmailCategoryParent = lazy(() => import('./email/emailCategory/EmailCategoryParent'));
const AdvanceSearch = lazy(() => import('./website/pages/AdvanceSearchPage'));
const Logo = lazy(() => import('./websiteBackend/companyLogo/CompanyLogoTable'));
const LogoForm = lazy(() => import('./websiteBackend/companyLogo/LogoForm'));
const ContactInfoForm = lazy(() => import('./websiteBackend/contactInfo/ContactInfoData'));
const MenuListingForm = lazy(() => import('./websiteBackend/MenuListing/MenuListingForm'));
const MenuListingTable = lazy(() => import('./websiteBackend/MenuListing/MenuListingTable'));
const StaticMetaForm = lazy(() => import('./websiteBackend/staticMetaKeyword/StaticMetaForm'));
const MetaList = lazy(() => import('./websiteBackend/staticMetaKeyword/StaticTable'));
const ImageUploadForm = lazy(() => import('./website/componets/slideshow/SlideShowForm'));
const SlideShowTable = lazy(() => import('./website/componets/slideshow/SlideShowTable'));
const PrivacyPolicy = lazy(() => import('./website/pages/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('./website/pages/TermsandCondition'));
const WhatsUpInfoTable = lazy(() => import('./websiteBackend/whatsUpInfo/WhatsUpTable'));
const WhatsUpInfoForm = lazy(() => import('./websiteBackend/whatsUpInfo/WhatUpForm'));
const EventForm = lazy(() => import('./websiteBackend/event/Events'));
const BlogCardForm = lazy(() => import('./websiteBackend/blogCard/BlogCard'));
const NavigationLinkTable = lazy(() => import('./websiteBackend/navigationLinks/NavigationLinkTable'));
const NavigationLinkForm = lazy(() => import('./websiteBackend/navigationLinks/NavigationLinkForm'));
const CatalogueTable = lazy(() => import('./websiteBackend/catalogue/CatalogueTable'));
const CatalogueForm = lazy(() => import('./websiteBackend/catalogue/CatalogueForm'));
const PrivacyForm = lazy(() => import('./websiteBackend/privacy/PrivacyAndTerms'));
const TermsConditionForm = lazy(() => import('./websiteBackend/privacy/TermsCondtion'));
const CareerInfoForm = lazy(() => import('./websiteBackend/career/CareerInfoForm'));

// Non-lazy imports
import useDocumentTitle from './websiteBackend/staticMetaKeyword/DynamicMeta';
import CriticalStyles from './website/componets/CriticalStyles';
// import ProductForm from './products/AddProducts';
import ProductTable from './petrochemProduct/ProductTable';
// import EditProductForm from './products/EditProduct';
import SearchResultsTable from './website/pages/AdvanceSearchProduct';
import BrandsPage from './website/pages/Brands';
import PetrochemicalAboutUs from './website/pages/AboutUs';
import BrandsList from './websiteBackend/brand/BrandsTable';
import CompanyForm from './websiteBackend/copanyInfo/CompanyInfoForm';
import TestimonialManager from './websiteBackend/testimonial/testimonial';
import ProductForm from './petrochemProduct/ProductForm';
import UpdatePetrochemicalProduct from './petrochemProduct/product-form/EditProductForm';
import IndustryManager from './websiteBackend/experties/IndustryManager';
import MissionVisionForm from './websiteBackend/missionVision/MissionVisionForm';
import EditAboutUsForm from './websiteBackend/aboutus/EditAboutUs';

// Auth Components
const PrivateRoute = ({ children }) => {
  const token = Cookies.get('jwt');
  return token ? children : <Navigate to="/login" replace />;
};

const LoginRoute = () => {
  const token = Cookies.get('jwt');
  return token ? <Navigate to="/dashboard" /> : <AdminLogin />;
};

// Dynamic meta function
const AppContent = () => {
  useDocumentTitle(); // Use the hook here
<CriticalStyles/>
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Outlet /> {/* Render the rest of the app */}
    </Suspense>
  );
};

// Main App Component
function App() {
  
  const router = createBrowserRouter([
    {
      path: '/',
      element: <AppContent />, // Use the AppContent here
      children: [
        // Public Routes (Website)
        {
          path: '/',
          element: (
            <Suspense fallback={<LoadingFallback />}>
              <Navbar />
            </Suspense>
          ),
          children: [
            { index: true, element: <Suspense fallback={<LoadingFallback />}><HomePage /></Suspense> },
            { path: 'categories', element: <Suspense fallback={<LoadingFallback />}><ProductCategoryPage /></Suspense> },
            // { path: 'ParentProductCategory', element: <Suspense fallback={<LoadingFallback />}><ParentProductCategory /></Suspense> },
            { path: 'alphabetsbaseCategory', element: <Suspense fallback={<LoadingFallback />}><AlphabetsBaseCategory /></Suspense> },
            { path: ':categorySlug/:slug', element: <Suspense fallback={<LoadingFallback />}><Saperator /></Suspense> },
            { path: 'about-us', element: <Suspense fallback={<LoadingFallback />}><PetrochemicalAboutUs /></Suspense> },
            { path: 'contact-us', element: <Suspense fallback={<LoadingFallback />}><ContactPage /></Suspense> },
            { path: 'blogs', element: <Suspense fallback={<LoadingFallback />}><BlogPage /></Suspense> },
            { path: 'blog/:slug', element: <Suspense fallback={<LoadingFallback />}><BlogSaparator /></Suspense> },
            { path: ':slug', element: <Suspense fallback={<LoadingFallback />}><Hello /></Suspense> },
            { path: ':blog/:slug', element: <Suspense fallback={<LoadingFallback />}><BlogSaparator /></Suspense> },
            { path: '/search', element: <Suspense fallback={<LoadingFallback />}><ProductSearchBar /></Suspense> },
            { path: '/about', element: <Suspense fallback={<LoadingFallback />}><AboutDescription /></Suspense> },
            { path: '/introduction', element: <Suspense fallback={<LoadingFallback />}><Introduction /></Suspense> },
            { path: '/vision-mission', element: <Suspense fallback={<LoadingFallback />}><MainContent /></Suspense> },
            { path: '/products', element: <Suspense fallback={<LoadingFallback />}><ParentProductCategory /></Suspense> },
          
         

            // brands section 
            { path: '/brands', element: <Suspense fallback={<LoadingFallback />}><BrandsPage /></Suspense> },
            { path: '/advance-search', element: <Suspense fallback={<LoadingFallback />}><AdvanceSearch /></Suspense> },
            { path: '/privacy-policy', element: <Suspense fallback={<LoadingFallback />}><PrivacyPolicy /></Suspense> },
            { path: '/terms-and-conditions', element: <Suspense fallback={<LoadingFallback />}><TermsAndConditions /></Suspense> },
            { path: '/product-search', element: <Suspense fallback={<LoadingFallback />}><SearchResultsTable /></Suspense> },
           
            // { path: '*', element: <NotFoundPage /> }
          ]
        },
        // Authentication Route
        { 
          path: 'login', 
          element: <Suspense fallback={<LoadingFallback />}><LoginRoute /></Suspense> 
        },
        
        // Protected Routes (Dashboard)
        {
          path: '',
          element: (
            <PrivateRoute>
              <Suspense fallback={<LoadingFallback />}>
                <Layout />
              </Suspense>
            </PrivateRoute>
          ),
          children: [
            { path: 'dashboard', element: <Suspense fallback={<LoadingFallback />}><DashboardPage /></Suspense> },
            // Chemical Management Routes
            {
              path: 'chemical-table',
              element: (
                <ChemicalProvider>
                  <Suspense fallback={<LoadingFallback />}><ChemicalTable /></Suspense>
                </ChemicalProvider>
              )
            },
            { path: '/industry-experties', element: <Suspense fallback={<LoadingFallback />}><IndustryManager /></Suspense> },
            { path: '/mission-vision', element: <Suspense fallback={<LoadingFallback />}><MissionVisionForm /></Suspense> },

            { path: '/products-table', element: <Suspense fallback={<LoadingFallback />}><ProductTable /></Suspense> },

            { path: '/products/add', element: <Suspense fallback={<LoadingFallback />}><ProductForm /></Suspense> },
            { path: '/products/edit/:id', element: <Suspense fallback={<LoadingFallback />}><UpdatePetrochemicalProduct /></Suspense> },
 
            { path: '/brands-list', element: <Suspense fallback={<LoadingFallback />}><BrandsList /></Suspense> },
            { path: 'testimonial-table', element: <Suspense fallback={<LoadingFallback />}><TestimonialManager /></Suspense> },
            { path: '/company-info-form', element: <Suspense fallback={<LoadingFallback />}><CompanyForm /></Suspense> },
            { path: 'chemical-types', element: <Suspense fallback={<LoadingFallback />}><ChemicalTypes /></Suspense> },
            { path: 'chemical-category', element: <Suspense fallback={<LoadingFallback />}><CategoriesPage /></Suspense> },
            { path: 'chemical-category-form', element: <Suspense fallback={<LoadingFallback />}><CategoryForm /></Suspense> },
            {
              path: 'edit-chemical-category/:categoryId/:subCategoryId?/:subSubCategoryId?',
              element: <Suspense fallback={<LoadingFallback />}><UpdateCategoryForm /></Suspense>
            },
            { path: 'unit', element: <Suspense fallback={<LoadingFallback />}><UnitsPage /></Suspense> },
            { path: 'search-suppliers', element: <Suspense fallback={<LoadingFallback />}><SearchSuppliers /></Suspense> },

            // Supplier Management Routes
            { path: 'supplier-table', element: <Suspense fallback={<LoadingFallback />}><SuppliersTable /></Suspense> },
            { path: 'supplier-form', element: <Suspense fallback={<LoadingFallback />}><SupplierForm /></Suspense> },
            { path: 'chemical-mapping', element: <Suspense fallback={<LoadingFallback />}><ChemicalMapping /></Suspense> },
            { path: 'chemical-search', element: <Suspense fallback={<LoadingFallback />}><ChemicalSearch /></Suspense> },
            { path: 'edit-supplier-form/:id', element: <Suspense fallback={<LoadingFallback />}><EditSupplierForm /></Suspense> },

            // Customer Management Routes
            { path: 'customer-table', element: <Suspense fallback={<LoadingFallback />}><CustomerTable /></Suspense> },
            { path: 'customer-form', element: <Suspense fallback={<LoadingFallback />}><CustomerForm /></Suspense> },
            { path: 'customer-chemical-mapping', element: <Suspense fallback={<LoadingFallback />}><CustomerChemicalMapping /></Suspense> },
            { path: 'edit-customer-form/:id', element: <Suspense fallback={<LoadingFallback />}><EditCustomerForm /></Suspense> },

            // Email Management Routes
            { path: 'smtp-table', element: <Suspense fallback={<LoadingFallback />}><SMTPTable /></Suspense> },
            { path: 'add-smtp', element: <Suspense fallback={<LoadingFallback />}><CreateSMTP /></Suspense> },
            { path: 'edit-smtp-form/:id', element: <Suspense fallback={<LoadingFallback />}><EditSMTP /></Suspense> },
            { path: 'email-template-table', element: <Suspense fallback={<LoadingFallback />}><TemplateTable /></Suspense> },
            { path: 'add-template', element: <Suspense fallback={<LoadingFallback />}><AddTemplateForm /></Suspense> },
            { path: 'edit-template/:id', element: <Suspense fallback={<LoadingFallback />}><EditTemplateForm /></Suspense> },
            { path: 'email-form', element: <Suspense fallback={<LoadingFallback />}><EmailForm /></Suspense> },
            { path: 'email-category', element: <Suspense fallback={<LoadingFallback />}><EmailCategoryParent /></Suspense> },
            { path: 'email-category-form', element: <Suspense fallback={<LoadingFallback />}><EmailCategoryParent /></Suspense> },
            { path: 'edit-email-category/:id', element: <Suspense fallback={<LoadingFallback />}><EmailCategoryParent /></Suspense> },
            
            // Inquiry Management Routes
            { path: 'inquiry-list', element: <Suspense fallback={<LoadingFallback />}><InquiryList /></Suspense> },
            { path: 'add-inquiry', element: <Suspense fallback={<LoadingFallback />}><AddInquiryForm /></Suspense> },
            { path: 'edit-inquiry/:id', element: <Suspense fallback={<LoadingFallback />}><EditInquiryForm /></Suspense> },
            { path: 'source-table', element: <Suspense fallback={<LoadingFallback />}><SourceTable /></Suspense> },
            { path: 'status-table', element: <Suspense fallback={<LoadingFallback />}><StatusTable /></Suspense> },

            // Blog Management Routes
            { path: 'blog-category-table', element: <Suspense fallback={<LoadingFallback />}><BlogCategory /></Suspense> },
            { path: 'blog-category-form', element: <Suspense fallback={<LoadingFallback />}><Blogcategoryform /></Suspense> },
            { path: 'edit-blog-category-form/:id', element: <Suspense fallback={<LoadingFallback />}><Blogcategoryform /></Suspense> },
            { path: 'blog-table', element: <Suspense fallback={<LoadingFallback />}><BlogTable /></Suspense> },
            { path: 'blog-form', element: <Suspense fallback={<LoadingFallback />}><BlogForm /></Suspense> },
            { path: 'edit-blog-form/:id', element: <Suspense fallback={<LoadingFallback />}><BlogForm /></Suspense> },

            // Product Inquiry Routes
            { path: 'product-inquiry-table', element: <Suspense fallback={<LoadingFallback />}><ProductInquiryTable /></Suspense> },

            // About Us Routes
            { path: 'about-us-table', element: <Suspense fallback={<LoadingFallback />}><AboutUsTable /></Suspense> },
            { path: 'about-us-form', element: <Suspense fallback={<LoadingFallback />}><AboutUsForm /></Suspense> },
            { path: 'edit-about-us-form/:id', element: <Suspense fallback={<LoadingFallback />}><EditAboutUsForm /></Suspense> },

            // Banner Routes
            { path: 'banner-table', element: <Suspense fallback={<LoadingFallback />}><BannerTable /></Suspense> },
            { path: 'add-banner', element: <Suspense fallback={<LoadingFallback />}><AddBannerForm /></Suspense> },
            { path: 'edit-banner-form/:id', element: <Suspense fallback={<LoadingFallback />}><EditBannerForm /></Suspense> },
          
         
          
            // Career Management Routes
            { path: 'career-table', element: <Suspense fallback={<LoadingFallback />}><CareerTable /></Suspense> },
            { path: 'career/add', element: <Suspense fallback={<LoadingFallback />}><CareerAdminForm /></Suspense> },
            { path: 'career/edit/:id', element: <Suspense fallback={<LoadingFallback />}><CareerAdminForm /></Suspense> },
            { path: 'career-info-form', element: <Suspense fallback={<LoadingFallback />}><CareerInfoForm /></Suspense> },

            // Logo Management Routes
            { path: 'logo-table', element: <Suspense fallback={<LoadingFallback />}><Logo /></Suspense> },
            { path: 'add-logo', element: <Suspense fallback={<LoadingFallback />}><LogoForm /></Suspense> },
            { path: 'edit-logo/:id', element: <Suspense fallback={<LoadingFallback />}><LogoForm /></Suspense> },

            // Contact Info Management Routes
            { path: 'contact-info-table', element: <Suspense fallback={<LoadingFallback />}><ContactInfoForm /></Suspense> },
            // { path: 'contact-info/add', element: <Suspense fallback={<LoadingFallback />}><ContactForm /></Suspense> },
            // { path: 'contact-info/edit/:id', element: <Suspense fallback={<LoadingFallback />}><ContactForm /></Suspense> },
       
            // Menu Listing Routes
            { path: 'menu-listing-table', element: <Suspense fallback={<LoadingFallback />}><MenuListingTable /></Suspense> },
            { path: 'menu-listing-form', element: <Suspense fallback={<LoadingFallback />}><MenuListingForm /></Suspense> },
            { path: 'menu-listing-form/:id', element: <Suspense fallback={<LoadingFallback />}><MenuListingForm /></Suspense> },

            // Meta Routes
            { path: 'meta-table', element: <Suspense fallback={<LoadingFallback />}><MetaList /></Suspense> },
            { path: 'meta-form', element: <Suspense fallback={<LoadingFallback />}><StaticMetaForm /></Suspense> },
            { path: 'edit-meta-form/:id', element: <Suspense fallback={<LoadingFallback />}><StaticMetaForm /></Suspense> },

            // Slide show
            { path: 'slideShow-form', element: <Suspense fallback={<LoadingFallback />}><ImageUploadForm /></Suspense> },
            { path: 'edit-image/:id', element: <Suspense fallback={<LoadingFallback />}><ImageUploadForm /></Suspense> },
            { path: 'slideShow-table', element: <Suspense fallback={<LoadingFallback />}><SlideShowTable /></Suspense> },

            // WhatsUp info
            { path: 'whatsUpInfo-table', element: <Suspense fallback={<LoadingFallback />}><WhatsUpInfoTable /></Suspense> },
            { path: 'whatsUpInfo-form', element: <Suspense fallback={<LoadingFallback />}><WhatsUpInfoForm /></Suspense> },

            // Events
            { path: 'events', element: <Suspense fallback={<LoadingFallback />}><EventForm /></Suspense> }, 

            // Blog card
            { path: 'blogCard', element: <Suspense fallback={<LoadingFallback />}><BlogCardForm /></Suspense> },
      
            // Navigation Link
            { path: 'navigationLink', element: <Suspense fallback={<LoadingFallback />}><NavigationLinkTable /></Suspense> },
            { path: 'navigationLink-form', element: <Suspense fallback={<LoadingFallback />}><NavigationLinkForm /></Suspense> },  
            { path: 'edit-navigation-link/:id', element: <Suspense fallback={<LoadingFallback />}><NavigationLinkForm /></Suspense> },
        
            // Catalogue Management Routes
            { path: 'catalogue-table', element: <Suspense fallback={<LoadingFallback />}><CatalogueTable /></Suspense> },
            { path: 'catalogue-form', element: <Suspense fallback={<LoadingFallback />}><CatalogueForm /></Suspense> },
            { path: 'edit-catalogue/:id', element: <Suspense fallback={<LoadingFallback />}><CatalogueForm /></Suspense> },
        
            // Privacy Policy Routes
            { path: 'privacypolicy-terms', element: <Suspense fallback={<LoadingFallback />}><PrivacyForm /></Suspense> },
            { path: 'terms-and-conditions-form', element: <Suspense fallback={<LoadingFallback />}><TermsConditionForm /></Suspense> },
         
          
         
          ]
        }
      ]
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;