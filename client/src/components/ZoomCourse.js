import React,{useContext,useEffect,useState} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import { MainContext } from '../context/MainContext';
import { create as ipfsHttpClient } from 'ipfs-http-client'
import {Buffer} from 'buffer';
import { ethers } from "ethers";
import Loader from "./Loader";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import styles from "../styles/ZoomCourse.module.css"
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import MiniUser from './MiniUser';
import "../styles/Colors.css"

const ZoomCourse = () => {
    let {currentAccount,contractCourses,loadCourses}=useContext(MainContext);
    const [title,setTitle]=useState();
    const [price,setPrice]=useState();
    const [duration,setDuration]=useState();
    const [description,setDescription]=useState();
    const [creator,setCreator]=useState();
    const [username,setUsername]=useState();
    const [banner,setBanner]=useState();
    const [file,setFile]=useState();
    const [idCourse,setIdCourse]=useState();
    const [loading,setLoading]=useState("false");
    const [alert,setAlert]=useState("false");
    const [severity,setSeverity]=useState();
    const [alertText,setAlertText]=useState("");
    const [subject,setSubject]=useState("");
    const [secondary,setSecondary]=useState("");
    const [tagPrimary,setTagPrimary]=useState("");
    const [tagSecondary,setTagSecondary]=useState("");
    const [buyed,setBuyed]=useState(false);
    const [linkPurchase,setLinkPurchase]=useState("");
    const [modify,setModify]=useState(false);
    const [buyers,setBuyers]=useState();
    const imageMimeType = /image\/(png|jpg|jpeg)/i;

    let params=useParams();
    const inputFileRef = React.useRef();
    let navigate=useNavigate();
    const onFileChangeCapture = ( e ) =>{
        const file = e.target.files[0];
        if (!file.type.match(imageMimeType)) {
          alert("Image mime type is not valid");
          return;
        }
        setFile(file);
      };
      useEffect(() => {
        let fileReader, isCancel = false;
        if (file) {
          fileReader = new FileReader();
          fileReader.onload = (e) => {
            const { result } = e.target;
            if (result && !isCancel) {
              setBanner(result)
            }
          }
          fileReader.readAsDataURL(file);
        }
        return () => {
          isCancel = true;
          if (fileReader && fileReader.readyState === 1) {
            fileReader.abort();
          }
        }
    
      }, [file]);

      function CustomToggle({ children, eventKey }) {
        const decoratedOnClick = useAccordionButton(eventKey, () =>
        console.log('apri/chiudi'),
      );
        return (
          <button
            type="button"
            className={styles.buttonSecondary}
            onClick={decoratedOnClick}
            >
            {children}
          </button>
        );
      }
    const projectId = '2DJBRuSe2FV6WmWXCNkgDEVjeZ6'; 
    const projectSecret = '07885af6bec7df195a06e71cd0fb1126';  
    
    const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
  
    const Alert = React.forwardRef(function Alert(props, ref) {
      return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });
    const [open, setOpen] = React.useState(true);
  
    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      setOpen(false);
    };
    
    const client = ipfsHttpClient({
        host: 'ipfs.infura.io',
        port: 5001,
        protocol: 'https',
        headers: {
            authorization: auth,
        },
    });

    useEffect( ()=>{
        if(currentAccount) {
          const fetchData=async()=>{
            setLoading("true")
            let response=await fetch(`https://learningdata.infura-ipfs.io/ipfs/${params.id}`)
           let content = await response.json();
          if(content){
          setBanner(content.course.img)
          setTitle(content.course.title)
          setDuration(content.course.duration)
          setPrice(content.course.price)
          setDescription(content.course.description)
          setCreator(content.course.creator)
          setUsername(content.course.username)
          setSubject(content.course.subject)
          setSecondary(content.course.secondary)
          let id=await(contractCourses.getCourseByHash(params.id))
          setIdCourse(id)
    }else{
            setTitle("")
            setDuration("")
            setPrice("")
            setDescription("")
            setBanner("")
            setCreator("")
            setUsername("")
          }
          setLoading("false")
        }
    
          fetchData()
          .catch((error)=>{
            setAlertText("error on course loading: ",error.message)
            setOpen(true)
            setSeverity("error")
            setLoading("false")
          })
        }
      },[currentAccount,params])

      useEffect(()=>{

        const fetchData=async()=>{
        if(idCourse) {
          let result2=await contractCourses.getBuyer(idCourse)
          setBuyers(result2)
          result2.map((buyer)=>{
            if(buyer.localeCompare(currentAccount)) 
            {
              setBuyed(true)
            }
          })
        }
      }
      fetchData()
      },[idCourse])

      useEffect(()=>{
        const fetchData=async()=>{
          if(buyed) {
            let link=await contractCourses.getPurchase(idCourse)
            setLinkPurchase(link)
          }
        }
        fetchData()

      },[])

    async function courseModify()
    {
      if(!creator||!title||!price||!duration||!description||!banner||!subject){
        setAlertText("Inserisci tutti i campi!")
        setOpen(true)
        setSeverity("warning")
        setLoading("false")
        return;
      }
      setLoading("true")
    let course={creator:creator,title:title,price:price,duration:duration,description:description,img:banner,subject:subject,secondary:secondary,username:username};
    let hash
    try {
        let options={
            warpWithDirectory:true,
        }
        const result = await client.add(JSON.stringify({ course }),options)
        hash = result.path
    } catch (error) {
      setAlertText("ipfs change error: ",error)
      setOpen(true)
      setSeverity("error")
      setLoading("false")
    }
    await (await contractCourses.modifyCourse(params.id,hash).catch((err)=>{
      setAlertText(err.code)
      setOpen(true)
      setSeverity("error")
      setLoading("false")})).wait()
      await loadCourses()
      setAlertText("Corso modificato con successo!")
      setOpen(true)
      setSeverity("success")
      setLoading("false")
    }

    async function waitingMetamask(provider,hash)
    {
      setLoading("true")
      await provider.waitForTransaction(hash.hash)      .catch((error)=>{
        setAlertText(error.message)
        setOpen(true)
        setSeverity("error")
        setLoading("false")
      })
      .then(async ()=>{
      await(await(contractCourses.addPurchase(idCourse,currentAccount,""+hash.hash)      .catch((error)=>{
        setAlertText(error.message)
        setOpen(true)
        setSeverity("error")
        setLoading("false")
      }))).wait()

        await loadCourses()
        let link=await contractCourses.getPurchase(idCourse);
        setLinkPurchase(link)
        await contractCourses.getNumberPurchase(idCourse)
        await contractCourses.getBuyer(idCourse)
        setBuyed(true)
        setAlertText("Corso acquistato con successo!")
        setOpen(true)
        setSeverity("success")
        setLoading("false")
      
  
    })

    }
  

    async function buyCourse()
    {
      setLoading("true")
  try{
    await window.ethereum.request({ method: 'eth_requestAccounts' })
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
  
    const response=await axios.get('https://api.binance.com/api/v3/avgPrice?symbol=ETHEUR')
    const body = response.data;
    
    const tx=await signer.sendTransaction({
      to:creator,
      value: ethers.utils.parseEther(""+(price/body.price).toFixed(5))
    }).then((hash)=>waitingMetamask(provider,hash));
  
  
  }catch(error)
  {
    if(error.code=="NUMERIC_FAULT")
    {
      setAlertText("Price calculation has failed, retry!")
      setOpen(true)
      setSeverity("warning")
      setLoading("false")
    }else
  {  setAlertText(error.code)
    setOpen(true)
    setSeverity("error")
    setLoading("false")}
  
  }
    
  }


