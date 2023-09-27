import React, { useEffect, useState } from "react";
import AlertFunction from "../../../components/alertfunction";
import DataTable from "../../../components/datatable";
import Modal from "../../../components/modal";
import Layout from "../../../layout/layout";
import PageHeader from "../../../layout/pageheader";
import PageLoading from "../../../layout/pageLoading";
import { GetWithToken, PostWithToken } from "../../api/crud";

export default function Index() {
  const [modalOpen, setModelOpen] = useState(false);
  const [initialData, setInitialData] = useState({});
  const [hiddenPassordField, setHiddenPassordField] = useState(false);
  const [refresh, setRefresh] = useState(null);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshDataTable, setRefreshDatatable] = useState(null);
  const [laboratuvar, setLaboratuvar] = useState([]);

  useEffect(() => {
    start();
  }, []);
  const start = async () => {
    var roles = await GetWithToken("UserManager/GetRoles")
      .then((x) => {
        return x.data;
      })
      .catch((x) => {
        return false;
      });
    var roleSelectList = [];
    for (const iterator of roles.data) {
      roleSelectList.push({ id: iterator.name, text: iterator.name });
    }
    setRoles(roleSelectList);

    setLoading(false);
  };
  const closeModal = () => {
    setModelOpen(false);
  };
  const submit = async (val) => {
    if (val.values.id == undefined) {
      await PostWithToken(
        "WebServiceAccount/WebServiceAccountCreate",val.values).then((x) => {return x.data;}).catch((e) => {AlertFunction("Başarısız işlem", "Bu işlem için yetkiniz bulunmuyor");
          return false;
        });
    } else {
      var d = await PostWithToken("WebServiceAccount/EditUser", val.values)
        .then((x) => {
          return x.data;
        })
        .catch((e) => {
          AlertFunction("Başarısız işlem", "Bu işlem için yetkiniz bulunmuyor");
          return false;
        });
      if (d.isError) {
        alert(d.message);
      }
    }
    setRefreshDatatable(new Date());
  };
  const deleteData = async (data) => {
    var d = await GetWithToken("WebServiceAccount/WebServiceAccountDelete/" + data.id)
      .then((x) => {
        return x.data;
      })
      .catch((e) => {
        AlertFunction("Başarısız işlem", "Bu işlem için yetkiniz bulunmuyor");
        return false;
      });
    if (d.isError) {
      alert(d.message);
    }
    setRefreshDatatable(new Date());
  };
  const createPassword = () => {
    var idata = initialData;
    idata.password = "M" + Math.random().toString(36).slice(-5) + "2!";
    setInitialData(idata);
    setRefresh(new Date());
  };
  const resetPassword = () => {
    var idata = initialData;
    idata.password = "";
    setInitialData(idata);
    setRefresh(new Date());
  };

  const editData = async (data) => {
    console.log(data)
    setHiddenPassordField(true)
    var d = await GetWithToken("WebServiceAccount/WebServiceAccountGetById/" + data.id).then(x => { return x.data }).catch((e) => { AlertFunction("", e.response.data); return false })
    // d.data.roles = d.data.roles.map((x) => { return x.text })
    console.log(d)
    
    setInitialData(d.data)
    setRefresh(new Date())
    setModelOpen(true)
}


  return (
    <>
      {loading && <PageLoading></PageLoading>}

      {modalOpen && (
        <Modal
          modalSize="small"
          modalTitle={initialData == null ? "Servis Ekle" : "Servis Düzenle"}
          closeModal={closeModal}
          items={[
            {
              props: {
                name: "id",
                type: "hidden",
              },
            },

            // {
            //     props: {
            //         name: "firstName",
            //         type: "text",
            //         className: "form-control",
            //         label: "Ad",
            //         required: "required"
            //     },
            //     rowCssClass: "col-12 col-md-6 col-lg-6"
            // },
            // {
            //     props: {
            //         name: "lastname",
            //         type: "text",
            //         className: "form-control",
            //         label: "Soyad",
            //         required: "required"
            //     },
            //     rowCssClass: "col-12 col-md-6 col-lg-6"
            // },
            {
              props: {
                name: "description",
                type: "text",
                className: "form-control",
                label: "Servis Adı",
                required: "required",
              },
              rowCssClass: "col-12 col-md-6 col-lg-6",
            },
            {
              props: {
                name: "userName",
                type: "text",
                className: "form-control",
                label: "Kullanıcı Adı",
                required: "required",
              },
              rowCssClass: "col-12 col-md-6 col-lg-6",
            },
            {
              props: {
                name: "password",
                type: "text",
                className: "form-control",
                label: "Şifre",
                required: "required",
              },
              rowCssClass: "col-12 col-md-6 col-lg-6",
            },

            {
              props: {
                name: "webServiceType",
                type: "select",
                className: "form-control",
                label: "Servis Türü",
                required: "required",
              },
              data: [
                { id: "1", text: "OSYM" },
                { id: "2", text: "UyumSoft" },
              ],
              rowCssClass: "col-12 col-md-6 col-lg-6",
            },
          ]}
          initialValues={
            initialData == null
              ? {
                  id: null,
                  firstName: "",
                  lastname: "",
                  userName: "",
                  email: "",
                  roles: [],
                  password: "M" + Math.random().toString(36).slice(-5) + "2!",

                  laboratuvarList: [],
                }
              : initialData
          }
          submit={submit}
        ></Modal>
      )}

      <Layout>
        <PageHeader
          title="Servis Oluştur"
          map={[
            { url: "", name: "Servis Tanımlama" },
            { url: "", name: "Servis Oluştur" },
          ]}
        ></PageHeader>

        <div className="content pr-3 pl-3">
          <div className="card">
            <DataTable
              Refresh={refreshDataTable}
              DataUrl={"WebServiceAccount/WebServiceAccountGetAll"}
              Headers={[
              ["description", "Servis Adı"],
              ["userName", "Kullanıcı Adı"],
              ["password", "Şifre"],
              ["webServiceType", "Servis Türü"],
            ]}
              Title={"Servis Tanımlama"}
              Description={"Listedeki kullanıcıların servis tanımlama işlemlerini yapabilirsiniz. "}
              HeaderButton={{text: "Servis Oluştur",action: () => { setModelOpen(true); setInitialData(null)}}}
              EditButton={editData}
              DeleteButton={deleteData}
            ></DataTable>
          </div>
        </div>
      </Layout>
    </>
  );
}
