import React from 'react'
import axios from 'axios'
import swal from 'sweetalert'

class Time extends React.Component
{
    constructor(props)
    {
        super(props)
        let startTime = Date.parse(this.props.label.startTime)/1000
        let endTime = Date.parse(this.props.label.endTime)/1000
        let newDate = new Date().toGMTString()
        let presentTime = Date.parse(newDate)/1000
        
        if(presentTime < startTime){
            this.state ={
                time : endTime-startTime,
                sec: 0,
                min:0,
                hr : 0,
                start : false,
                check : true
            }
        }
        else{
            this.state = {
                time : endTime-presentTime,
                sec: 0,
                min:0,
                hr : 0,
                start : false,
                check : true
            }
        }
        
    }

    handleChange=(e)=>{
        this.setState({
            time : e.target.value
        })
    }

    set=()=>{
        this.setState({
            check : false
        })
        let startTime = Date.parse(this.props.label.startTime)/1000
        let endTime = Date.parse(this.props.label.endTime)/1000
        let newDate = new Date().toGMTString()
        let presentTime = Date.parse(newDate)/1000
        
        let s = parseInt(this.state.time)
        let sec = s%60
        let min = Math.floor(s/60)
        let hr = Math.floor(min/60)
        min = min % 60
        if(hr == 0 && min != 0 && sec == 0){
            this.setState({
                hr : 0,
                sec :60,
                min : min-1,
                time : "",
                start: true
            })
        }
        else if(min != 0 && sec == 0){
            this.setState({
                sec :60,
                min : min-1,
                time : "",
                start: true
            })
        }
        else{
            this.setState({
                sec :sec,
                min : min,
                hr : hr,
                time : "",
                start: true
            })
        }
        if(presentTime < startTime){
            this.setState({
                start : false
            })
        }
        else{
            this.setState({
                start : true
            })
        }
    }
    minusSec =()=>{
        let sec = this.state.sec
        let min = this.state.min
        let hr = this.state.hr
        sec--
        if(min == 0 && sec ==0 && hr == 0)
        {
            clearInterval(this.y)
            this.setState({
                min:0,
                sec:0,
                hr : 0,
                start : false
            })
            let local = localStorage.getItem("token")
            if(JSON.parse(local) != null){
                const token = {
                    headers : {Authorization : "Bearer "+JSON.parse(local)}
                }
                axios.post('http://127.0.0.1:5000/taskover',{
                    "tid" : this.props.label.tid
                },token).then
                (res =>{
                    if (res.data.message === "Task Completed"){
                        swal(res.data.message,"Done","success")
                    }
                }).catch(error => console.log(error))
            }
        }
        else if(sec == 0){
            if(min == 0){
                sec = 60
            }
            else{
                min--
                sec = 60
            }
        }
        else if(min == 0){
            if(hr == 0){
                sec = 60
                min = 60
                hr = 0
            }
            else{
                hr--
                min = 60
                sec = 60
            }
        }
        this.setState({
            sec : sec,
            min : min,
            hr : hr,
            start : false
        })
    }

    startTimer=()=>{
            this.y = setInterval(()=>{
                this.minusSec()
            },1000)
            this.setState({
                start : true
            })
    }
    render()
    {
        return(
            <div className="mx-4  bgLogin border-warning my-2 bg-dark text-white">
                <div className=" text-center pt-4">
                    Remaining time for task {this.props.label.task}
                </div>
                <div className="d-flex justify-content-center">
                    <button 
                        className="mx-3   text-center rounded bg-warning py-2 px-3 "
                        disabled={!this.state.check}
                        onClick={this.set}>
                        Check
                    </button>
                </div>
                <div className="text-center">
                    <h1 className="display-3">
                        {this.state.hr}
                        <span className="h6">hr</span>
                        {this.state.min}
                        <span className="h6">min</span>
                        <span>{this.state.sec}</span>
                        <span className="h6">s  </span>
                        <span className="h3">{this.state.milisec}</span>
                    </h1>
                </div>
                <div className="text-center my-4">
                    <button  onClick={this.startTimer} disabled={!this.state.start} className="mx-3 rounded bg-warning py-1 px-3">Start</button>
                </div>
            </div>
        )
    }
}

export default Time