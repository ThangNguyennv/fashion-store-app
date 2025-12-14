import { Route, Routes } from 'react-router-dom'
import LayoutDefault from '~/layouts/Client/LayoutDefault/LayoutDefault'
import LayoutDefaultAdmin from '~/layouts/Admin/LayoutDefault/LayoutDefault'
import Home from '~/pages/Client/Home'
import AOS from 'aos'
import 'aos'
import { useEffect } from 'react'
import Dashboard from '~/pages/Admin/Dashboard/Dashboard'
import Account from '~/pages/Admin/Account'
import ArticleAdmin from '~/pages/Admin/Article'
import ArticleCategoryAdmin from '~/pages/Admin/ArticleCategory'
import MyAccountAdmin from '~/pages/Admin/MyAccount'
import ProductAdmin from '~/pages/Admin/Product'
import ProductCategoryAdmin from '~/pages/Admin/ProductCategory'
import Role from '~/pages/Admin/Role'
import General from '~/pages/Admin/Setting/General/General'
import Advance from '~/pages/Admin/Setting/Advance/Advance'
import User from '~/pages/Admin/User'
import Login from '~/pages/Admin/Auth/Login'
import Permission from '~/pages/Admin/Role/Permission'
import EditMyAccount from '~/pages/Admin/MyAccount/Edit'
import DetailProduct from '~/pages/Admin/Product/Detail'
import EditProduct from '~/pages/Admin/Product/Edit'
import CreateProduct from '~/pages/Admin/Product/Create'
import CreateProductCategory from '~/pages/Admin/ProductCategory/Create'
import DetailProductCategory from '~/pages/Admin/ProductCategory/Detail'
import EditProductCategory from '~/pages/Admin/ProductCategory/Edit'
import CreateArticle from '~/pages/Admin/Article/Create'
import DetailArticle from '~/pages/Admin/Article/Detail'
import EditArticle from '~/pages/Admin/Article/Edit'
import DetailArticleCategory from '~/pages/Admin/ArticleCategory/Detail'
import EditArticleCategory from '~/pages/Admin/ArticleCategory/Edit'
import CreateArticleCategory from '~/pages/Admin/ArticleCategory/Create'
import DetailRole from '~/pages/Admin/Role/Detail'
import EditRole from '~/pages/Admin/Role/Edit'
import CreateRole from '~/pages/Admin/Role/Create'
import CreateAccount from '~/pages/Admin/Account/Create'
import DetailAccount from '~/pages/Admin/Account/Detail'
import EditAccount from '~/pages/Admin/Account/Edit'
import DetailUser from '~/pages/Admin/User/Detail'
import EditUser from '~/pages/Admin/User/Edit'
import EditSettingGeneral from '~/pages/Admin/Setting/General/Edit'
import LayoutAuth from '~/layouts/Client/layoutAuth/LayoutAuth'
import LoginClient from '~/pages/Client/Auth/Login/Login'
import RegisterClient from '~/pages/Client/Auth/Register/Register'
import Forgot from '~/pages/Client/Auth/Password/Forgot/Forgot'
import Reset from '~/pages/Client/Auth/Password/Reset/Reset'
import PrivateRouteAdmin from '~/components/Admin/PrivateRoute/PrivateRoute '
import PrivateRouteClient from '~/components/Client/PrivateRoute/PrivateRoute'
import MyAccountClient from '~/pages/Client/MyAccount'
import EditMyAccountClient from '~/pages/Client/MyAccount/Edit'
import ChangePassword from '~/pages/Client/MyAccount/ChangePassword'
import LayoutUser from '~/layouts/Client/layoutUser/LayoutUser'
import ForgotPassword from '~/pages/Admin/Auth/ForgotPassword'
import ProductClient from '~/pages/Client/Product'
import Cart from '~/pages/Client/Cart'
import Checkout from '~/pages/Client/Checkout'
import Success from '~/pages/Client/Checkout/Success'
import OrderAdmin from '~/pages/Admin/Order'
import DetailOrder from '~/pages/Admin/Order/Detail'
import Notification from '~/pages/Admin/Notification'
import ProductCategory from '~/pages/Client/Product/Category'
import ProductsNew from '~/pages/Client/Product/ProductsNew'
import ProductsFeatured from '~/pages/Client/Product/ProductsFeatured'
import ArticlesNew from '~/pages/Client/Article/ArticlesNew'
import ArticlesFeatured from '~/pages/Client/Article/ArticlesFeatured'
import ArticleClient from '~/pages/Client/Article'
import ArticleCategory from '~/pages/Client/Article/Category'
import Search from '~/components/Client/Search/Search'
import DetailProductClient from '~/pages/Client/Product/Detail'
import DetailArticleClient from '~/pages/Client/Article/Detail'
import MyOrders from '~/pages/Client/MyAccount/MyOrders'
import HelpCenter from '~/pages/Client/HelpCenter/HelpCenter'
import ScrollToTop from '~/components/ScrollToTop/ScrollToTop'
import BrandAdmin from '~/pages/Admin/Brand/BrandAdmin'
import CreateBrand from '~/pages/Admin/Brand/CreateBrand'
import EditBrand from '~/pages/Admin/Brand/EditBrand'
import BrandPage from '~/pages/Client/Brand/Brand'
import AdminChatPage from '~/pages/Admin/AdminChatPage/AdminChatPage'
import GoogleCallback from './pages/Client/GoogleCallback/GoogleCallback'
import { Error404Page } from './pages/Error404Page/Error404Page'
import UnauthorizedRoutesAdmin from './components/Admin/UnauthorizedRoutes/UnauthorizedRoutes'
import TrashOrder from './pages/Admin/Order/TrashOrder'

