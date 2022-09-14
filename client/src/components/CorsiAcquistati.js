import React,{ useState, useContext,useEffect } from 'react'
import { Row, Form, Button, ListGroup } from 'react-bootstrap'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import styles from "../styles/Home.module.css"
import Card2 from './Card2';
import { MainContext } from '../context/MainContext';
import Loader from "./Loader";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { FaAngleUp } from 'react-icons/fa';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import RangeSlider from 'react-bootstrap-range-slider';

async function ipfsClient(){
const client = await ipfsHttpClient({
  
  host:'ipfs.infura.io',
  port: 5001,
  protocol: "https"

});
return  client
}

const CorsiAcquistati = () => {

    let {corsi,corsiComprati,currentAccount,isConnected,isLoading,showErrorInHome,alertText }=useContext(MainContext);
    const [alert,setAlert]=useState("false");
    const [parolaChiave,setParolaChiave]=useState("");
    const [showTopBtn, setShowTopBtn] = useState(false);
    const [maxPrezzo,setMaxPrezzo]=useState(0);
    const [minPrezzo,setMinPrezzo]=useState(0);
    const [corsiCopia,setCorsiCopia]=useState(corsiComprati);
    const [filtroMateria,setFiltroMateria]=useState("");

    const goToTop = () => {
      window.scrollTo({
          top: 0,
          behavior: "smooth",
      });
  };

  const [value, setValue] = React.useState(50);
    
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  useEffect(()=>{
    if(corsiComprati) {
      setCorsiCopia(corsiComprati)
    }
  },[corsiComprati])

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

  function applicaFiltri()
  {
    setCorsiCopia(corsiComprati.map((corso)=>{
      if(corso.content.materia.includes(filtroMateria) || (corso.content.secondaria && corso.content.secondaria.includes(filtroMateria)))
      if(corso.content.prezzo<=value)
      return corso
    }))
  }

  function azzeraFiltri()
  {
    setCorsiCopia(corsiComprati)
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

            <container>
            {
      isLoading==true?(
      <Loader chiamante="home"/>              
        ):(<></>)
    }


<input className={styles.barraDiRicerca} type="text" placeholder="inserisci un titolo,nome utente,descrizione" value={parolaChiave} onChange={(event) => setParolaChiave(event.currentTarget.value)} />

<mainHome>

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
               <button className={styles.azzera} onClick={()=>azzeraFiltri()}>Azzera</button>

                <button onClick={()=>applicaFiltri()} className={styles.filtra}>Filtra🔍</button>
                </div>

                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>

            {isConnected ?
              (<>
                     {corsiCopia.map((corso) => {
                        if (!corso)
                          return;
                        if (!parolaChiave)
                          return <Card2 key={corso.content.id} item={corso.content} />;
                        else if (corso.content.titolo.includes(parolaChiave) || corso.content.descrizione.includes(parolaChiave))
                          return <Card2 key={corso.content.id} item={corso.content} />;
                      })}
                {showTopBtn && (<div className={styles.topToBtm}>
                  <FaAngleUp className={`${styles.iconPosition} ${styles.iconStyle}`} onClick={goToTop} />
                </div>)}
              </>)
              : (
                <div className={styles.textCenter}>
                  <main style={{ padding: "1rem 0" }}>
                    <h2>Login first</h2>
                  </main>
                </div>
              )}
 </mainHome></container></>
    );
}

export default CorsiAcquistati