import React,{Component} from 'react';

class NotFound extends Component{
    
    render() {
        return (
            <div style={{marginTop: "5rem",display: 'flex',alignItems: "center",fontSize: "2rem", fontWeight: "500"}}>
                <div style={{ background: "#CBD2D9", padding: "4rem 5rem", margin: "2rem auto", borderRadius: "1rem", alignSelf: "center", justifySelf: "center" }}><div style={{display: "flex",justifyContent: "center"}}>404 Error</div> Page Not Found!!</div>
            </div>
        );
    }
}

export default NotFound;