
import React, { cloneElement, useEffect, useState } from 'react';
import { Dropdown, DropdownMenu, DropdownToggle } from 'reactstrap';

import { GetWithToken, PostWithToken } from '../pages/api/crud';
import { confirmAlert } from 'react-confirm-alert';
// import 'react-confirm-alert/src/react-confirm-alert.css';
import ReactPaginate from 'react-paginate';
import { PriceSplitter } from './pricesptitter';

export default function DataTable({ Refresh = null, Title, Description, Headers = [[] || { text: undefined, header: undefined, dynamicButton: undefined, onClick: undefined }], DataUrl, Pagination = undefined, HeaderButton = { text: "", action: (e) => { } }, EditButton = (e) => { }, DeleteButton = (e) => { }, HideButtons = false,NoDataPlaceholder }) {

    const [data, setData] = useState([])
    const [toggleActions, setToggleActions] = useState({ toggle: false, key: 0 })
    const [selectedPage, setSelectedPage] = useState(1)
    const [pagination, setPagination] = useState()

    const toggleAction = (key) => setToggleActions({ toggle: !toggleActions.toggle, key: key })
    useEffect(() => {

        start()
    }, [Refresh])
    const start = async () => {  

        if (Pagination) {
            var d = await PostWithToken(DataUrl, Pagination).then(x => { return x.data })
            setSelectedPage(Pagination.pageNumber)
            setPagination(d.data.totalCount);
            setData(d.data.list)
        } else {
            var d = await GetWithToken(DataUrl).then(x => { return x.data })
      
            setData(d.data)
        }
        // if (d.data?.pageNumber) {


        //     setPagination(d.data.totalCount);
        // } else {

        // }


    }
    const paginationClick = async (data) => {

        setSelectedPage(data.selected + 1)

        var d = await PostWithToken(DataUrl, { pageSize: Pagination.pageSize, pageNumber: data.selected + 1 }).then(x => { return x.data })


        setData(d.data.list)
    }
    const deleteButtonFunc = async (data) => {

        confirmAlert({
            title: 'Dikkat',
            message: 'Kayıt Silinecek Onaylıyor Musunuz.',
            buttons: [
                {
                    label: 'Evet',
                    onClick: () => DeleteButton(data)
                },
                {
                    label: 'Hayır',
                    onClick: () => { }
                }
            ]
        })

    }

    return (
        <>
            <div className="card-header header-elements-inline pb-0 mb-2">
                <h5 className="card-title" style={{ fontSize: 25 }}>{Title}</h5>
                <div className="header-elements">
                    <div className="list-icons">
                        {HeaderButton.text != "" &&
                            <button className='btn  btn-outline-success' onClick={HeaderButton.action}><i className='fas fa-plus-circle'></i> <b>{HeaderButton.text}</b> </button>

                        }
                    </div>
                </div>
            </div>

            <div className="card-body" style={{
                fontSize: 15,
                color: "#069983",
                fontStyle: "italic"
            }}>
                {Description}
            </div>

            <table className="table datatable-basic table-hover table-bordered">
                <thead>
                    <tr>
                        {
                            Headers?.map((item, key) => {


                                if (item?.header) {
                                    return (<th key={key}>{item.header}</th>)
                                } else {
                                    return (<th key={key}>{item[1]}</th>)

                                }
                            })
                        }
                        {HideButtons != true &&
                            <th className="text-center">İşlemler</th>

                        } 
                    </tr>
                </thead>
                <tbody>
                    {data?.length == 0 && <tr>
                        <td colSpan={Headers?.length + 1} className='text-center'>
                            <b>{NoDataPlaceholder||"Kayıt bulunamadı"}</b>
                        </td>
                    </tr>}
                    {data?.map((item, key) => {

                        return <tr key={key + 5}>
                            {Headers?.map((jitem, jkey) => {

                                if (jitem?.header) {

                                    if (jitem?.dynamicButton) {
                                        return <td key={jkey + key}>{jitem?.dynamicButton(item)}</td>
                                    }

                                    return (<td key={jkey + key}><button className={'btn btn-sm btn-info'} onClick={() => { jitem.onClick(item) }}>{jitem.text}</button> {jitem.button}</td>)
                                } else {

                                    if (jitem[0].includes(".")) {
                                        var splt = jitem[0].split(".")
                                        var tbls = item[splt[0]].map((item, key) => {
                                            var vll = jitem[2].split("|")

                                            var endValue = item[vll[0]]

                                            if (vll.length > 1) {
                                                if (vll[1] == "price") {
                                                    endValue = PriceSplitter(item[vll[0]])
                                                }
                                            }
                                            return <div key={key} className='price-table-view'>{endValue + " " + item[jitem[3]]}</div>
                                        })

                                        if (tbls != "") {

                                            return (<td key={jkey + key}>{tbls}</td>)

                                        } else {
                                            return (<td key={jkey + key}>{" - "}</td>)

                                        }
                                        // return (<td key={jkey + key}>{tbls}</td>)

                                    } else {

                                        if (item[jitem[0]]) {
                                            return (<td key={jkey + key}>{(jitem[2] == "money" && PriceSplitter(item[jitem[0]]) + " " + jitem[3]) || item[jitem[0]]}</td>)


                                        } else {
                                            return (<td key={jkey + key} style={{ textAlign: "center" }} ><b style={{ fontSize: 19 }}>{" - "}</b></td>)

                                        }

                                    }
                                }
                            })}  {HideButtons != true &&
                                <td className="text-center">
                                    <div className='row justify-content-center'  >
                                        <Dropdown isOpen={toggleActions.toggle && toggleActions.key == key} toggle={() => { toggleAction(key); }} >
                                            <DropdownToggle className='d-flex align-items-center'>
                                                <i className="icon-menu9"></i>
                                            </DropdownToggle>
                                            <DropdownMenu o>
                                                <div className="">
                                                    <div className='row justify-content-center' >

                                                        <>   <div className='col-12 text-center mb-2'>
                                                            <button className='btn btn-outline-danger' onClick={() => { deleteButtonFunc(item) }}><i className="icon-trash"></i> Sil</button>

                                                        </div>
                                                            <div className='col-12 text-center'>
                                                                <button className='btn btn-outline-success' onClick={() => { EditButton(item) }}><i className="icon-pencil"></i> Düzenle</button>

                                                            </div></>

                                                    </div>
                                                </div>
                                            </DropdownMenu>
                                        </Dropdown>
                                    </div>


                                </td>
                            }
                        </tr>

                    })}

                </tbody>
            </table>
            <div className='row justify-content-center mt-4'>
                {data?.length > 0 && Pagination && <ReactPaginate
                    className="pager-base"
                    pageLinkClassName="pager-list"
                    breakLabel="..."
                    nextLabel={<><i className='fa fa-arrow-right'></i> Sonraki</>}
                    onPageChange={paginationClick}
                    pageRangeDisplayed={5}
                    pageCount={pagination}
                    previousLabel={<><i className='fa fa-arrow-left'></i> Önceki</>}
                    renderOnZeroPageCount={null}
                />}
                {/* {pagination.map((item, key) => { return <div key={key}>{item}</div> })} */}
            </div>
        </>

    )

}