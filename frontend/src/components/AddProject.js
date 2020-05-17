import React from 'react'
import axios from 'axios'
import swal from 'sweetalert'
import { connect } from 'react-redux'

class AddProject extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            project_name : "",
            details : ""
        }
    }

    handleChange=(event)=>{
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleClick = (e)=>{
        e.preventDefault()
        let project = this.state.project_name
        let details = this.state.details
        let local = localStorage.getItem("token")
        if(JSON.parse(local) != null){
            const token = {
                headers : {Authorization : "Bearer "+JSON.parse(local)}
            }
            axios.post('http://127.0.0.1:5000/addproject',{
                "project_name" : project,
                "project_details": details,
            },token).then
            (res =>{
                if(res.data.message === "Project Name Already exist"){
                    swal(res.data.message,"Try different name","error")
                }
                else if (res.data.message === "New Project Added"){
                    swal(res.data.message,"Done","success")
                }
            }).catch(error => console.log(error))
        }

        this.setState({
            project_name : "",
            details : ""
        })
    }

    render() {
        return (
            <div >
                {this.props.isloggedIn ? (
                    <div className="row">
                        <div className="col">
                            <div className="bgLogin mt-5">
                                    <h3 className="text-center mt-1">ADD PROJECT</h3>
                                    <div className="mx-3">
                                        <label className="ml-1 mt-2">Project Name</label>
                                        <input className="form-control" onChange={this.handleChange} type="text" value={this.state.project_name} name="project_name" placeholder="Enter Project Name" />
                                    </div>
                                    <div className="mx-3">
                                        <label className="ml-1 mt-2">Project Details</label>
                                        <textarea className="form-control" onChange={this.handleChange} type="text" value={this.state.details} name="details" placeholder="Enter Project details" />
                                    </div>
                                    <button className="btn btn-primary mt-3 ml-3 mb-3" onClick={this.handleClick}>ADD</button>
                            </div>
                        </div>
                        <div className="col">
                            
                        </div>
                    </div>
               ):(
                   <div>  
                       <h1 className="text-center">Login First</h1>
                    </div>
               )}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    isloggedIn : state.isloggedIn
})


export default connect(mapStateToProps, null)(AddProject)
