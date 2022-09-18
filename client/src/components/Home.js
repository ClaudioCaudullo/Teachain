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
import Card2 from './Card';
import styles from '../styles/Home.module.css'
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import defaultimage from '../defaultimage';
import defaultSfondo from '../defaultSfondo';
import 'bootstrap/dist/css/bootstrap.css';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import RangeSlider from 'react-bootstrap-range-slider';
import { Carousel } from 'react-bootstrap';
import {Buffer} from 'buffer';

const Home = () => {

    let {courses,currentAccount,isConnected,isLoading,showErrorInHome,alertText,openModalRegistration,setOpenModalRegistration,onDisconnect,setHash,contractUserDetails }=useContext(MainContext);
    const [alert,setAlert]=useState("false");
    const [showTopBtn, setShowTopBtn] = useState(false);
    const [keyWord,setKeyWord]=useState("");
    const [filterSubject,setFilterSubject]=useState("");
    const [coursesCopy,setCoursesCopy]=useState(courses);
    const [maxPrice,setMaxPrice]=useState(0);
    const [userDetails,setUserDetails]=useState("");
    const [minPrice,setMinPrice]=useState(0);
    const [homeLoading,setHomeLoading]=useState(false);
    const[username,setUsername]=useState("");
    const[email,setEmail]=useState("");
    const[image,setImage]=useState("");
    const[bound,setBound]=useState(1);
    const[background,setBackground]=useState("");
    const[description,setDescription]=useState("");
    const[alertTextCustom,setAlertTextCustom]=useState("");
    const[openAlertCustom,setOpenAlertCustom]=useState("");
    const[severity,setSeverity]=useState("");
    const[imageDataURL,setImageDataURL]=useState(defaultimage);
    const[backgroundDataURL,setBackgroundDataURL]=useState(defaultSfondo);

    const imageMimeType = /image\/(png|jpg|jpeg)/i;
    const projectId = '2DJBRuSe2FV6WmWXCNkgDEVjeZ6';
    
    const projectSecret = '07885af6bec7df195a06e71cd0fb1126';  
    const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
  
    const client = ipfsHttpClient({
        host: 'ipfs.infura.io',
        port: 5001,
        protocol: 'https',
        headers: {
            authorization: auth,
        },
    });
    
      const [value, setValue] = React.useState(0);
    
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
        setOpen(openModalRegistration)
        setShow(openModalRegistration)
    },[openModalRegistration])

    useEffect(()=>{
      if(courses) {
        setCoursesCopy(courses)
      }
    },[courses])

    useEffect(()=>{
      if(Object.keys(coursesCopy).length === 0) return;
      let max=0,min=99999999;
      if(coursesCopy && bound==1){
        coursesCopy.map((course)=>{
          if(!course) return
          if(course.content.price>max) max=course.content.price
          if(course.content.price<min) min=course.content.price
        })
        setMaxPrice(max)
        setMinPrice(min)
        setBound(0)
      }

    },[coursesCopy])

    useEffect(()=>{
        setValue(maxPrice)
    },[maxPrice])


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
        }
        if (document.getElementById("scrittaPubblicita2") && isScrolledIntoView(document.getElementById("scrittaPubblicita2"))) {
          document.getElementById("scrittaPubblicita2").classList.add(styles.fadeInLeft);
        }

        if (document.getElementById("immaginiPubblicita3") && isScrolledIntoView(document.getElementById("immaginiPubblicita3"))) {
          document.getElementById("immaginiPubblicita3").classList.add(styles.slideIn);
        }
        if (document.getElementById("scrittaPubblicita3") && isScrolledIntoView(document.getElementById("scrittaPubblicita3"))) {
          document.getElementById("scrittaPubblicita3").classList.add(styles.bounceInBottom);
          document.getElementById("scrittaPubblicita3").style.opacity="1";
        }

        if (document.getElementById("immaginiPubblicita4") && isScrolledIntoView(document.getElementById("immaginiPubblicita4"))) {
          document.getElementById("immaginiPubblicita4").classList.add(styles.slideIn);
        }
        if (document.getElementById("scrittaPubblicita4") && isScrolledIntoView(document.getElementById("scrittaPubblicita4"))) {
          document.getElementById("scrittaPubblicita4").classList.add(styles.bounceInBottom);
          document.getElementById("scrittaPubblicita4").style.opacity="1";
        }

    });
  
      if (document.readyState === "complete") {
        onPageLoad();
      } else {
        window.addEventListener("load", onPageLoad);
        return () => window.removeEventListener("load", onPageLoad);
      }


    }, []);


    const goToTop = () => {
      window.scrollTo({
          top: 0,
          behavior: "smooth",
      });
  };

  const changeBackground = (e) => {
    const file = e.target.files[0];
    if (!file.type.match(imageMimeType)) {
      alert("Image mime type is not valid");
      return;
    }
    setBackground(file);
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
    if (background) {
      fileReader = new FileReader();
      fileReader.onload = (e) => {
        const { result } = e.target;
        if (result && !isCancel) {
          setBackgroundDataURL(result)
        }
      }
      fileReader.readAsDataURL(background);
    }
    return () => {
      isCancel = true;
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort();
      }
    }

  }, [background]);

  function applyFilters()
  {
    setCoursesCopy(courses.map((course)=>{
      if(course.content.subject.includes(filterSubject) || (course.content.secondary && course.content.secondary.includes(filterSubject)))
      if(course.content.price<=value)
      return course
    }))
  }

  function resetFilters()
  {
    setCoursesCopy(courses)
  }

  function disconnect()
  {
    setOpenModalRegistration(false)
    setOpen(true)
    alertText="Registrazione fallita!"
    onDisconnect()
    handleCloseModal()
  }

  useEffect(()=>{
     uploadUserDetails();
  },[userDetails])

  const uploadUserDetails = async () => {
    if (!userDetails) return
    setHomeLoading(true)
    let hash
    try {
        let options={
          warpWithDirectory:true,
        }
        const result = await client.add(JSON.stringify({ userDetails }),options)
        hash = result.path
    } catch (error) {
      setAlertTextCustom("Registrazione fallita: ",error.code)
      setShow(true)
      setHomeLoading(false)
      return;
    }
    await(await contractUserDetails.addUser(currentAccount,userDetails.username,userDetails.email,hash)
    .catch(
      (error)=>{
        setAlertTextCustom("Registrazione fallita: ",error.code)
        setShow(true)
        setHomeLoading(false)
        return;
      }
    )
    ).wait()
    setShow(true)
    setAlertTextCustom("Registrazione effettuata con successo!!")
    setOpenModalRegistration(false)
    setHash(hash)
    setHomeLoading(false)
  }

  function saveData()
  {
    if(!username || !email || !currentAccount) 
    {
      setAlertTextCustom("Inserire tutti i campi!");
      setSeverity("warning");
      setOpenAlertCustom(true)
      return;
    }
    if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email))
      {
        setAlertTextCustom("Inserisci un email valida!")
        setSeverity("warning");
        setOpenAlertCustom(true)
        return;
      }  
      const details={id:currentAccount,username:username,email:email,img:imageDataURL,background:backgroundDataURL,description:description};
      setUserDetails(details)
      setShow(false)  
  }

  function CustomToggle({ children, eventKey }) {
    const decoratedOnClick = useAccordionButton(eventKey, () =>
    console.log('apri/chiudi'),
  );
    return (
      <button
        type="button"
        className={styles.secondaryButton}
        onClick={decoratedOnClick}
      >
        {children}
      </button>
    );
  }

    return (
      <>
      {
        openModalRegistration?(<>
         <Modal show={show} onHide={()=>disconnect()}>
        <Modal.Header closeButton>
          <Modal.Title>Registrazione</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, scembra che tu sia un nuovo utente!!Parlaci un po di te</Modal.Body>

        <Modal.Body>Username:<input className='form-control mb-4' type="text" placeholder="xClaugod" onChange={(event) => setUsername(event.currentTarget.value)} /> </Modal.Body>
        <Modal.Body>Email:<input className='form-control mb-4' type="email" placeholder="claudiocaudullo01@gmail.com" onChange={(event) => setEmail(event.currentTarget.value)}/></Modal.Body>
        <Modal.Body>Breve descrizione: <textarea class="form-control" id="exampleFormControlTextarea1" rows="3" onChange={(event) => setDescription(event.currentTarget.value)} className={styles.description} placeholder="Ciao, sono uno studente universitario appassionato di informatica..." />
</Modal.Body>
        <Modal.Body>Sfondo profilo (opzionale): <input type="file" name="file" onChange={changeBackground}/></Modal.Body>
        <Modal.Body>Foto profilo (optional): <input type="file" name="file"  onChange={changeImage}/></Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>disconnect()}>
            Rifiuta
          </Button>
          <Button variant="primary" onClick={()=>{saveData()}}>
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
          className={`d-block w-100 h-10 ${styles.carouselImage}`}
          src={require("../images/prova2.jpg")}
          alt="First slide"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className={`d-block w-100 h-10 ${styles.carouselImage}`}
          src={require("../images/prova3.jpg")}
          alt="Second slide"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className={`d-block w-100 h-10 ${styles.carouselImage}`}
          src={require("../images/prova4.png")}
          alt="Third slide"
        />

      </Carousel.Item>
    </Carousel>
    <div style={{display:"flex",alignItems:"center",flexFlow:"column",position:"absolute",bottom:0,left:0,right:0,zIndex:2,height:"140px",padding:"18px",background: "linear-gradient(180deg, rgba(3,50,112,0) -60%, rgba(0,0,0,1) 141%)"}}>
                <h3 style={{color:"white",fontWeight:"bold"}}>Cerca tra i corsi</h3>
   <input className='form-control mb-4' type="text" placeholder="inserisci un titolo,nome utente,descrizione" value={keyWord} onChange={(event) => setKeyWord(event.currentTarget.value)} />    
</div>
            </banner><container>
                {isLoading == true || homeLoading==true ? (
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
                            <div className={styles.containerSubject}>
                              <select name="materia" id="materia" onChange={(event) => setFilterSubject(event.currentTarget.value)}>
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
                              <RangeSlider min={minPrice}  tooltipPlacement='top' tooltip='on' max={maxPrice} value={value} className={styles.slider} id="myRange" onChange={(event) => handleChange(event, event.currentTarget.value)} />
                            </div>
                            <div className={styles.buttons}>
                              <button className={styles.reset} onClick={() => resetFilters()}>Azzera</button>

                              <button onClick={() => applyFilters()} className={styles.filter}>Filtra 🔍</button>
                            </div>

                          </Card.Body>
                        </Accordion.Collapse>
                      </Card>
                    </Accordion><>
                      {coursesCopy.map((course) => {
                          if (!course) return;
                          if (!keyWord) return <Card2 key={course.content.id} item={course.content} />;
                          else if (course.content.title.toLowerCase().includes(keyWord.toLowerCase()) || course.content.description.toLowerCase().includes(keyWord.toLowerCase())){
                            return <Card2 key={course.content.id} item={course.content} />;
                          }
                        })
                      }

                    </></></mainHome></container></>)
              : (
                <><div className={styles.textCenter}>
              <main style={{ padding: "1rem 0" }}>
                <div className={styles.containerAds}>
                  <div className={`${styles.textAds} ${styles.fadeInLeft}`} id="scrittaPubblicita1">
                    <h2>Trova fantastici insegnanti da tutte le parti del mondo!</h2>
                  </div>
                  <div className={`${styles.imageAds}`} id="immaginiPubblicita1">
                    <img src={require('../images/prof1.jpg')} />
                    <img src={require('../images/prof2.jpeg')} />
                    <img src={require('../images/prof3.jpg')} />
                  </div>
                </div>
              </main>
            </div><div className={styles.textCenter}>
                <main style={{ padding: "1rem 0" }}>
                  <div className={styles.containerAds}>
                    <div className={`${styles.textAds}`} id="scrittaPubblicita2" style={{opacity:0}}>
                      <h2>Massima distanza, massima resa!</h2>
                      <h4>Segui le lezioni degli insegnanti sorseggiando un caffè comodamente da casa tua</h4>
                    </div>
                    <div className={`${styles.imageAds}`} id="immaginiPubblicita2" style={{opacity:0}}>
                      <img src={require('../images/videocall1.jpeg')} />
                      <img src={require('../images/videocall2.jpg')} />
                      <img src={require('../images/videocall3.jpg')} />
                    </div>
                  </div>

                  <div className={styles.containerAdsV2}>
                    <div className={`${styles.textAdsV2}`} id="scrittaPubblicita3" style={{opacity:0}}>
                      <h2>Non un monopolio, ma una decentralizzazione</h2> 
                      <h4>Il progetto che si compone dei propri utenti! Non esiste un punto centrale, tutti fanno parte della stessa catena</h4>
                    </div>
                    <div className={`${styles.imageAdsV2}`} id="immaginiPubblicita3" style={{opacity:0}}>
                      <img src={require('../images/decentralizzazione-transformed.jpeg')} />
                    </div>
                  </div>

                  <div className={styles.containerAdsV2}>
                    <div className={`${styles.textAdsV2} `} id="scrittaPubblicita4" style={{opacity:0}}>
                      <h2>Registrati e paga con metamask!</h2>
                      <h4>Paga i tuoi insegnanti in eth grazie a metamask</h4>
                    </div>
                    <div className={`${styles.imageAdsV2} `} id="immaginiPubblicita4" style={{opacity:0}}>
                      <img src={require('../images/metamaskpayment.png')} />
                    </div>
                  </div>

                  <div className={styles.containerAdsV2}>
                    <div className={styles.textAdsV2}>
                      <h2>Che aspetti ancora?</h2>
                      <h4>Impara ed insegna anche tu con WebLessons!</h4>
                    </div>
                    <div className={`${styles.imageAdsV2}`} id="immaginiPubblicita5">
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