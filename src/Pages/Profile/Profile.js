import React, { useState, useEffect } from "react";
import axios from "../../axios";
import { useSelector, useDispatch } from "react-redux";
import { setLoading } from "../../Store/Actions";
import BackDrop from "../../Components/hoc/BackDrop/BackDrop";
import "./Profile.css";

const Profile = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [totalPapers, setTotalPapers] = useState(0);
  const [totalResponses, setTotalResponses] = useState(0);

  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(true));
    const queryParams =
      "?auth=" +
      authState.token +
      '&orderBy="userId"&equalTo="' +
      authState.userId +
      '"';
    axios.get("/users.json" + queryParams).then((response) => {
      const userData = Object.values(response.data)[0];
      setUserName(userData.name);
      setEmail(userData.email);
      setTotalPapers(
        userData.createdPapers ? Object.keys(userData.createdPapers).length : 0
      );
      setTotalResponses(
        userData.submittedResponses
          ? Object.keys(userData.submittedResponses).length
          : 0
      );
      dispatch(setLoading(false));
    });
  }, []);

  const userData = (
    <div className="profileContent">
      <p>Name</p>
      <input
        type="text"
        placeholder="Enter Your Full Name"
        defaultValue={userName}
        className="input"
        readOnly
      ></input>
      <p>Email</p>
      <input type="text" defaultValue={email} readOnly></input>
      <p>Total Papers Created</p>
      <input type="text" value={totalPapers} readOnly></input>
      <p>Total Responses Submitted</p>
      <input type="text" value={totalResponses} readOnly></input>
    </div>
  );
  return (
    <BackDrop isLoading={authState.loading}>
      <div className="profile">
        <p className="heading">Your Profile</p>
        {userData}
      </div>
    </BackDrop>
  );
};

export default Profile;
