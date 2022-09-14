import React,{ useState, useContext,useEffect } from 'react'
import Accordion from 'react-bootstrap/Accordion';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { MainContext } from '../context/MainContext';
import Loader from "./Loader";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { FaAngleUp } from 'react-icons/fa';
import Card2 from './Card2';
import styles from '../styles/Home.module.css'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import defaultimage from '../defaultimage';
import defaultSfondo from '../defaultSfondo';
import 'bootstrap/dist/css/bootstrap.css'; // or include from a CDN
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import RangeSlider from 'react-bootstrap-range-slider';
import { Carousel } from 'react-bootstrap';

const Home = () => {

    let {corsi,currentAccount,isConnected,isLoading,showErrorInHome,alertText,apriModaleRegistrazione,setApriModaleRegistrazione,setUserDetails,onDisconnect }=useContext(MainContext);
    const [alert,setAlert]=useState("false");
    const [showTopBtn, setShowTopBtn] = useState(false);
    const [parolaChiave,setParolaChiave]=useState("");
    const [filtroMateria,setFiltroMateria]=useState("");
    const [corsiCopia,setCorsiCopia]=useState(corsi);
    const [maxPrezzo,setMaxPrezzo]=useState(0);
    const [minPrezzo,setMinPrezzo]=useState(0);
    const[username,setUsername]=useState("");
    const[email,setEmail]=useState("");
    const[image,setImage]=useState("");
    const[sfondo,setSfondo]=useState("");
    const[descrizione,setDescrizione]=useState("");
    const[alertTextCustom,setAlertTextCustom]=useState("");
    const[openAlertCustom,setOpenAlertCustom]=useState("");
    const[severity,setSeverity]=useState("");
    const[imageDataURL,setImageDataURL]=useState(defaultimage);
    const[sfondoDataURL,setSfondoDataURL]=useState(defaultSfondo);

    const imageMimeType = /image\/(png|jpg|jpeg)/i;

    
      const [value, setValue] = React.useState(50);
    
      const handleChange = (event, newValue) => {
        setValue(newValue);
      };
    
      const [show, setShow] = useState(true);

  const handleCloseModal = () => setShow(false);
  

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

      const Alert2 = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
      });
    
      const handleCloseCustomAlert = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpenAlertCustom(false);
      };


    useEffect(()=>{
        setOpen(showErrorInHome)
    },[showErrorInHome,alertText])

    useEffect(()=>{
        setOpen(apriModaleRegistrazione)
        setShow(apriModaleRegistrazione)
    },[apriModaleRegistrazione])

    useEffect(()=>{
      if(corsi) {
        setCorsiCopia(corsi)
      }
    },[corsi])

    useEffect(()=>{
      let max=0,min=99999999;
      if(corsiCopia){
        corsiCopia.map((corso)=>{
          if(!corso) return
          if(corso.content.prezzo>max) max=corso.content.prezzo
          if(corso.content.prezzo<min) min=corso.content.prezzo
        })
        setMaxPrezzo(max)
        setMinPrezzo(min)
      }

    },[corsiCopia])


    useEffect(() => {
      const onPageLoad = () => {
      };


      function isScrolledIntoView(elem) {
        var rect = elem.getBoundingClientRect();
        var elemTop = rect.top;
        var elemBottom = rect.bottom;
      
        var isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
        
        return isVisible;
      }
  
  
      window.addEventListener("scroll", () => {
        if (window.scrollY > 400) {
            setShowTopBtn(true);
        } else {
            setShowTopBtn(false);
        }
        
        if (document.getElementById("immaginiPubblicita2") && isScrolledIntoView(document.getElementById("immaginiPubblicita2"))) {
          document.getElementById("immaginiPubblicita2").classList.add(styles.fadeInRight);
          // document.getElementById("immaginiPubblicita2").style.opacity="1";
        }
        if (document.getElementById("scrittaPubblicita2") && isScrolledIntoView(document.getElementById("scrittaPubblicita2"))) {
          document.getElementById("scrittaPubblicita2").classList.add(styles.fadeInLeft);
          // document.getElementById("scrittaPubblicita2").style.opacity="1";
        }

        if (document.getElementById("immaginiPubblicita3") && isScrolledIntoView(document.getElementById("immaginiPubblicita3"))) {
          document.getElementById("immaginiPubblicita3").classList.add(styles.slideIn);
          // document.getElementById("immaginiPubblicita3").style.opacity="1";
        }
        if (document.getElementById("scrittaPubblicita3") && isScrolledIntoView(document.getElementById("scrittaPubblicita3"))) {
          document.getElementById("scrittaPubblicita3").classList.add(styles.bounceInBottom);
          document.getElementById("scrittaPubblicita3").style.opacity="1";
        }

        if (document.getElementById("immaginiPubblicita4") && isScrolledIntoView(document.getElementById("immaginiPubblicita4"))) {
          document.getElementById("immaginiPubblicita4").classList.add(styles.slideIn);
          // document.getElementById("immaginiPubblicita4").style.opacity="1";
        }
        if (document.getElementById("scrittaPubblicita4") && isScrolledIntoView(document.getElementById("scrittaPubblicita4"))) {
          document.getElementById("scrittaPubblicita4").classList.add(styles.bounceInBottom);
          document.getElementById("scrittaPubblicita4").style.opacity="1";
        }

    });
  
      // Check if the page has already loaded
      if (document.readyState === "complete") {
        onPageLoad();
      } else {
        window.addEventListener("load", onPageLoad);
        // Remove the event listener when component unmounts
        return () => window.removeEventListener("load", onPageLoad);
      }


    }, []);


    const goToTop = () => {
      window.scrollTo({
          top: 0,
          behavior: "smooth",
      });
  };

  const changeSfondo = (e) => {
    const file = e.target.files[0];
    if (!file.type.match(imageMimeType)) {
      alert("Image mime type is not valid");
      return;
    }
    setSfondo(file);
  }

  const changeImage = (e) => {
    const file = e.target.files[0];
    if (!file.type.match(imageMimeType)) {
      alert("Image mime type is not valid");
      return;
    }
    setImage(file);
  }

  useEffect(() => {
    let fileReader, isCancel = false;
    if (image) {
      fileReader = new FileReader();
      fileReader.onload = (e) => {
        const { result } = e.target;
        if (result && !isCancel) {
          setImageDataURL(result)
        }
      }
      fileReader.readAsDataURL(image);
    }
    return () => {
      isCancel = true;
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort();
      }
    }

  }, [image]);

  useEffect(() => {
    let fileReader, isCancel = false;
    if (sfondo) {
      fileReader = new FileReader();
      fileReader.onload = (e) => {
        const { result } = e.target;
        if (result && !isCancel) {
          setSfondoDataURL(result)
        }
      }
      fileReader.readAsDataURL(sfondo);
    }
    return () => {
      isCancel = true;
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort();
      }
    }

  }, [sfondo]);

  function applicaFiltri()
  {
    setCorsiCopia(corsi.map((corso)=>{
      if(corso.content.materia.includes(filtroMateria) || (corso.content.secondaria && corso.content.secondaria.includes(filtroMateria)))
      if(corso.content.prezzo<=value)
      return corso
    }))
  }

  function azzeraFiltri()
  {
    setCorsiCopia(corsi)
  }

  function disconnetti()
  {
    setApriModaleRegistrazione(false)
    setOpen(true)
    alertText="Registrazione fallita!"
    onDisconnect()
    handleCloseModal()
  }

  function salvaDati()
  {
    if(!username || !email || !currentAccount) 
    {
      setAlertTextCustom("Inserire tutti i campi!");
      setSeverity("warning");
      setOpenAlertCustom(true)
      return;
    }

        const dettagli={id:currentAccount,username:username,email:email,img:imageDataURL,sfondo:sfondoDataURL,descrizione:descrizione};
      setUserDetails(dettagli)

            
  }

  function CustomToggle({ children, eventKey }) {
    const decoratedOnClick = useAccordionButton(eventKey, () =>
    console.log('apri/chiudi'),
  );
    return (
      <button
        type="button"
        className={styles.bottoniSecondari}
        onClick={decoratedOnClick}

      >
        {children}
      </button>
    );
  }

    return (
      <>
      {
        apriModaleRegistrazione?(<>
         <Modal show={show} onHide={()=>disconnetti()}>
        <Modal.Header closeButton>
          <Modal.Title>Registrazione</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, scembra che tu sia un nuovo utente!!Parlaci un po di te</Modal.Body>

        <Modal.Body>Username:<input className='form-control mb-4' type="text" placeholder="xClaugod" onChange={(event) => setUsername(event.currentTarget.value)} /> </Modal.Body>
        <Modal.Body>Email:<input className='form-control mb-4' type="email" placeholder="claudiocaudullo01@gmail.com" onChange={(event) => setEmail(event.currentTarget.value)}/></Modal.Body>
        <Modal.Body>Breve descrizione: <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" onChange={(event) => setDescrizione(event.currentTarget.value)} className={styles.descrizione} placeholder="Ciao, sono uno studente universitario appassionato di informatica..." />
</Modal.Body>
        <Modal.Body>Sfondo profilo (opzionale): <input type="file" name="file" onChange={changeSfondo}/></Modal.Body>
        <Modal.Body>Foto profilo (optional): <input type="file" name="file"  onChange={changeImage}/></Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>disconnetti()}>
            Rifiuta
          </Button>
          <Button variant="primary" onClick={()=>{salvaDati();setShow(false)}}>
            Conferma
          </Button>
        </Modal.Footer>
      </Modal>
        </>):(<></>)
      }
        

        {open == true && alertText ? (<>

<Stack spacing={2} sx={{ width: '100%' }}>
  <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
    <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
      {alertText}
    </Alert>
  </Snackbar>
</Stack>

</>) : (<></>)}

            
            {isConnected ?
              (
                <><banner style={{position:"relative"}}>
   <Carousel >

      <Carousel.Item>
        <img
          className="d-block w-100 h-10"
          src={require("../images/prova2.jpg")}
          style={{height:'500px',objectFit:"cover",objectPosition:"0 60%"}}

          alt="First slide"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          style={{height:'500px',objectFit:"cover",objectPosition:"0 60%"}}
          src={require("../images/prova3.jpg")}
          alt="Second slide"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100 h-10"
          src={require("../images/prova4.png")}
          alt="Third slide"
          style={{height:'500px',objectFit:"cover",objectPosition:"0 60%"}}

        />

      </Carousel.Item>
    </Carousel>
    <div style={{display:"flex",alignItems:"center",flexFlow:"column",position:"absolute",bottom:0,left:0,right:0,zIndex:2,height:"140px",padding:"18px",background: "linear-gradient(180deg, rgba(3,50,112,0) -60%, rgba(0,0,0,1) 141%)"}}>
                <h3 style={{color:"white",fontWeight:"bold"}}>Cerca tra i corsi</h3>
   <input className='form-control mb-4' type="text" placeholder="inserisci un titolo,nome utente,descrizione" value={parolaChiave} onChange={(event) => setParolaChiave(event.currentTarget.value)} />    
</div>
            </banner><container>
                {isLoading == true ? (
                  <Loader chiamante="home" />
                ) : (<></>)}

     

                {openAlertCustom == true && alertTextCustom ? (<>

                  <Stack spacing={2} sx={{ width: '100%' }}>
                    <Snackbar open={open} autoHideDuration={5000} onClose={handleCloseCustomAlert}>
                      <Alert2 onClose={handleCloseCustomAlert} severity={severity} sx={{ width: '100%' }}>
                        {alertTextCustom}
                      </Alert2>
                    </Snackbar>
                  </Stack>

                </>) : (<></>)}

                <mainHome>


                  <>

                    <Accordion defaultActiveKey="0">
                      <Card>
                        <Card.Header>
                          <CustomToggle eventKey="0">Apri/Chiudi Filtri</CustomToggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="0">
                          <Card.Body>
                            <label>📖Materie:</label>
                            <div className={styles.containerMaterie}>
                              <select name="materia" id="materia" onChange={(event) => setFiltroMateria(event.currentTarget.value)}>
                                <option value="">Qualsiasi</option>
                                <option value="english">english</option>
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
                            </div>
                            <label>💶Prezzo massimo:</label>
                            <div className={styles.slidecontainer}>
                              <RangeSlider min={minPrezzo} max={maxPrezzo} value={value} className={styles.slider} id="myRange" onChange={(event) => handleChange(event, event.currentTarget.value)} />
                            </div>
                            <div className={styles.bottoni}>
                              <button className={styles.azzera} onClick={() => azzeraFiltri()}>Azzera</button>

                              <button onClick={() => applicaFiltri()} className={styles.filtra}>Filtra 🔍</button>
                            </div>

                          </Card.Body>
                        </Accordion.Collapse>
                      </Card>
                    </Accordion><>
                      {corsiCopia.map((corso) => {
                          if (!corso) return;
                          if (!parolaChiave) return <Card2 key={corso.content.id} item={corso.content} />;
                          else if (corso.content.titolo.includes(parolaChiave) || corso.content.descrizione.includes(parolaChiave)){
                            return <Card2 key={corso.content.id} item={corso.content} />;
                          }
                        })
                      }

                    </></></mainHome></container></>)
              : (
                <><div className={styles.textCenter}>
              <main style={{ padding: "1rem 0" }}>
                <div className={styles.containerPubblicita}>
                  <div className={`${styles.scrittaPubblicita} ${styles.fadeInLeft}`} id="scrittaPubblicita1">
                    <h2>Trova fantastici insegnanti da tutte le parti del mondo!</h2>
                  </div>
                  <div className={`${styles.immaginiPubblicita}`} id="immaginiPubblicita1">
                    <img src={require('../images/prof1.jpg')} />
                    <img src={require('../images/prof2.jpeg')} />
                    <img src={require('../images/prof3.jpg')} />
                  </div>
                </div>
              </main>
            </div><div className={styles.textCenter}>
                <main style={{ padding: "1rem 0" }}>
                  <div className={styles.containerPubblicita}>
                    <div className={`${styles.scrittaPubblicita}`} id="scrittaPubblicita2" style={{opacity:0}}>
                      <h2>Massima distanza, massima resa!</h2>
                      <h4>Segui le lezioni degli insegnanti sorseggiando un caffè comodamente da casa tua</h4>
                    </div>
                    <div className={`${styles.immaginiPubblicita}`} id="immaginiPubblicita2" style={{opacity:0}}>
                      <img src={require('../images/videocall1.jpeg')} />
                      <img src={require('../images/videocall2.jpg')} />
                      <img src={require('../images/videocall3.jpg')} />
                    </div>
                  </div>

                  <div className={styles.containerPubblicitaV2}>
                    <div className={`${styles.scrittaPubblicitaC2}`} id="scrittaPubblicita3" style={{opacity:0}}>
                      <h2>Non un monopolio, ma una decentralizzazione</h2> 
                      <h4>Il progetto che si compone dei propri utenti! Non esiste un punto centrale, tutti fanno parte della stessa catena</h4>
                    </div>
                    <div className={`${styles.immaginiPubblicitaV2}`} id="immaginiPubblicita3" style={{opacity:0}}>
                      <img src={require('../images/decentralizzazione-transformed.jpeg')} />
                    </div>
                  </div>

                  <div className={styles.containerPubblicitaV2}>
                    <div className={`${styles.scrittaPubblicitaC2} `} id="scrittaPubblicita4" style={{opacity:0}}>
                      <h2>Registrati e paga con metamask!</h2>
                      <h4>Paga i tuoi insegnanti in eth grazie a metamask</h4>
                    </div>
                    <div className={`${styles.immaginiPubblicitaV2} `} id="immaginiPubblicita4" style={{opacity:0}}>
                      <img src={require('../images/metamaskpayment.png')} />
                    </div>
                  </div>

                  <div className={styles.containerPubblicitaV2}>
                    <div className={styles.scrittaPubblicitaV2}>
                      <h2>Che aspetti ancora?</h2>
                      <h4>Impara ed insegna anche tu con WebLessons!</h4>
                    </div>
                    <div className={`${styles.immaginiPubblicitaV2}`} id="immaginiPubblicita5">
                      <img src={require('../images/finale.jpg')} />
                    </div>
                  </div>
                </main>
              </div></>
              )}
                  {showTopBtn && (<div className={styles.topToBtm}>
                <FaAngleUp className={`${styles.iconPosition} ${styles.iconStyle}`} onClick={goToTop} />
              </div>)} 
          </>
    

    
    );
}

export default Home