import {useNavigate} from "react-router-dom";
import styles from "../styles/CardMini.module.css"
import "../styles/Colors.css"

const CardMini = ({item}) => {
  let navigate=useNavigate();

  let tagPrimary,tagSecondary;

 tagPrimary=item.subject.toLowerCase()
 tagPrimary=tagPrimary.replace(/ /g,"")
 tagPrimary=tagPrimary.replace("(","")
 tagPrimary=tagPrimary.replace(")","")
 tagPrimary=tagPrimary.replace(".","")

 tagSecondary=item.secondary.toLowerCase()
 tagSecondary=tagSecondary.replace(/ /g,"")
 tagSecondary=tagSecondary.replace("(","")
 tagSecondary=tagSecondary.replace(")","")
 tagSecondary=tagSecondary.replace(".","")




  return (
    <>
  <div className={styles.card} >
    <div className={styles.cardHeader}>
      <img src={item.img} onClick={()=>{navigate(`/zoomCorso/${item.hash}`)}} alt="immagine corso" />
    </div>
    <div className={styles.cardBody}>
      <div className={styles.cardTags}>
      <span className={`${styles.tag} ${tagPrimary}`}>{item.subject}</span>
      {item.secondary?(<span className={`${styles.tag} ${tagSecondary}`}>{item.secondary}</span>):(<></>)}</div>
      <h4>
      {item.title.length>20?(item.title.slice(0,31)+('...')):(item.title)}
      </h4>
    </div>
  </div>
  
</>
  );
}

export default CardMini