async function deleteCourse()
{
  setLoading("true")
  let x=await contractCourses.getCourseByHash(params.id)
  if(x=="-1") {
    setAlertText("Non esiste un corso con questo hash")
    setOpen(true)
    setSeverity("error")
    setLoading("false")
    return;
  }
  await (await contractCourses.deleteCourse(x).catch((err)=>{
    setAlertText(err.code)
    setOpen(true)
    setSeverity("error")
    setLoading("false")})).wait()
    await loadCourses();
    setAlertText("Corso eliminato con successo!")
    setOpen(true)
    setSeverity("success")
    setTimeout(()=>{
      navigate("/home")
    },3000)
    setLoading("false")

}

useEffect(()=>{
  let tag;

  tag=subject.toLowerCase()
  tag=tag.replace(/ /g,"")
  tag=tag.replace("(","")
  tag=tag.replace(")","")
  tag=tag.replace(".","")
  setTagPrimary(tag)
},[subject])


useEffect(()=>{
  let tag;
  tag=secondary.toLowerCase()
  tag=tag.replace(/ /g,"")
  tag=tag.replace("(","")
  tag=tag.replace(")","")
  tag=tag.replace(".","")
  setTagSecondary(tag)
},[secondary])



  return (
    <div>
                {
            loading=="true"?(
            <Loader chiamante="corso" />              
              ):(<></>)
          }
          {
            open==true&&severity?(<>
            
            <Stack spacing={2} sx={{ width: '100%' }}>
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
              <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                {alertText}
              </Alert>
            </Snackbar>
          </Stack>
            
            </>):(<></>)
          }
          {modify==true?(<div className={styles.container}>   

 
<div className={styles.main}>
<input type="file" className="d-none" ref={inputFileRef} onChangeCapture={onFileChangeCapture}></input>
<img  className={styles.banner} src={banner} alt="Banner corso" onClick={()=>inputFileRef.current.click()}/>
 <input className='form-control mb-4' type="text" placeholder="titolo" value={title} onChange={(event) => setTitle(event.currentTarget.value)}/>
  <div className={styles.row}>
  <p>€</p>
  <input className='form-control mb-4' type="number" placeholder="10€" step=".5" value={price} onChange={(event) => setPrice(event.currentTarget.value)}/>
  </div>
  <input className='form-control mb-4' type="text" placeholder="durata" size="50" value={duration} onChange={(event) => setDuration(event.currentTarget.value)}/>
  <textarea class="form-control" spellcheck="false" id="exampleFormControlTextarea1" name="descrizioneCorso" placeholder="Il corso tratterà..."  value={description} rows="3" onChange={(event) => setDescription(event.currentTarget.value)}/>
  <select value={subject} name="materia" id="materia" onChange={(event) => setSubject(event.currentTarget.value)}>
    <option value="English">english</option>
    <option value="math">math</option>
    <option value="art">art</option>
    <option value="science">science</option>
    <option value="history">history</option>
    <option value="music">music</option>
    <option value="geography">geography</option>
    <option value="P.E (Physical Education)">P.E (Physical Education)</option>
    <option value="drama">drama</option>
    <option value="biology">biology</option>
    <option value="chemistry">chemistry</option>
    <option value="physics">physics</option>
    <option value="I.T (Information Technology)">I.T (Information Technology)</option>
    <option value="foreign languages">foreign languages</option>
    <option value="social studies">social studies</option>
    <option value="technology">technology</option>
    <option value="philosophy">philosophy</option>
    <option value="graphic design">graphic design</option>
    <option value="literature">literature</option>
    <option value="algebra">algebra</option>
    <option value="geometry">geometry</option>
  </select>
    <select value={secondary} name="secondaria" id="secondaria" onChange={(event) => setSecondary(event.currentTarget.value)}>
    <option value="">nessuna</option>
    <option value="English">english</option>
    <option value="math">math</option>
    <option value="art">art</option>
    <option value="science">science</option>
    <option value="history">history</option>
    <option value="music">music</option>
    <option value="geography">geography</option>
    <option value="P.E (Physical Education)">P.E (Physical Education)</option>
    <option value="drama">drama</option>
    <option value="biology">biology</option>
    <option value="chemistry">chemistry</option>
    <option value="physics">physics</option>
    <option value="I.T (Information Technology)">I.T (Information Technology)</option>
    <option value="foreign languages">foreign languages</option>
    <option value="social studies">social studies</option>
    <option value="technology">technology</option>
    <option value="philosophy">philosophy</option>
    <option value="graphic design">graphic design</option>
    <option value="literature">literature</option>
    <option value="algebra">algebra</option>
    <option value="geometry">geometry</option>
  </select> 
  <div className={styles.buttons}> 
  <button className={styles.btnSpectator}onClick={()=>setModify(false)}>Torna alla modalità spettatore</button>
  <div className={styles.noStyle}>

<button  data-bs-toggle="modal" data-bs-target="#modalModifica" className={styles.btnModify}>Applica modifiche</button>
  <div className="modal fade" id="modalModifica" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="staticBackdropLabel">Modica corso</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <p>Applicare definitivamente le modifiche?</p>
      </div>
      <div class="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Annulla</button>
        <button type="button" className={`btn ${styles.btnConfirmModify}`} data-bs-dismiss="modal" onClick={()=>courseModify()}>Conferma</button>
      </div>
    </div>
  </div>
</div>
<button  data-bs-toggle="modal" data-bs-target="#modalElimina" className={styles.btnDelete}>Elimina</button>
<div className="modal fade" id="modalElimina" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
<div className="modal-dialog">
  <div className="modal-content">
    <div className="modal-header">
      <h5 className="modal-title" id="staticBackdropLabel">Elimina corso</h5>
      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    </div>
    <div class="modal-body">
      <p>Sei sicuro di voler eliminare il corso?</p>
    </div>
    <div class="modal-footer">
      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Annulla</button>
      <button type="button" className={`btn ${styles.btnConfirmDelete}`} data-bs-dismiss="modal" onClick={()=>deleteCourse()}>Elimina</button>
    </div>
  </div>
</div>
</div>
</div>

</div>
</div>
</div>):(<>

  <div className={styles.container}>
            <img className={styles.banner} src={banner} alt="Banner corso"/>
            <div className={styles.main}>
              
            <span className={styles.title}>{title}</span>
            <div class="row justify-content-around align-items-center" >
            <div class="col-sm-5 offset-md-1">

            <div className={`card border-dark mb-3 `} style={{ maxWidth: "18rem"}}>
            <ul class="list-group list-group-flush">
              <li class="list-group-item" onClick={()=>{navigate(`/profilo/${creator}`)}}>Un corso di: {username}</li>
              <li class="list-group-item">Durata: {duration}</li>
              <li class="list-group-item">Prezzo: €{price}</li>
            </ul>
            </div>

              </div>

              <div class="col-sm-5 offset-md-1">
                <div class="col-sm-8 mb-2">
                  <div className={`card mb-2 ${styles.rounded}`}>
                    <div className={`card-body text-center ${tagPrimary} ${styles.rounded}`}>
                      <span style={{color:"white"}}>Materia: {subject}</span>
                    </div>
                </div>
                </div>

              

                {secondary?(
                 <div class="col-sm-8 ">
                  <div className={`card ${styles.rounded}`}>
                  <div className={`card-body text-center ${tagSecondary} ${styles.rounded}`}>
                  <span style={{color:"white"}}>Secondaria: {secondary}</span>
                  </div>
                </div>
                </div>
                
                ):(<></>)}
                                </div>

                              </div>


              <p className={styles.description}>{description}</p>
              {
                currentAccount==creator?(<>
                    <Accordion defaultActiveKey="0">
                    <Card>
                      <Card.Header>
                        <CustomToggle eventKey="0">Utenti che hanno acquistato il corso</CustomToggle>
                      </Card.Header>
                      <Accordion.Collapse eventKey="0">
                        <Card.Body>
                          <div className={styles.containerBuyers}>
                              {
                                buyers?(
                                  buyers.map((buyer)=>{
                                  if(buyer)return <MiniUser address= {buyer}/>
                                }
                                )):(<p>Nessun acquirente</p>)
                              }
                          </div>
                        </Card.Body>
                      </Accordion.Collapse>
                    </Card>
                  </Accordion>
                <button className={styles.buttonBuy} onClick={()=>setModify(true)}>Modifica corso</button>
                </>
                ):(              
                  buyed==false?(
                    <button className={styles.buttonBuy} onClick={()=>buyCourse()}>Acquista corso</button>)
                    :(<a href={(`https://goerli.etherscan.io/tx/${linkPurchase}`)} target="_blank">Dettagli acquisto✅</a>)
                  )
              }
            </div>
        </div>  
</>)}
    </div>
  )
}

export default ZoomCourse