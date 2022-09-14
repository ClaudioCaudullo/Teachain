import React from 'react'
import styles from "../styles/Loader.module.css"

const Loader = ({chiamante}) => {
  return (
    <>
    {chiamante && chiamante!="profilo"?( <div className={`${styles.container} ${styles.loading03} ${styles.loading}`}>
        <img src={require("../images/provacaricamento2.gif")} className={styles.caricamento}/>
        <div>
          <span>I</span>
          <span>N</span>
          {'\u00A0'}
          <span>A</span>
          <span>T</span>
          <span>T</span>
          <span>E</span>
          <span>S</span>
          <span>A</span>
          {'\u00A0'}
          <span>D</span>
          <span>I</span>
          {'\u00A0'}
          <span>M</span>
          <span>E</span>
          <span>T</span>
          <span>A</span>
          <span>M</span>
          <span>A</span>
          <span>S</span>
          <span>K</span>
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </div>
    </div>):(<><div className={`${styles.container} ${styles.loading03} ${styles.loading}`}>
        <img src={require("../images/provacaricamento2.gif")} className={styles.caricamento}/>
        <div>
        <span>C</span>
        <span>A</span>
        <span>R</span>
        <span>I</span>
        <span>C</span>
        <span>A</span>
        <span>M</span>
        <span>E</span>
        <span>N</span>
        <span>T</span>
        <span>O</span>
        {'\u00A0'}
        <span>D</span>
        <span>A</span>
        <span>T</span>
        <span>I</span>
        <span>.</span>
        <span>.</span>
        <span>.</span>
        </div>
    </div></>)
  
  }
  </>
  )
}

export default Loader