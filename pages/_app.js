

import '../styles/globals.css'
import '../layout/assets/css/bootstrap.min.css'
import '../layout/assets/css/bootstrap_limitless.min.css'

import '../layout/assets/css/components.min.css'
import '../layout/assets/css/colors.min.css'
// import '../layout/assets/js/'

import "../layout/global_assets/css/icons/icomoon/styles.min.css"
import Login from './auth/login'
import '../layout/assets/css/layout.min.css'
import '../layout/assets/css/tree.css'
import "../layout/global_assets/css/icons/fontawesome/styles.min.css"
import { useEffect, useState } from 'react'
import { GetNoneToken, GetWithToken } from './api/crud'
import Setup from './auth/setup'
import CreateUser from './auth/createUser'
import 'react-confirm-alert/src/react-confirm-alert.css';



function Antegra({ Component, pageProps }) {
  const [checkData, setCheckData] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    start();
  }, [])
  const start = async () => {

    var d = await GetWithToken("Auth/CreateUserInfo").then(x => { return x.data }).catch(() => { setCheckData(false) })

    setCheckData(d)
    setLoading(false)
  }
  if (!loading) {
    if (checkData) {
      return <Component {...pageProps} />
    }
    if (checkData == false) {

      localStorage.removeItem("usrtknbalotetknenter")
    }
    if (!checkData?.auth) {

      return <Login></Login>
    }


  }





  // return <Login></Login>

  return <div></div>
}

export default Antegra
