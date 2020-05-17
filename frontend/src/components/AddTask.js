import React from 'react'
import axios from 'axios'
import swal from 'sweetalert'
import { connect } from 'react-redux'

class AddTask extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            task : "",
            project : "",
            projects : [],
            startDate : "",
            endDate : ""
        }
    }

    handleChange=(event)=>{
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    fetchProject = () =>{
        let local = localStorage.getItem("token")
        if(JSON.parse(local) != null){
            const token = {
                headers : {Authorization : "Bearer "+JSON.parse(local)}
            }
            axios.post('http://127.0.0.1:5000/getproject',{},token).then
            (res =>{
                this.setState({
                    projects : res.data.projects
                })
            }).catch(error => console.log(error))
        }
    }

    componentDidMount = () =>{
        this.fetchProject()
    }

    handleClick = () => {
        let start = this.state.startDate
        let end = this.state.endDate
        let startArr = start.split("T")
        let startDate = startArr[0] + " " + startArr[1] + ":00"
        let endArr = end.split("T")
        let endDate = endArr[0] + " " + endArr[1] + ":00"
        let task_name = this.state.task
        let projectId = this.state.project
        let local = localStorage.getItem("token")
        if(JSON.parse(local) != null){
            const token = {
                headers : {Authorization : "Bearer "+JSON.parse(local)}
            }
            axios.post('http://127.0.0.1:5000/addtask',{
                "task" : task_name,
                "startTime" : startDate,
                "endTime" : endDate,
                "pid" : projectId
            },token).then
            (res =>{
                if(res.data.message === "Task Name Already exist"){
                    swal(res.data.message,"Try different name","error")
                }
                else if (res.data.message === "New Task Added"){
                    swal(res.data.message,"Done","success")
                }
            }).catch(error => console.log(error))
        }

        this.setState({
            task : "",
            project : "",
            startDate : "",
            endDate : ""
        })
    }

    render() {
        return (
            <div>
                {this.props.isloggedIn ? (
                   <div>
                       <div className="bgLogin mt-5">
                            <h3 className="text-center mt-1">ADD TASK</h3>
                            <div className="mx-3">
                                <label className="ml-1 mt-2">Task Name</label>
                                <input className="form-control" onChange={this.handleChange} type="text" value={this.state.task} name="task" placeholder="Enter Task Name" />
                            </div>
                            <div className="mx-3">
                                <label className="ml-1 mt-2">Projects</label>
                                <select className="custom-select" id="inputGroupSelect01" name="project" value={this.state.project} onChange={this.handleChange} >
                                    <option defaultValue>Choose..</option>
                                    {this.state.projects.map(ele => (
                                        <option key={ele.pid} value={ele.pid}>{ele.project}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mx-3">
                                <label className="ml-1 mt-2">Start Date and Time in GMT</label>
                                <input type = "datetime-local" className="form-control" onChange={this.handleChange}  name="startDate" placeholder="In GMT"></input>
                            </div>
                            <div className="mx-3">
                                <label className="ml-1 mt-2">End Date and Time in GMT</label>
                                <input type = "datetime-local" className="form-control" onChange={this.handleChange}  name="endDate" placeholder="In GMT"></input>
                            </div>
                            <button className="btn btn-primary mt-3 ml-3 mb-3" onClick={this.handleClick}>ADD</button>
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

export default connect(mapStateToProps, null)(AddTask)
