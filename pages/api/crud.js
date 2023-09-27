import React from 'react'
import Axios from 'axios'

// export const apiConstant = "https://integration_prod.halic.edu.tr";
// export const sso = "https://sso_prod.halic.edu.tr/api/";

export const apiConstant = "https://integration_dev.halic.edu.tr";
export const sso = "https://sso_dev.halic.edu.tr/api/";


const masterUrl = apiConstant + "/api/";
export const apiUrl = apiConstant + "/StaticF/Images/";

export const GetWithToken = async (url) => {
    const headers =
    {
        headers: {
            'Content-Type': 'application/Json',
            Authorization: 'Bearer ' + localStorage.getItem("usrtknbalotetknenter")
        }
    }
    try {
        return Axios.get(masterUrl + url, headers)
    } catch (error) {
        alert("hata oluştu n/ " + error)

    }
}


export const GetTrandyolBrand = async (url) => {
    const headers =
    {
        headers: {
            'Content-Type': 'application/Json',
        }
    }
    try {
        return Axios.get(url,headers)
    } catch (error) {
       return false

    }
}


export const GetNoneToken = async (url) => {
    const headers =
    {
        headers: {
            'Content-Type': 'application/Json',
        }
    }
    try {
        return Axios.get(masterUrl + url, headers)
    } catch (error) {
        alert("hata oluştu n/ " + error)

    }
}

export const PostWithToken = async (url, data) => {

    const headers =
    {
        headers: {
            'Content-Type': 'application/Json',
            Authorization: 'Bearer ' + localStorage.getItem("usrtknbalotetknenter")
        },
        onUploadProgress: progressEvent => {
            
            let percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
        
           
        }
    }
    try {

        return Axios.post(masterUrl + url, data, headers)
    } catch (error) {
        alert("hata oluştu n/ " + error)
    }
}
export const PostNoneToken = async (url, data) => {

    const headers =
    {
        headers: {
            'Content-Type': 'application/Json',
        }
    }
    try {

        return Axios.post(masterUrl + url, data, headers)
    } catch (error) {
        alert("hata oluştu n/ " + error)
    }
}



export const LoginNoneToken = async (url, data) => {

    const headers =
    {
        headers: {
            'Content-Type': 'application/Json',
        }
    }
    try {

        return Axios.post(sso + url, data, headers)
    } catch (error) {
        alert("hata oluştu n/ " + error)
    }
}