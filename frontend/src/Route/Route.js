import React,{useEffect} from 'react'
import {Switch, Route,Link} from 'react-router-dom'
import SignUp from '../components/SignUp'
import SignIn from '../components/SignIn'
import Home from '../components/Home'
import ADD from '../components/AddProject'
import Task from '../components/AddTask'
import {signout,login} from '../Redux/Action'
import { connect } from "react-redux"


function Routes(props){
    useEffect(() => {
        let username = localStorage.getItem('user')
        if(localStorage.getItem('user') != null){
            props.login({"isloggedIn":true,"user":username})
        }
      });

    const handleclick = ()=>{
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            localStorage.removeItem("isLoggedIn")
            localStorage.setItem("isLoggedIn",false)
            props.signout(false)
        }

        return (
            <div>
                <nav className="navbar navbar-expand-lg bg-dark" >
                    <h3 className="navbar-brand text-white" ><Link to="/">Development</Link></h3>
                    <div className=" navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav float-left">
                            <li className="nav-item active ml-3 ">
                                <Link to="/addproject" >Add Project</Link>
                            </li>
                            <li className="nav-item active ml-3 ">
                                <Link to="/addtask" >Add Task</Link>
                            </li>
                        </ul>
                        <div className="ml-auto text-white">Hello {props.user}!</div>
                        {props.isloggedIn ? (
                            <div className="ml-auto">
                                <button className = "btn btn-info m-2" onClick={handleclick}>Sign off</button>
                            </div> 
                            ):(
                                <div className="ml-auto">
                                    <Link to="/signin" className = "btn btn-info">Sign In</Link>
                                </div> 
                            )}
                    </div>
                </nav>
                <Switch>
                    <Route path="/" exact component = {Home} />
                    <Route path="/addproject" exact component = {ADD} />
                    <Route path="/addtask" exact component = {Task} />
                    <Route path="/signin" exact component = {SignIn} />
                    <Route path="/signup" exact component = {SignUp} />
                </Switch>
            </div>
        )
}

const mapStateToProps = state => ({
    user: state.user,
    isloggedIn : state.isloggedIn
});
  
const mapDispatchToProps = dispatch => ({
    signout: payload => dispatch(signout(payload)),
    login: payload => dispatch(login(payload))
});

export default connect(mapStateToProps,mapDispatchToProps) (Routes)
