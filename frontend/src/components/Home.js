import React from 'react'
import axios from 'axios'
import Timer from '../components/Time'

class Home extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            tasks : [],
            allTasks : []
        }
    }

    fetchUncompletedTask = () =>{
        let local = localStorage.getItem("token")
        if(JSON.parse(local) != null){
            const token = {
                headers : {Authorization : "Bearer "+JSON.parse(local)}
            }
            axios.post('http://127.0.0.1:5000/getuncompletedtask',{},token).then
            (res =>{
                this.setState({
                    tasks : res.data.tasks
                })
            }).catch(error => console.log(error))
        }
    }

    componentDidMount = ()=>{
        this.fetchUncompletedTask()
    }

    handleClick =() =>{
        let local = localStorage.getItem("token")
        if(JSON.parse(local) != null){
            const token = {
                headers : {Authorization : "Bearer "+JSON.parse(local)}
            }
            axios.post('http://127.0.0.1:5000/taskall',{},token).then
            (res =>{
                this.setState({
                    allTasks : res.data.tasks
                })
            }).catch(error => console.log(error))
        }
    }

    render(){
        return (
            <div className = "container-fluid">
                <button className="btn btn-primary mt-3 ml-3 mb-3" onClick={this.handleClick}>Get All Tasks</button>
                <table className="table">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">Id</th>
                            <th scope="col">Task Name</th>
                            <th scope="col">Project Name</th>
                            <th scope="col">Start Date</th>
                            <th scope="col">End Date</th>
                            <th scope="col">Completed</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.allTasks.map(ele =>{
                            return(<tr>
                                <td>{ele.tid}</td>
                                <td>{ele.task}</td>
                                <td>{ele.project}</td>
                                <td>{ele.startTime}</td>
                                <td>{ele.endTime}</td>
                                {ele.iscompleted ? (<td>Yes</td>): (
                                    <td>No</td>
                                )}
                            </tr>)
                        })}
                    </tbody>
                </table>
                <br />
                <h1 className="text-center">Uncompleted Tasks</h1>
                <div className = "row m-3 justify-content-center">
                    {this.state.tasks.map(ele => 
                        <Timer label = {ele}/>
                    )}
                </div>
            </div>
        )
    }
    
}

export default Home
