import { data } from "jquery";
import React, { useEffect, useState } from "react";
import AlertFunction from "../../../components/alertfunction";
import Modal from "../../../components/modal";
import Layout from "../../../layout/layout";
import PageHeader from "../../../layout/pageheader";
import PageLoading from "../../../layout/pageLoading";
import { GetWithToken, PostWithToken } from "../../api/crud";
import { Table } from "reactstrap";

export default function Index() {
  const [modalOpen, setModelOpen] = useState(false);
  const [initialData, setInitialData] = useState({});
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFaculties, setSelectedFaculties] = useState({});
  const [formPost, setFormPost] = useState(false);
  const [matchFaculties, setMatchFaculties] = useState([]);
  const [uyumSoftName, setUyumSoftName] = useState("");
  const [prolizName, setProlizName] = useState("");
  const [data, setData] = useState({
    uyumsoftFacultyCode: "",
    prolizFacultyCode: "",
    orgCode: "",
    uyumsoftProlizMatchRequestType: 1,
  });


  // const onFormSubmit = (e) => {
  //   e.preventDefault();
  //   console.log("form submitted");
  // };
  useEffect(() => {
    start();
  }, [formPost]);

  const start = async () => {
    setFormPost(false);
    var faculties = await GetWithToken("UyumsoftProlizMatch/GetFaculties")
      .then((x) => {
        return x.data;
      })
      .catch((x) => {
        return false;
      });

    console.log(" fakülteler : ", faculties);

    var matchFaculties = await GetWithToken("UyumsoftProlizMatch/GetAlMatch")
      .then((x) => {
        return x.data;
      })
      .catch((x) => {
        return false;
      });

    // console.log(" eşleşmiş : ", matchFaculties);
    setMatchFaculties(matchFaculties);

    // matchFaculties.data.map(f =>{
    //   faculties.data.uyumSoftFaculties= faculties.data.uyumSoftFaculties.filter( x => x.organizasyonKodu != f.uyumsoftFacultyCode)
    //   faculties.data.prolizFaculties=faculties.data.prolizFaculties.filter( x => x.fak_kod != f.prolizFacultyCode)
    // })

    console.log("deneme", faculties.data.uyumSoftFaculties);

    setFaculties(faculties);

    setLoading(false);
  };

  const gonder = async () => {
    console.log(data);
    var postData = {
      ...data,
      name: prolizName + " (Proliz) " + " > " + uyumSoftName + " (Uyumsoft) ",
    };
    console.log("postdata:", postData);
    await PostWithToken("UyumsoftProlizMatch/Match", postData)
      .then((x) => {
        return x.data;
      })
      .catch((e) => {
        AlertFunction("Başarısız işlem", "Bu işlem için yetkiniz bulunmuyor");
        return false;
      });
    setFormPost(true);
  };

  return (
    <>
      <Layout>
        <PageHeader
          title="Uyumsoft Proliz Eşleştirme"
          map={[
            { url: "", name: "Uyumsoft Proliz Eşleştirme" },
            { url: "", name: "Uyumsoft Proliz Eşleştir" },
          ]}
        ></PageHeader>

        <div className="container-fluid h5Header">
          <div className="row">
            {/* Uyumsoft Table */}

            {console.log(faculties)}

            <div className="col-sm-12">
              <div className="card uPEdb">
                <p className="baslik">Uyumsoft</p>
                <Table bordered size="sm" className="eee">
                  <thead>
                    <tr>
                      <th>Uyumsoft Organizasyon</th>
                      <th>Uyumsoft Organizasyon Kodu</th>
                    </tr>
                  </thead>
                  <tbody>
                    <td className="width">
                      {faculties.data?.uyumSoftFaculties.map((mk, key) => {
                        return (
                          <p
                            key={key}
                            onClick={() => {
                              setData({
                                ...data,
                                uyumsoftFacultyCode: mk.organizasyonKodu,
                                orgCode: data.uyumsoftFacultyCode,
                              }),
                                setUyumSoftName(mk.organizasyon);
                            }}
                          >
                            <p> {mk.organizasyon}</p>
                          </p>
                        );
                      })}
                    </td>
                    <td className="width">
                      {faculties.data?.uyumSoftFaculties.map((mk, key) => {
                        return (
                          <p onClick={() => setData({ ...data })} key={key}>
                            {" "}
                            {mk.organizasyonKodu}
                          </p>
                        );
                      })}
                    </td>
                  </tbody>
                </Table>
              </div>
            </div>

            {/* Proliz Table */}

            {/* {faculties.data.prolizFaculties.map((ep, key) =>{return (<li key={key}>{ep.fakulte_ad}</li>)})} */}
            {console.log(faculties)}

            <div className="col-sm-12">
              <div className="card uPEdb">
                <p className="baslik">Proliz</p>
                <Table bordered size="sm" className="eee">
                  <thead>
                    <tr>
                      <th>Proliz Fakülte Adı</th>
                      <th>Proliz Fakülte Kodu</th>
                    </tr>
                  </thead>
                  <tbody>
                    <td className="width">
                      {faculties.data?.prolizFaculties.map((mk, key) => {
                        return (
                          <p
                            key={key}
                            onClick={() => {
                              setData({
                                ...data,
                                prolizFacultyCode: mk.fak_kod,
                                orgCode: data.uyumsoftFacultyCode,
                              }),
                                setProlizName(mk.fakulte_ad);
                            }}
                          >
                            {" "}
                            {mk.fakulte_ad}
                          </p>
                        );
                      })}
                    </td>
                    <td className="width">
                      {faculties.data?.prolizFaculties.map((mk, key) => {
                        return (
                          <p onClick={() => setData({ ...data })} key={key}>
                            {}
                            {mk.fak_kod}
                          </p>
                        );
                      })}
                    </td>
                  </tbody>
                </Table>
              </div>
            </div>

            <div className="col-sm-1 mx-auto btnStyle">
              <button className="btn" onClick={gonder}>
                Birleştir
              </button>
            </div>

            {/* Proliz + Uyumsoft  */}

            <div className="col-sm-12">
              <div className="card uPEdb">
                <p className="baslik">Uyumsoft + Proliz Eşleştirme</p>
                <Table bordered size="sm" className="eee">
                  <thead>
                    <tr>
                      <th className="width">İsim </th>
                      <th className="width">
                        Organizasyon Kodu + Fakülte Kodu
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <td className="width">
                      {matchFaculties.data?.map((e, k) => {
                        return <p key={k}> {e.name}</p>;
                      })}
                    </td>
                    <td className="width">
                      {matchFaculties.data?.map((e, k) => {
                        return <p key={k}>{e.orgCode}</p>;
                      })}
                    </td>
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
