import styles from "../styles/Loader.module.css";

const Loader = ({ caller }) => {
  return (
    <>
      {caller && caller != "profilo" ? (
        <div
          className={`${styles.container} ${styles.loading03} ${styles.loading}`}
        >
          <img
            src={require("../images/loading.gif")}
            className={styles.loader}
          />
          <div>
            <span>I</span>
            <span>N</span>
            {"\u00A0"}
            <span>A</span>
            <span>T</span>
            <span>T</span>
            <span>E</span>
            <span>S</span>
            <span>A</span>
            {"\u00A0"}
            <span>D</span>
            <span>I</span>
            {"\u00A0"}
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
        </div>
      ) : (
        <>
          <div
            className={`${styles.container} ${styles.loading03} ${styles.loading}`}
          >
            <img
              src={require("../images/loading.gif")}
              className={styles.loader}
            />
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
              {"\u00A0"}
              <span>D</span>
              <span>A</span>
              <span>T</span>
              <span>I</span>
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Loader;
