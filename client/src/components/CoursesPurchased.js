import React,{ useState, useContext,useEffect } from 'react'
import styles from "../styles/Home.module.css"
import Card2 from './Card';
import { MainContext } from '../context/MainContext';
import Loader from "./Loader";
import { FaAngleUp } from 'react-icons/fa';
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import RangeSlider from 'react-bootstrap-range-slider';

const CoursesPurchased = () => {

    let {buyedCourses,isConnected,isLoading}=useContext(MainContext);
    const [key,setKey]=useState("");
    const [showTopBtn, setShowTopBtn] = useState(false);
    const [maxPrice,setMaxPrice]=useState(0);
    const [minPrice,setMinPrice]=useState(0);
    const [coursesCopy,setCoursesCopy]=useState(buyedCourses);
    const [subjectFilter,setSubjectFilter]=useState("");

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
    if(buyedCourses) {
      setCoursesCopy(buyedCourses)
    }
  },[buyedCourses])

  useEffect(()=>{
    let max=0,min=99999999;
    if(coursesCopy){
      coursesCopy.map((courses)=>{
        if(!courses) return
        if(courses.content.price>max) max=courses.content.price
        if(courses.content.price<min) min=courses.content.price
      })
      setMaxPrice(max)
      setMinPrice(min)
    }

  },[coursesCopy])

  function applyFilters()
  {
    setCoursesCopy(buyedCourses.map((courses)=>{
      if(courses.content.subject.includes(subjectFilter) || (courses.content.secondary && courses.content.secondary.includes(subjectFilter)))
      if(courses.content.price<=value)
      return courses
    }))
  }

  function resetFilters()
  {
    setCoursesCopy(buyedCourses)
  }

  function CustomToggle({ children, eventKey }) {

    const decoratedOnClick = useAccordionButton(eventKey, () =>
    console.log('apri/chiudi'),
  );
  
    return (
      <button
        type="button"
        className={styles.secondaryButtons} 
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


<input className={styles.searchBar} type="text" placeholder="inserisci un titolo,nome utente,descrizione" value={key} onChange={(event) => setKey(event.currentTarget.value)} />

<mainHome>

<Accordion defaultActiveKey="0">
            <Card>
              <Card.Header>
                <CustomToggle eventKey="0">Apri/Chiudi Filtri</CustomToggle>
              </Card.Header>
              <Accordion.Collapse eventKey="0">
                <Card.Body>
                <label>📖Materie:</label>
              <div className={styles.containerSubject}>
              <select name="materia" id="materia" onChange={(event) => setSubjectFilter(event.currentTarget.value)}>
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
                              <RangeSlider min={minPrice} max={maxPrice} value={value} className={styles.slider} id="myRange" onChange={(event) => handleChange(event, event.currentTarget.value)} />
                            </div>
              <div className={styles.buttons}>             
               <button className={styles.reset} onClick={()=>resetFilters()}>Azzera</button>

                <button onClick={()=>applyFilters()} className={styles.filter}>Filtra🔍</button>
                </div>

                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>

            {isConnected ?
              (<>
                     {coursesCopy.map((courses) => {
                        if (!courses)
                          return;
                        if (!key)
                          return <Card2 key={courses.content.id} item={courses.content} />;
                        else if (courses.content.title.toLowerCase().includes(key.toLowerCase()) || courses.content.description.toLowerCase().includes(key.toLowerCase()))
                          return <Card2 key={courses.content.id} item={courses.content} />;
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

export default CoursesPurchased