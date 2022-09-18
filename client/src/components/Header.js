import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "bootstrap/js/dist/dropdown";
import { MainContext } from "../context/MainContext";
import { Navbar, Nav, Button, Modal } from "react-bootstrap";
import styles from "../styles/Header.module.css";
import { useNavigate } from "react-router-dom";
const Header = () => {
  let {
    currentAccount,
    isConnected,
    onDisconnect,
    handleClose,
    detectAccount,
    metamaskDetect,
  } = useContext(MainContext);
  const navigate = useNavigate();
  const [show, setShow] = useState();
  useEffect(() => {
    navigate("/Home");
  }, [currentAccount]);
  useEffect(() => {}, [show]);
  return (
    <Navbar className={styles.navbarCustom} expand="lg">
      <Navbar.Brand>
        <img
          src={require("../images/logopiccolo.png")}
          style={{ objectFit: "cover", margin: "0px 10px 0px 10px" }}
          width="140"
          height="54"
          alt="logo"
          onClick={() => navigate("/home")}
        />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto">
          {isConnected ? (
            <>
              <Nav.Link
                style={{
                  color: "white",
                  fontSize: "20px",
                  margin: "0px 10px 0px 10px",
                }}
                as={Link}
                to={`/profilo/${currentAccount}`}
              >
                <a>Profile👤</a>
              </Nav.Link>
              <li className="nav-item dropdown">
                <a
                  style={{
                    color: "white",
                    fontSize: "20px",
                    margin: "0px 10px 0px 10px",
                  }}
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Corsi📖
                </a>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <a
                    className="dropdown-item user-select-none"
                    onClick={() => navigate("/corsiAcquistati")}
                  >
                    Corsi acquistati✅
                  </a>
                  <a
                    className="dropdown-item user-select-none"
                    onClick={() => navigate(`/profilo/${currentAccount}`)}
                  >
                    I miei corsi👤
                  </a>
                  <div className="dropdown-divider"></div>
                  <a
                    className="dropdown-item user-select-none"
                    onClick={() => navigate("/creaCorso")}
                  >
                    Crea un nuovo corso🆕
                  </a>
                </div>
              </li>
              <Nav.Link
                style={{
                  color: "white",
                  fontSize: "20px",
                  margin: "0px 10px 0px 10px",
                }}
                as={Link}
                to="/"
              >
                Conferenze📞
              </Nav.Link>
            </>
          ) : (
            ""
          )}
        </Nav>
        <Nav>
          {isConnected ? (
            <>
              <Nav.Link>
                <Button
                  className={styles.buttonLogin}
                  onClick={() => onDisconnect()}
                >
                  Logout
                </Button>
              </Nav.Link>
              <Nav.Link
                href={`https://goerli.etherscan.io/address/${currentAccount}`}
                target="_blank"
                rel="noopener noreferrer"
                className="button nav-button btn-sm mx-4"
              >
                <Button className={styles.buttonLogin}>
                  {currentAccount.slice(0, 5) +
                    "..." +
                    currentAccount.slice(38, 42)}
                </Button>
              </Nav.Link>
            </>
          ) : (
            <Button
              onClick={() => {
                setShow(detectAccount());
              }}
              className={styles.buttonMetamask}
              variant="outline-light"
            >
              <div className={styles.container}>
                <img src={require("../images/metamask(2).png")} />
                <p>Connetti Wallet</p>
              </div>
            </Button>
          )}

          {metamaskDetect && metamaskDetect == "false" ? (
            <Modal
              show={show}
              onHide={handleClose}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Header closeButton>
                <Modal.Title>No Metamask Detected</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Non-Ethereum browser detected. You should consider trying
                MetaMask!
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShow(false)}>
                  Close
                </Button>
                <Button variant="info" onClick={() => setShow(false)}>
                  <a
                    className={styles.disabledLink}
                    href="https://metamask.io/download/"
                    target="_blank"
                  >
                    GO download!
                  </a>
                </Button>
              </Modal.Footer>
            </Modal>
          ) : (
            <></>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