function App() {

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true
    })
    AOS.refresh() // đảm bảo refresh lại khi nội dung động
  }, [])

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path='/' element={<LayoutDefault />}>
          <Route index element={<Home />}/>
          <Route path='search' element={<Search />}/>
          <Route path='help' element={<HelpCenter />} />
          <Route path='brands' element={<BrandPage />}/>
          <Route path='products'>
            <Route index element={<ProductClient />}/>
            <Route path=':slugCategory' element={<ProductCategory />}/>
            <Route path='detail/:slugProduct' element={<DetailProductClient />}/>
            <Route path='productsNew' element={<ProductsNew />}/>
            <Route path='productsFeatured' element={<ProductsFeatured />}/>
          </Route>
          <Route path='articles'>
            <Route index element={<ArticleClient />}/>
            <Route path=':slugCategory' element={<ArticleCategory />}/>
            <Route path='detail/:slugArticle' element={<DetailArticleClient />}/>
            <Route path='articlesNew' element={<ArticlesNew />}/>
            <Route path='articlesFeatured' element={<ArticlesFeatured />}/>
          </Route>
          <Route path='cart' element={<Cart />}/>
          <Route path='checkout' element={<PrivateRouteClient><Checkout /></PrivateRouteClient>}/>
          <Route path='checkout/success/:orderId' element={<PrivateRouteClient><Success /></PrivateRouteClient>}/>
          <Route path='user' element={<PrivateRouteClient><LayoutUser /></PrivateRouteClient>}>
            <Route path='notification'></Route>
            <Route path='account'>
              <Route path='info'>
                <Route index element={ <MyAccountClient />} />
                <Route path='edit' element={ <EditMyAccountClient />}/>
                <Route path='change-password' element={ <ChangePassword />}/>
              </Route>
              <Route path='payment'></Route>
              <Route path='address'></Route>
              <Route path='setting-privacy'></Route>
            </Route>
            <Route path='my-orders' element={ <MyOrders />}/>
            <Route path='voucher-wallet'></Route>
            <Route path='coin'></Route>
          </Route>
        </Route>
        <Route path='user' element={<LayoutAuth />}>
          <Route path='login' element={<LoginClient />} />
          <Route path='register' element={<RegisterClient />} />
          <Route path='password'>
            <Route path='forgot' element={ <Forgot />}/>
            {/* <Route path='otp' element={ <OTP />}/> */}
            <Route path='reset' element={ <Reset />}/>
          </Route>
        </Route>
        <Route path="/auth/google/callback" element={<GoogleCallback />} />
        <Route path='admin' element={<PrivateRouteAdmin><LayoutDefaultAdmin /></PrivateRouteAdmin>}>
          <Route index element={ <Dashboard />} />
          <Route path='dashboard' element={ <Dashboard />}/>
          <Route path='orders'>
            <Route index element={ <OrderAdmin />}/>
            <Route path='detail/:id' element={<DetailOrder />}/>
            <Route path='trash' element={<TrashOrder />}/>
          </Route>
          <Route path='notification' element={<Notification />}/>
          <Route path='brands'>
            <Route index element={<BrandAdmin />}/>
            <Route path='create' element={ <CreateBrand />}/>
            <Route path='edit/:id' element={ <EditBrand />}/>
            {/* <Route path='detail/:id' element={ <DetailBrand />}/> */}
          </Route>
          <Route path='products'>
            <Route index element={ <ProductAdmin />}/>
            <Route path='create' element={<CreateProduct />}/>
            <Route path='detail/:id' element={ <DetailProduct />}/>
            <Route path='edit/:id' element={<EditProduct />}/>
          </Route>
          <Route path='products-category'>
            <Route index element={<ProductCategoryAdmin />}/>
            <Route path='create' element={<CreateProductCategory />}/>
            <Route path='detail/:id' element={ <DetailProductCategory />}/>
            <Route path='edit/:id' element={<EditProductCategory />}/>
          </Route>
          <Route path='articles'>
            <Route index element={ <ArticleAdmin />}/>
            <Route path='create' element={ <CreateArticle />}/>
            <Route path='detail/:id' element={ <DetailArticle />}/>
            <Route path='edit/:id' element={ <EditArticle />}/>
          </Route>
          <Route path='articles-category'>
            <Route index element={ <ArticleCategoryAdmin />}/>
            <Route path='create' element={ <CreateArticleCategory />}/>
            <Route path='detail/:id' element={ <DetailArticleCategory />}/>
            <Route path='edit/:id' element={ <EditArticleCategory />}/>
          </Route>
          <Route path='roles'>
            <Route index element={ <Role />} />
            <Route path='create' element={ <CreateRole />} />
            <Route path='detail/:id' element={ <DetailRole />} />
            <Route path='edit/:id' element={ <EditRole />} />
            <Route path='permissions' element={<Permission />} />
          </Route>
          <Route path='accounts'>
            <Route index element={ <Account />}/>
            <Route path='create' element={ <CreateAccount />}/>
            <Route path='detail/:id' element={ <DetailAccount />}/>
            <Route path='edit/:id' element={ <EditAccount />}/>
          </Route>
          <Route path='users'>
            <Route index element={<User />}/>
            <Route path='detail/:id' element={<DetailUser />}/>
            <Route path='edit/:id' element={<EditUser />}/>
          </Route>
          <Route path='my-account'>
            <Route index element={ <MyAccountAdmin />}/>
            <Route path='edit' element={ <EditMyAccount />}/>
          </Route>
          <Route path='chats' element={ <AdminChatPage />}/>
          <Route path='settings'>
            <Route path='general'>
              <Route index element={<General />}/>
              <Route path='edit' element={<EditSettingGeneral />}/>
            </Route>
            <Route path='advance' element={<Advance />}/>
          </Route>
        </Route>
        <Route path='admin/auth' element={<UnauthorizedRoutesAdmin />}>
          <Route path='login' element={ <Login />}/>
          <Route path='forgot-password' element={<ForgotPassword />}/>
        </Route>
        <Route path="*" element={<Error404Page />} />
      </Routes>
    </>
  )
}

export default App
