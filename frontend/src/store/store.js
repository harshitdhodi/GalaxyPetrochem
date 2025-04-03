import { configureStore } from '@reduxjs/toolkit';
import { chemicalApi } from '../slice/supplierSlice/chemicalBySupplier';
import { supplierApi } from '../slice/supplierSlice/SupplierSlice';
import { api } from '../slice/customerSlice/customerApiSlice';
import { chemicalTypeApi } from '@/slice/chemicalType/chemicalType';
import { unitApi } from '@/slice/chemicalUnit/unitSlice';
import { chemicalCategoryApi } from '@/slice/chemicalSlice/chemicalCategory';
import { smtpApi } from '@/slice/smtpSlice/smtp';
import {navigationLinkApi } from '@/slice/navigationLink/navigationSlice';  
import { inquiryApi } from '@/slice/inquiry/inquiry';
import { followupApi } from '@/slice/followUp/followUp';
import { catalogueApi } from '@/slice/catalogue/catalogueslice';
import templateApi from '@/slice/template/emailTemplate';
import { statusApi } from '@/slice/status/status';
import { sourceApi } from '@/slice/source/source';
import { adminApi } from '@/slice/login/adminlogin';
import { blogCategoryApi } from '@/slice/blog/blogCategory';
import { blogApi } from '@/slice/blog/blog';
import { emailApi } from '@/slice/smtpSlice/email';
import { productInquiryApi } from '@/slice/inquiry/productInquiry';
import { aboutUsApi } from '../slice/aboutUs/aboutUs';
import { bannerApi } from '@/slice/banner/banner';
import { careerApi } from '../slice/career/CareerForm';
import { worldwideApi } from '../slice/worldwide/worldwide';
import { emailCategoryApi } from '../slice/emailCategory/emailCategory';
import { logoApi } from '../slice/logo/LogoSlice';
import { contactInfoApi } from '../slice/contactInfo/contactInfo';
import { metaApi } from '@/slice/staticMeta/staticMeta';
import { menuListingApi } from '@/slice/menuListing/menuList';
import{whatsUpInfoApi} from '@/slice/whatsUpInfo/WhatsUpInfo';

const store = configureStore({
  reducer: {
    [chemicalApi.reducerPath]: chemicalApi.reducer, // RTK Query reducer for chemicals
    [supplierApi.reducerPath]: supplierApi.reducer, // RTK Query reducer for suppliers
    [api.reducerPath]: api.reducer, // RTK Query reducer for customers
    [chemicalTypeApi.reducerPath]: chemicalTypeApi.reducer, // RTK Query reducer for chemical types
    [unitApi.reducerPath]: unitApi.reducer, // RTK Query reducer for units
    [chemicalCategoryApi.reducerPath]: chemicalCategoryApi.reducer, // RTK Query reducer for chemical categories
    [smtpApi.reducerPath]: smtpApi.reducer, // RTK Query reducer for SMTP
    [inquiryApi.reducerPath]: inquiryApi.reducer, // RTK Query reducer for inquiries
    [followupApi.reducerPath]: followupApi.reducer, // Add followupApi reducer
    [templateApi.reducerPath]: templateApi.reducer, // Email template reducer
    [statusApi.reducerPath]: statusApi.reducer, // RTK Query reducer for status
    [sourceApi.reducerPath]: sourceApi.reducer, // RTK Query reducer for source
    [adminApi.reducerPath]:adminApi.reducer,
    [blogCategoryApi.reducerPath]:blogCategoryApi.reducer,
    [blogApi.reducerPath]:blogApi.reducer,
    [emailApi.reducerPath]:emailApi.reducer,
    [productInquiryApi.reducerPath]: productInquiryApi.reducer, // RTK Query reducer for product inquiries
    [aboutUsApi.reducerPath]: aboutUsApi.reducer,
    [bannerApi.reducerPath]: bannerApi.reducer,
    [careerApi.reducerPath]: careerApi.reducer,
    [worldwideApi.reducerPath]: worldwideApi.reducer,
    [emailCategoryApi.reducerPath]: emailCategoryApi.reducer,
    [logoApi.reducerPath]: logoApi.reducer,
    [contactInfoApi.reducerPath]: contactInfoApi.reducer,
    [metaApi.reducerPath]: metaApi.reducer,
    [menuListingApi.reducerPath]: menuListingApi.reducer,
    [whatsUpInfoApi.reducerPath]:whatsUpInfoApi.reducer ,
    [navigationLinkApi.reducerPath]: navigationLinkApi.reducer,
    [catalogueApi.reducerPath]: catalogueApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Optionally disable serializable checks if needed
    })
      .concat(chemicalApi.middleware) // Middleware for chemical API
      .concat(supplierApi.middleware) // Middleware for supplier API
      .concat(api.middleware) // Middleware for customer API
      .concat(chemicalTypeApi.middleware) // Middleware for chemical type API
      .concat(unitApi.middleware) // Middleware for unit API
      .concat(chemicalCategoryApi.middleware) // Middleware for chemical category API
      .concat(smtpApi.middleware) // Middleware for SMTP API
      .concat(inquiryApi.middleware) // Middleware for inquiry API
      .concat(followupApi.middleware) // Middleware for followup API
      .concat(statusApi.middleware) // Middleware for status API
      .concat(sourceApi.middleware) // Middleware for source API
      .concat(adminApi.middleware)
      .concat(blogCategoryApi.middleware)
      .concat(blogApi.middleware)
      .concat(emailApi.middleware)
      .concat(templateApi.middleware)
      .concat(productInquiryApi.middleware) // Middleware for product inquiry API
      .concat(aboutUsApi.middleware)
      .concat(bannerApi.middleware)
      .concat(careerApi.middleware)
      .concat(worldwideApi.middleware)
      .concat(emailCategoryApi.middleware)
      .concat(logoApi.middleware)
      .concat(contactInfoApi.middleware)
      .concat(metaApi.middleware)
      .concat(menuListingApi.middleware)
      .concat(whatsUpInfoApi.middleware)
      .concat(navigationLinkApi.middleware)
      .concat(catalogueApi.middleware)
});

export default store;
