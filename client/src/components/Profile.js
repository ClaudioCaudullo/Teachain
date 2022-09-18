import "../styles/Profile.css";
import React, { useContext, useEffect, useState, useCallback } from "react";
import { MainContext } from "../context/MainContext";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import { useParams } from "react-router-dom";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { Buffer } from "buffer";
import Review from "./Review";
import Loader from "./Loader";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import CardMini from "./CardMini";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Accordion from "react-bootstrap/Accordion";
import { useAccordionButton } from "react-bootstrap/AccordionButton";
import Card from "react-bootstrap/Card";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function CustomToggle({ children, eventKey }) {
  const decoratedOnClick = useAccordionButton(eventKey, () =>
    console.log("apri/chiudi")
  );
  return (
    <button
      type="button"
      className="secondaryButton"
      onClick={decoratedOnClick}
    >
      {children}
    </button>
  );
}

const Profile = () => {
  let {
    isConnected,
    loadExternalUserData,
    setHash,
    currentAccount,
    userCourses,
    loadUserCourses,
    loadUserReviews,
    contractReviews,
    reviews,
    contractUserDetails,
    setProfileImage,
  } = useContext(MainContext);

  const [vote, setVote] = useState(2);
  const [value, setValue] = useState(0);
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const [text, setText] = useState("");
  const [localProfileImage, setLocalProfileImage] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [fileImage, setFileImage] = useState("");
  const [fileBackground, setFileBackground] = useState("");
  const [fileImageURL, setFileImageURL] = useState("");
  const [fileBackgroundURL, setFileBackgroundURL] = useState("");
  const [userDetails, setUserDetails] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [hash, setProfileHash] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [disponibility, setDisponibility] = useState([]);
  const imageMimeType = /image\/(png|jpg|jpeg)/i;
  const [loading, setLoading] = useState("false");
  const [alert, setAlert] = useState("false");
  const [severity, setSeverity] = useState("");
  const [alertText, setAlertText] = useState("");
  const [presentReview, setPresentReview] = useState(false);
  const [idReview, setIdReview] = useState("");
  const [hashReview, setHashReview] = useState("");
  const [averageVote, setAverageVote] = useState(0);
  const [numReviews, setNumReviews] = useState(0);
  const [description, setDescription] = useState("");
  const [flipBackground, setFlipBackground] = useState("");
  const [flipImage, setFlipImage] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const minDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate()
  );
  const maxDate = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    new Date().getDate()
  );
  const [newDate, setNewDate] = useState([]);
  const [counter, setCounter] = useState(0);
  const [allEvents, setAllEvents] = useState([{}]);
  const [event, setEvent] = useState("");

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const [open, setOpen] = React.useState(true);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const id = useParams();
  const projectId = "2DJBRuSe2FV6WmWXCNkgDEVjeZ6";
  const projectSecret = "07885af6bec7df195a06e71cd0fb1126";

  const auth =
    "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

  const locales = {
    "en-US": require("date-fns/locale/en-US"),
  };
  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
  });

  const client = ipfsHttpClient({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
      authorization: auth,
    },
  });

  useEffect(() => {
    setEndDate(startDate);
  }, [startDate]);

  const uploadReview = async () => {
    if (!review) return;
    setLoading("true");
    let hash;
    try {
      let options = {
        warpWithDirectory: true,
      };
      const result = await client.add(JSON.stringify({ review }), options);
      hash = result.path;
    } catch (error) {
      setAlertText("ipfs image upload error: ", error);
      setOpen(true);
      setSeverity("error");
      setLoading("false");
    }
    await (
      await contractReviews.addReview(hash, id.userid).catch((err) => {
        setAlertText(err.code);
        setOpen(true);
        setSeverity("error");
        setLoading("false");
      })
    ).wait();
    await loadUserReviews(id.userid);
    setAlertText("Recensione aggiunta con successo!");
    setOpen(true);
    setSeverity("success");
    setLoading("false");
  };

  const uploadProfileChange = async () => {
    if (!userDetails) return;
    setLoading("true");
    let hash2;
    try {
      let options = {
        warpWithDirectory: true,
      };
      const result = await client.add(JSON.stringify({ userDetails }), options);
      hash2 = result.path;
      if (hash2 == hash) {
        setLoading("false");
        return;
      }
    } catch (error) {
      setAlertText("ipfs image upload error: ", error);
      setOpen(true);
      setSeverity("error");
      setLoading("false");
    }
    await (
      await contractUserDetails
        .changeDetails(hash, hash2, newUsername, newEmail)
        .catch((err) => {
          setAlertText(err.code);
          setOpen(true);
          setSeverity("error");
          setLoading("false");
          return;
        })
    ).wait();
    setAlertText("Modifiche avvenute con successo!");
    setOpen(true);
    setSeverity("success");
    setLoading("false");
    await contractUserDetails.getUser(currentAccount);
    setUsername(newUsername);
    setNewUsername(newUsername);
    setEmail(newEmail);
    setNewEmail(newEmail);
    setDescription(newDescription);
    setNewDescription(newDescription);
    setProfileHash(hash2);
    setHash(hash2);
    if (flipBackground && fileBackground) setBackgroundImage(fileBackgroundURL);
    if (flipImage && fileImage) {
      setLocalProfileImage(fileImageURL);
      setProfileImage(fileImageURL);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (review) await uploadReview();
    };
    fetchData();
  }, [review]);

  async function saveData() {
    if (!currentAccount || !title || !text || !vote || !id.userid) {
      setAlertText("Inserisci tutti i campi!");
      setOpen(true);
      setSeverity("warning");
      setLoading("false");
    } else {
      const newReview = {
        creator: currentAccount,
        title: title,
        text: text,
        vote: vote,
        reviewed: id.userid,
      };
      setReview(newReview);
    }
  }

  useEffect(() => {
    if (localProfileImage && backgroundImage && username && email) {
      setLoading("false");
    } else setLoading("true");
  }, [localProfileImage, backgroundImage, username, email, hash]);

  useEffect(() => {
    const fetchData = async () => {
      let numReviews = 0,
        totalVote = 0;
      reviews.map((review) => {
        if (review) {
          if (
            review.content.creator == currentAccount &&
            review.content.reviewed == id.userid
          ) {
            setTitle(review.content.title);
            setVote(review.content.vote);
            setText(review.content.text);
            setIdReview(review.id);
            setHashReview(review.content.hash);
            setPresentReview(true);
          }
          numReviews++;
          totalVote += review.content.vote;
        }
      });
      setNumReviews(numReviews);
      totalVote /= numReviews;
      setAverageVote(totalVote);
      setLoading("false");
    };
    fetchData().catch(() => {
      setLoading("false");
    });
  }, [reviews]);

  useEffect(() => {
    if (currentAccount) {
      const fetchData = async () => {
        setLoading("true");

        let hashExternalUser = await loadExternalUserData(id.userid);
        await loadUserCourses(id.userid);
        await loadUserReviews(id.userid);
        if (hashExternalUser) {
          let response = await fetch(
            `https://learningdata.infura-ipfs.io/ipfs/${hashExternalUser}`
          );
          let content = await response.json();
          let support = [];
          let max = 0;
          setLocalProfileImage(content.userDetails.img);
          setBackgroundImage(content.userDetails.background);
          setUsername(content.userDetails.username);
          setNewUsername(content.userDetails.username);
          setEmail(content.userDetails.email);
          setNewEmail(content.userDetails.email);
          setProfileHash(hashExternalUser);
          if (content.userDetails.disponibility) {
            content.userDetails.disponibility.map((disp) => {
              if (max < disp.id) max = disp.id;
              support.push(disp);
            });
            setCounter(max + 1);
            setAllEvents(support);
          }
          setDescription(content.userDetails.description);
          setNewDescription(content.userDetails.description);
        } else {
          setLocalProfileImage("n");
          setBackgroundImage("n");
          setUsername("Nessun utente con questo id");
          setNewUsername(username);
          setEmail("Nessun utente con questo id");
          setNewEmail(email);
          setProfileHash("Nessun utente con questo hash");
          setLoading("false");
          setDescription("Nessun utente con questo id");
          setNewDescription("Nessun utente con questo id");
        }
      };

      fetchData().catch((error) => {
        setLocalProfileImage("");
        setBackgroundImage("");
        setUsername("Nessun utente con questo id");
        setNewUsername(username);
        setEmail("Nessun utente con questo id");
        setNewEmail(email);
        setDescription("Nessun utente con questo id");
        setNewDescription("Nessun utente con questo id");
        setProfileHash("Nessun utente con questo hash");
        setAlertText("ipfs image upload error: ", error);
        setOpen(true);
        setSeverity("error");
        setLoading("false");
      });
    }
  }, [currentAccount, id]);

  const inputSfondoRef = React.useRef();
  const inputImageRef = React.useRef();
  const clickBooking = React.useRef();
  const clickRemove = React.useRef();
  const clickRemoveDisponibility = React.useRef();

  const onFileImageChangeCapture = (e) => {
    const file = e.target.files[0];
    if (!file.type.match(imageMimeType)) {
      return;
    }
    setFileImage(file);
  };

  const onFileBackgroundChangeCapture = (e) => {
    const file = e.target.files[0];
    if (!file.type.match(imageMimeType)) {
      alert("Image mime type is not valid");
      return;
    }
    setFileBackground(file);
  };

  useEffect(() => {
    let fileReader,
      isCancel = false;
    if (fileImage) {
      fileReader = new FileReader();
      fileReader.onload = (e) => {
        const { result } = e.target;
        if (result && !isCancel) {
          setFileImageURL(result);
        }
      };
      fileReader.readAsDataURL(fileImage);
    }
    return () => {
      isCancel = true;
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort();
      }
    };
  }, [fileImage]);

  useEffect(() => {
    let fileReader,
      isCancel = false;
    if (fileBackground) {
      fileReader = new FileReader();
      fileReader.onload = (e) => {
        const { result } = e.target;
        if (result && !isCancel) {
          setFileBackgroundURL(result);
        }
      };
      fileReader.readAsDataURL(fileBackground);
    }
    return () => {
      isCancel = true;
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort();
      }
    };
  }, [fileBackground]);

  const handleChangeTabs = (event, newValue) => {
    setValue(newValue);
  };

  const [windowSize, setWindowSize] = useState(getWindowSize());

  function getWindowSize() {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
  }

  async function confirmModifyBackgroundImage() {
    if (
      !currentAccount ||
      !username ||
      !email ||
      !localProfileImage ||
      !fileBackgroundURL
    ) {
      setAlertText("Inserisci l'immagine di sfondo!");
      setOpen(true);
      setSeverity("warning");
      setLoading("false");
      return;
    }
    setFlipBackground(true);
    let newProfile = {
      id: currentAccount,
      username: username,
      email: email,
      img: localProfileImage,
      background: fileBackgroundURL,
      description: description,
      disponibility: allEvents,
    };
    setUserDetails(newProfile);
  }

  async function confirmModifyProfileImage() {
    if (
      !currentAccount ||
      !username ||
      !email ||
      !fileImageURL ||
      !backgroundImage
    ) {
      setAlertText("Inserisci l'immagine di profilo!");
      setOpen(true);
      setSeverity("warning");
      setLoading("false");
      return;
    }
    setFlipImage(true);
    let newProfile = {
      id: currentAccount,
      username: username,
      email: email,
      img: fileImageURL,
      background: backgroundImage,
      description: description,
      disponibility: allEvents,
    };
    setUserDetails(newProfile);
  }

  async function confirmModifyUsername() {
    if (
      !currentAccount ||
      !newUsername ||
      !email ||
      !localProfileImage ||
      !backgroundImage
    ) {
      setAlertText("Inserisci l'username!");
      setOpen(true);
      setSeverity("warning");
      setLoading("false");
      return;
    }
    let newProfile = {
      id: currentAccount,
      username: newUsername,
      email: email,
      img: localProfileImage,
      background: backgroundImage,
      description: description,
      disponibility: allEvents,
    };
    setUserDetails(newProfile);
  }

  async function confirmModifyEmail() {
    if (
      !currentAccount ||
      !username ||
      !email ||
      !newEmail ||
      !backgroundImage ||
      !newDescription
    ) {
      setAlertText("Inserisci l'email!");
      setOpen(true);
      setSeverity("warning");
      setLoading("false");
      return;
    }

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(newEmail)) {
      setAlertText("Inserisci un email valida!");
      setOpen(true);
      setSeverity("warning");
      setLoading("false");
      return;
    }
    let newProfile = {
      id: currentAccount,
      username: username,
      email: newEmail,
      img: localProfileImage,
      background: backgroundImage,
      description: description,
      disponibility: allEvents,
    };
    setUserDetails(newProfile);
  }

  async function confirmModifyDescription() {
    if (
      !currentAccount ||
      !username ||
      !email ||
      !newEmail ||
      !backgroundImage ||
      !newDescription
    ) {
      setAlertText("Inserisci l'email!");
      setOpen(true);
      setSeverity("warning");
      setLoading("false");
      return;
    }
    let newProfile = {
      id: currentAccount,
      username: username,
      email: email,
      img: localProfileImage,
      background: backgroundImage,
      description: newDescription,
      disponibility: allEvents,
    };
    setUserDetails(newProfile);
  }

  async function modifyReview() {
    if (!title || !vote || !text) {
      setAlertText("Inserisci tutti i campi!");
      setOpen(true);
      setSeverity("warning");
      setLoading("false");
      return;
    }
    setLoading("true");
    const review = {
      creator: currentAccount,
      title: title,
      text: text,
      vote: vote,
      reviewed: id.userid,
    };
    let hash;
    try {
      let options = {
        warpWithDirectory: true,
      };
      const result = await client.add(JSON.stringify({ review }), options);
      hash = result.path;
    } catch (error) {
      setAlertText("ipfs change error: ", error);
      setOpen(true);
      setSeverity("error");
      setLoading("false");
    }
    await (
      await contractReviews.changeReview(hashReview, hash).catch((err) => {
        setAlertText(err.code);
        setOpen(true);
        setSeverity("error");
        setLoading("false");
      })
    ).wait();
    await loadUserReviews(id.userid);
    setAlertText("Recensione modificata con successo!");
    setOpen(true);
    setSeverity("success");
    setLoading("false");
    setHashReview(hash);
  }

  async function deleteReview() {
    setLoading("true");
    await (
      await contractReviews.deleteReview(idReview).catch((err) => {
        setAlertText(err.code);
        setOpen(true);
        setSeverity("error");
        setLoading("false");
      })
    ).wait();
    await loadUserReviews(id.userid);
    setPresentReview(false);
    setAlertText("Recensione eliminata con successo!");
    setOpen(true);
    setSeverity("success");
    setLoading("false");
  }

  const renderDayContents = (day, date) => {
    if (date < minDate || date > maxDate) {
      return <span></span>;
    }
    return <span>{date.getDate()}</span>;
  };

  const filterPassedTime = (time) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);

    return currentDate.getTime() < selectedDate.getTime();
  };

  const filterPassedTimeFromStart = (time) => {
    const currentDate = startDate;
    const selectedDate = new Date(time);

    return currentDate.getTime() < selectedDate.getTime();
  };

  function insertDate() {
    let data = {
      id: counter + 1,
      start: startDate,
      end: endDate,
      title: "Disponibile",
    };
    if (!data || !data.start || !data.end) return;
    if (newDate) {
      var x = newDate.map((newDate) => {
        if (newDate.start == data.start || newDate.end == data.end) {
          return 0;
        }
      });
      if (x.includes(0)) return;
    }
    if (!newDate || newDate == {}) setNewDate(data);
    else setNewDate((arr) => [...arr, data]);
    setCounter(counter + 1);
  }

  function insertDates() {
    if (!newDate || newDate == {}) return;
    if (!disponibility || disponibility == {}) setDisponibility(newDate);
    else {
      let support = [];
      newDate.map((data) => {
        if (data) support.push(data);
      });
      allEvents.map((data) => {
        if (data) support.push(data);
      });
      setDisponibility(support);
    }
  }

  function removeDate(id) {
    setNewDate(newDate.filter((item) => item.id !== id));
  }

  function confirmBooking() {
    let support = allEvents;
    support.map((disponibility) => {
      if (disponibility.id == event.id) {
        disponibility.title = "Lezione all'user " + currentAccount;
        disponibility.booker = currentAccount;
      }
    });
    let newProfile = {
      id: id.userid,
      username: username,
      email: email,
      img: localProfileImage,
      background: backgroundImage,
      description: description,
      disponibility: support,
    };
    setUserDetails(newProfile);
  }
  function removeBooking() {
    let support = allEvents;
    support.map((disponibility) => {
      if (disponibility.id == event.id) {
        disponibility.title = "Disponibile";
        disponibility.booker = "";
      }
    });
    let newProfile = {
      id: id.userid,
      username: username,
      email: email,
      img: localProfileImage,
      background: backgroundImage,
      description: description,
      disponibility: support,
    };
    setUserDetails(newProfile);
    setAllEvents(support);
  }

  function removeDisponibility() {
    let newDisponibility = allEvents;
    newDisponibility = newDisponibility.filter((e) => e.id != event.id);

    let newProfile = {
      id: currentAccount,
      username: username,
      email: email,
      img: localProfileImage,
      background: backgroundImage,
      description: description,
      disponibility: newDisponibility,
    };
    setUserDetails(newProfile);
    setAllEvents(newDisponibility);
  }

  useEffect(() => {
    if (
      !disponibility ||
      disponibility == {} ||
      Object.keys(disponibility).length === 0
    ) {
    } else {
      let newProfile = {
        id: currentAccount,
        username: username,
        email: email,
        img: localProfileImage,
        background: backgroundImage,
        description: newDescription,
        disponibility: disponibility,
      };
      setAllEvents(disponibility);
      setUserDetails(newProfile);
      setNewDate([]);
      setDisponibility([]);
    }
  }, [disponibility]);

  const handleSelectEvent = useCallback((event) => {
    if (currentAccount != id.userid) {
      if (event.title == "Disponibile") {
        setEvent(event);
        return clickBooking.current.click();
      } else if (event.booker == currentAccount) {
        setEvent(event);
        return clickRemove.current.click();
      }
    } else {
      setEvent(event);
      return clickRemoveDisponibility.current.click();
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      await uploadProfileChange();
    };
    if (userDetails) fetchData();
  }, [userDetails]);
  return (
    <>
      {isConnected ? (
        <>
          {loading == "true" ? <Loader chiamante="profilo" /> : <></>}
          {open == true && severity ? (
            <>
              <Stack spacing={2} sx={{ width: "100%" }}>
                <Snackbar
                  open={open}
                  autoHideDuration={3000}
                  onClose={handleClose}
                >
                  <Alert
                    onClose={handleClose}
                    severity={severity}
                    sx={{ width: "100%" }}
                  >
                    {alertText}
                  </Alert>
                </Snackbar>
              </Stack>
            </>
          ) : (
            <></>
          )}
          <div className="container">
            {currentAccount != id.userid ? (
              <header
                style={{ backgroundImage: `url(${backgroundImage})` }}
                className="noHover"
              ></header>
            ) : (
              <header
                data-bs-toggle="modal"
                data-bs-target="#backgroundImage"
                style={{ backgroundImage: `url(${backgroundImage})` }}
              ></header>
            )}
            <div
              className="modal fade"
              id="backgroundImage"
              data-bs-backdrop="static"
              data-bs-keyboard="false"
              tabIndex="-1"
              aria-labelledby="staticBackdropLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="staticBackdropLabel">
                      Cambio foto sfondo
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div class="modal-body bodyModal">
                    <img
                      src={fileBackgroundURL}
                      className="photoModal"
                      alt="nessuna immagine scelta"
                    ></img>
                  </div>
                  <div class="modal-footer">
                    <button
                      type="button"
                      className="btnCancel"
                      onClick={() => setFileBackgroundURL("")}
                    >
                      Reset
                    </button>
                    {!fileBackgroundURL ? (
                      <button
                        type="button"
                        className="btnReview"
                        onClick={() => inputSfondoRef.current.click()}
                      >
                        Scegli foto...
                      </button>
                    ) : (
                      <button
                        type="button"
                        data-bs-dismiss="modal"
                        className="btnReview"
                        onClick={() => confirmModifyBackgroundImage()}
                      >
                        Conferma
                      </button>
                    )}
                    <input
                      type="file"
                      className="d-none"
                      ref={inputSfondoRef}
                      onChangeCapture={onFileBackgroundChangeCapture}
                    ></input>
                  </div>
                </div>
              </div>
            </div>

            <main>
              <div className="row">
                <div className="left">
                  {currentAccount == id.userid ? (
                    <img
                      className="photo"
                      src={localProfileImage}
                      data-bs-toggle="modal"
                      data-bs-target="#staticBackdrop"
                    />
                  ) : (
                    <img className="photo noHover" src={localProfileImage} />
                  )}
                  <div
                    className="modal fade"
                    id="staticBackdrop"
                    data-bs-backdrop="static"
                    data-bs-keyboard="false"
                    tabIndex="-1"
                    aria-labelledby="staticBackdropLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title" id="staticBackdropLabel">
                            Cambio foto profilo
                          </h5>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>
                        <div class="modal-body bodyModal">
                          <img
                            src={fileImageURL}
                            className="photoModal"
                            alt="nessuna immagine scelta"
                          ></img>
                        </div>
                        <div class="modal-footer">
                          <button
                            type="button"
                            className="btnCancel"
                            onClick={() => setFileImageURL("")}
                          >
                            Reset
                          </button>
                          {!fileImageURL ? (
                            <button
                              type="button"
                              className="btnReview"
                              onClick={() => inputImageRef.current.click()}
                            >
                              Scegli foto...
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btnReview "
                              data-bs-dismiss="modal"
                              onClick={() => confirmModifyProfileImage()}
                            >
                              Conferma
                            </button>
                          )}
                          <input
                            type="file"
                            className="d-none"
                            ref={inputImageRef}
                            onChangeCapture={onFileImageChangeCapture}
                          ></input>
                        </div>
                      </div>
                    </div>
                  </div>

                  {currentAccount == id.userid ? (
                    <>
                      <p
                        data-bs-toggle="modal"
                        data-bs-target="#modalUsername"
                        className="activeMouseHover"
                      >
                        Username: {username} ✏{" "}
                      </p>
                      <div
                        className="modal fade"
                        id="modalUsername"
                        data-bs-backdrop="static"
                        data-bs-keyboard="false"
                        tabIndex="-1"
                        aria-labelledby="staticBackdropLabel"
                        aria-hidden="true"
                      >
                        <div className="modal-dialog">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5
                                className="modal-title"
                                id="staticBackdropLabel"
                              >
                                Cambio username
                              </h5>
                              <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                              ></button>
                            </div>
                            <div class="modal-body bodyModal">
                              <input
                                type="text"
                                value={newUsername}
                                onChange={(event) =>
                                  setNewUsername(event.currentTarget.value)
                                }
                              ></input>
                            </div>
                            <div class="modal-footer">
                              <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                              >
                                Annulla
                              </button>
                              <button
                                type="button"
                                className="btnReview"
                                data-bs-dismiss="modal"
                                onClick={() => confirmModifyUsername()}
                              >
                                Conferma
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p
                        data-bs-toggle="modal"
                        data-bs-target="#modalEmail"
                        className="activeMouseHover"
                      >
                        Email: {email} ✏{" "}
                      </p>
                      <div
                        className="modal fade"
                        id="modalEmail"
                        data-bs-backdrop="static"
                        data-bs-keyboard="false"
                        tabIndex="-1"
                        aria-labelledby="staticBackdropLabel"
                        aria-hidden="true"
                      >
                        <div className="modal-dialog">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5
                                className="modal-title"
                                id="staticBackdropLabel"
                              >
                                Cambio email
                              </h5>
                              <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                              ></button>
                            </div>
                            <div class="modal-body bodyModal">
                              <input
                                type="text"
                                value={newEmail}
                                onChange={(event) =>
                                  setNewEmail(event.currentTarget.value)
                                }
                              ></input>
                            </div>
                            <div class="modal-footer">
                              <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                              >
                                Annulla
                              </button>
                              <button
                                type="button"
                                className="btnReview"
                                data-bs-dismiss="modal"
                                onClick={() => confirmModifyEmail()}
                              >
                                Conferma
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {" "}
                      <h4 className="name">{username}</h4>{" "}
                      <p className="info">{email}</p>
                    </>
                  )}

                  <div className="stats row">
                    <div className="stats">
                      <p className="desc"> Number of reviewer: {numReviews}</p>
                      {!averageVote ? (
                        <p className="desc">Average rating: 0⭐</p>
                      ) : (
                        <p className="desc">Average rating: {averageVote}⭐</p>
                      )}
                    </div>
                  </div>
                  {currentAccount == id.userid ? (
                    <>
                      <p
                        data-bs-toggle="modal"
                        data-bs-target="#modalDescription"
                        className="desc activeMouseHover"
                      >
                        {" "}
                        {description} ✏{" "}
                      </p>
                      <div
                        className="modal fade"
                        id="modalDescription"
                        data-bs-backdrop="static"
                        data-bs-keyboard="false"
                        tabIndex="-1"
                        aria-labelledby="staticBackdropLabel"
                        aria-hidden="true"
                      >
                        <div className="modal-dialog">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5
                                className="modal-title"
                                id="staticBackdropLabel"
                              >
                                Cambio descrizione
                              </h5>
                              <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                              ></button>
                            </div>
                            <div class="modal-body bodyModal">
                              <textarea
                                className="form-control"
                                value={newDescription}
                                onChange={(event) =>
                                  setNewDescription(event.currentTarget.value)
                                }
                              />
                            </div>
                            <div class="modal-footer">
                              <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal"
                              >
                                Annulla
                              </button>
                              <button
                                type="button"
                                className="btnReview"
                                data-bs-dismiss="modal"
                                onClick={() => confirmModifyDescription()}
                              >
                                Conferma
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="desc">{description}</p>
                  )}
                </div>
                <div className="right col-lg-12">
                  <ul className="nav">
                    <Tabs
                      value={value}
                      onChange={handleChangeTabs}
                      textColor="primary"
                      indicatorColor="primary"
                      aria-label="primary tabs example"
                      centered={windowSize.innerWidth < 500 ? false : true}
                      className="tabs"
                    >
                      <Tab label="Corsi creati📖" {...a11yProps(0)} />
                      <Tab label="Recensioni🗣" {...a11yProps(1)} />
                      <Tab label="Calendarario📅" {...a11yProps(2)} />
                    </Tabs>
                  </ul>
                  <TabPanel value={value} index={0}>
                    <div className="row gallery">
                      {userCourses.map((corso) => {
                        return <CardMini item={corso.content} />;
                      })}
                    </div>
                  </TabPanel>

                  <TabPanel value={value} index={1}>
                    {currentAccount == id.userid ? (
                      <></>
                    ) : presentReview == true ? (
                      <>
                        <button
                          data-bs-toggle="modal"
                          className="btnReview"
                          data-bs-target="#modalRecensione"
                        >
                          Modifica recensione
                        </button>
                        <button
                          data-bs-toggle="modal"
                          data-bs-target="#modalEliminaRecensione"
                          className="btnEliminaRecensione"
                        >
                          Elimina recensione
                        </button>
                      </>
                    ) : (
                      <button
                        className="btnReview"
                        data-bs-toggle="modal"
                        data-bs-target="#modalRecensione"
                      >
                        Lascia una recensione...
                      </button>
                    )}
                    <div
                      className="modal fade"
                      id="modalRecensione"
                      data-bs-backdrop="static"
                      data-bs-keyboard="false"
                      tabIndex="-1"
                      aria-labelledby="staticBackdropLabel"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5
                              className="modal-title"
                              id="staticBackdropLabel"
                            >
                              Recensione
                            </h5>
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            ></button>
                          </div>
                          <div class="modal-body">
                            <input
                              type="text"
                              size={30}
                              placeholder="Titolo recensione..."
                              maxLength={30}
                              value={title}
                              onChange={(event) =>
                                setTitle(event.currentTarget.value)
                              }
                            />
                            <textarea
                              className="review "
                              type="text"
                              placeholder="Uno splendido insegnante, durante il corso..."
                              value={text}
                              onChange={(event) =>
                                setText(event.currentTarget.value)
                              }
                            />
                            <Rating
                              name="simple-controlled"
                              value={vote}
                              onChange={(event, newValue) => {
                                setVote(newValue);
                              }}
                            />
                          </div>
                          <div class="modal-footer">
                            <button
                              type="button"
                              className="btnCancel"
                              data-bs-dismiss="modal"
                            >
                              Annulla
                            </button>
                            {presentReview == true ? (
                              <button
                                type="button"
                                className="btnReview"
                                data-bs-dismiss="modal"
                                onClick={() => modifyReview()}
                              >
                                Modifica recensione
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="btnReview"
                                data-bs-dismiss="modal"
                                onClick={() => saveData()}
                              >
                                Invia recensione
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className="modal fade"
                      id="modalEliminaRecensione"
                      data-bs-backdrop="static"
                      data-bs-keyboard="false"
                      tabIndex="-1"
                      aria-labelledby="staticBackdropLabel"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5
                              className="modal-title"
                              id="staticBackdropLabel"
                            >
                              Recensione
                            </h5>
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            ></button>
                          </div>
                          <div class="modal-body">
                            <p>
                              Confermi di voler eliminare la tua recensione?
                            </p>
                          </div>
                          <div class="modal-footer">
                            <button
                              type="button"
                              className="btnCancel"
                              data-bs-dismiss="modal"
                            >
                              Annulla
                            </button>
                            <button
                              type="button"
                              className="btnDeliteReview"
                              data-bs-dismiss="modal"
                              onClick={() => deleteReview()}
                            >
                              Elimina recensione
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {reviews.map((review) => {
                      if (review)
                        return (
                          <Review
                            key={review.content.id}
                            item={review.content}
                          />
                        );
                    })}
                  </TabPanel>
                  <TabPanel value={value} index={2}>
                    <button
                      ref={clickBooking}
                      data-bs-toggle="modal"
                      data-bs-target="#prenotazione"
                      className="invisibile"
                    ></button>
                    <div
                      className="modal fade"
                      id="prenotazione"
                      data-bs-backdrop="static"
                      data-bs-keyboard="false"
                      tabIndex="-1"
                      aria-labelledby="staticBackdropLabel"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5
                              className="modal-title"
                              id="staticBackdropLabel"
                            >
                              Prenota lezione
                            </h5>
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            ></button>
                          </div>
                          <div class="modal-body bodyModal">
                            <p>
                              Sei sicuro di voler prenotare questo slot{" "}
                              {`${event.start}`} to {`${event.end}`} ?
                            </p>
                          </div>
                          <div class="modal-footer">
                            <button
                              type="button"
                              className="btnCancel"
                              data-bs-dismiss="modal"
                            >
                              Annulla
                            </button>
                            <button
                              type="button"
                              data-bs-dismiss="modal"
                              className="btnReview"
                              onClick={() => confirmBooking()}
                            >
                              Conferma
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      ref={clickRemove}
                      data-bs-toggle="modal"
                      data-bs-target="#removeBooking"
                      className="invisibile"
                    ></button>
                    <div
                      className="modal fade"
                      id="removeBooking"
                      data-bs-backdrop="static"
                      data-bs-keyboard="false"
                      tabIndex="-1"
                      aria-labelledby="staticBackdropLabel"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5
                              className="modal-title"
                              id="staticBackdropLabel"
                            >
                              Rimozione prenotazione
                            </h5>
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            ></button>
                          </div>
                          <div class="modal-body bodyModal">
                            <p>
                              Sei sicuro di voler rimuove la prenotazione allo
                              slot {`${event.start}`} to {`${event.end}`} ?
                            </p>
                          </div>
                          <div class="modal-footer">
                            <button
                              type="button"
                              className="btnCancel"
                              data-bs-dismiss="modal"
                            >
                              Annulla
                            </button>
                            <button
                              type="button"
                              data-bs-dismiss="modal"
                              className="btnReview"
                              onClick={() => removeBooking()}
                            >
                              Conferma
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      ref={clickRemoveDisponibility}
                      data-bs-toggle="modal"
                      data-bs-target="#removeDisponibility"
                      className="invisibile"
                    ></button>
                    <div
                      className="modal fade"
                      id="removeDisponibility"
                      data-bs-backdrop="static"
                      data-bs-keyboard="false"
                      tabIndex="-1"
                      aria-labelledby="staticBackdropLabel"
                      aria-hidden="true"
                    >
                      <div className="modal-dialog">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5
                              className="modal-title"
                              id="staticBackdropLabel"
                            >
                              Rimozione prenotazione
                            </h5>
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            ></button>
                          </div>
                          <div class="modal-body bodyModal">
                            <p>
                              Sei sicuro di voler rimuove la disponibilità allo
                              slot {`${event.start}`} to {`${event.end}`} ?
                            </p>
                          </div>
                          <div class="modal-footer">
                            <button
                              type="button"
                              className="btnCancel"
                              data-bs-dismiss="modal"
                            >
                              Annulla
                            </button>
                            <button
                              type="button"
                              data-bs-dismiss="modal"
                              className="btnReview"
                              onClick={() => removeDisponibility()}
                            >
                              Conferma
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    {currentAccount == id.userid ? (
                      <Accordion defaultActiveKey="0">
                        <Card>
                          <Card.Header>
                            <CustomToggle eventKey="0">
                              Inserisci nuove disponibilità
                            </CustomToggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey="0">
                            <Card.Body>
                              <div className="containerDate">
                                <DatePicker
                                  wrapperClassName="datePickerCustom"
                                  selected={startDate}
                                  onChange={(date) => setStartDate(date)}
                                  showTimeSelect
                                  timeFormat="HH:mm"
                                  minDate={minDate}
                                  maxDate={maxDate}
                                  renderCustomHeader={() => <div></div>}
                                  renderDayContents={renderDayContents}
                                  timeIntervals={15}
                                  filterTime={filterPassedTime}
                                  excludeDates={newDate}
                                  timeCaption="time"
                                  dateFormat="dd, yyyy h:mm aa"
                                />
                                <p>to</p>
                                <DatePicker
                                  selected={endDate}
                                  wrapperClassName="datePickerCustom"
                                  onChange={(date) => setEndDate(date)}
                                  showTimeSelect
                                  timeFormat="HH:mm"
                                  minDate={startDate}
                                  maxDate={maxDate}
                                  renderCustomHeader={() => <div></div>}
                                  renderDayContents={renderDayContents}
                                  filterTime={filterPassedTimeFromStart}
                                  timeIntervals={15}
                                  timeCaption="time"
                                  dateFormat="dd, yyyy h:mm aa"
                                />
                                <button onClick={() => insertDate()}>
                                  <p>+</p>
                                </button>
                              </div>
                            </Card.Body>
                          </Accordion.Collapse>
                        </Card>
                        <Card>
                          {Object.keys(newDate).length !== 0 ? (
                            <Card.Body>
                              <table>
                                {newDate.map((data) => {
                                  if (!data || !data.start) return;
                                  return (
                                    <>
                                      <tr>
                                        <td>
                                          <p>From: {`${data.start}`}</p>
                                        </td>
                                        <td rowSpan={2}>
                                          <button
                                            onClick={() => removeDate(data.id)}
                                          >
                                            <p>X</p>
                                          </button>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td>
                                          <p>To: {`${data.start}`}</p>
                                        </td>
                                      </tr>
                                    </>
                                  );
                                })}
                              </table>
                              <button
                                className="btnInsertDate"
                                onClick={() => insertDates()}
                              >
                                Inserisci date
                              </button>
                            </Card.Body>
                          ) : (
                            <></>
                          )}
                        </Card>
                      </Accordion>
                    ) : (
                      <></>
                    )}

                    <Calendar
                      localizer={localizer}
                      events={allEvents}
                      onSelectEvent={handleSelectEvent}
                      startAccessor="start"
                      endAccessor="end"
                      style={{ height: 500, margin: "50px" }}
                    />
                  </TabPanel>
                </div>
              </div>
            </main>
          </div>
        </>
      ) : (
        <>
          <p>Devi loggarti per visualizzare questa pagina!</p>
        </>
      )}
    </>
  );
};

export default Profile;
