import React from 'react';
import updater from 'immutability-helper';
import {  
    Tabs, 
    Layout, 
    Progress, 
    Card,
    message, 
    Modal
} from 'antd';
import { connect } from 'react-redux';


import 'antd/dist/antd.css';
import '../styles/main.scss'; 

import Todo from './todo.jsx';

import { getJson } from 'u/request';

class App extends React.Component{

    constructor(props){
        super(props);
        
        this.state = {
            contentTab:'todo',
            toDos:[],
            isLoading:true,
            todoText:''
        };
    }

    componentDidMount(){
        const cover = document.getElementById('pre-loading-cover');

        if ( cover ){
            cover.style.display = 'none';
        }

        this.fetchData();
    }

    stateOnchange( value, field ){
        this.setState({ [field]:value });
    }

    fetchData(){

        const url = 'https://jsonplaceholder.typicode.com/todos/1';
        getJson( {}, url )
        .then( data => {
            
            if ( typeof data === 'undefined' ){
                this.setState({ isLoading:false }, () => {
                    message.error('Empty Data');
                });
                return;
            }

            const toDos = updater( this.state.toDos , {
                $push:[ data ]
            });

            this.setState({ toDos, isLoading:false });
        }) 
        .catch( rejected => {
            this.setState({ isLoading:false }, () => {
                message.error('Error happened while fetching data');
            });
        });

    }

    onAdd(){

        const lastId = (!!this.state.toDos[ this.state.toDos.length - 1 ] ? this.state.toDos[ this.state.toDos.length - 1 ].id:0) + 1;
        const toDos = updater( this.state.toDos, {
            $push:[
                {
                    title:this.state.todoText,
                    userId:lastId,
                    id:lastId,
                    completed:false
                }
            ]
        });

        this.setState({ toDos, todoText:'' }, () => {
            message.destroy();
            message.success('New todo added!', 2);
        });

    }

    onCompleteTodo( id ){

        const index = this.state.toDos.findIndex( todo => todo.id === id );
        const toDos = updater( this.state.toDos , {
            [index]:{
                completed:{ $set:true }
            }
        });

        this.setState({ toDos }, () =>{
            message.destroy();
            message.success('Todo completed!');
        });
    }

    onRemoveTodos( id ){
        Modal.confirm({
            title:'Confirm to remove selected todo',
            onOk:() => {

                const index = this.state.toDos.findIndex( todo => todo.id === id );
                const toDos = updater( this.state.toDos , {
                    $splice:[ [index, 1] ]
                });

                this.setState({ toDos }, () =>{
                    message.success('Todo removed!', 2);
                });
            }
        });
    }

    onRemoveCompleted( id ){

        Modal.confirm({
            title:'Confirm to remove selected todo',
            onOk:() => {
                
                const index = this.state.toDos.findIndex( todo => todo.id === id );

                if ( index === -1 ){
                    message.error('Error happened, try to refresh the page');
                    return;
                }

                const toDos = updater( this.state.toDos , {
                    $splice:[ [index, 1] ]
                });

                this.setState({ toDos }, () =>{
                    message.destroy();
                    message.success('Todo removed!', 2);
                });
            }
        });

    }

    render(){

        const { global } = this.props;
        
        return(
            <Layout className='app-wrapper'>
                { global.pageLoadingPerc > 0 && <Progress className='global-loader-progress' showInfo={false} status="active" strokeLinecap="square" percent={global.pageLoadingPerc} />}
                { !global.isPageLoaded && global.pageLoadingPerc < 100 && <div className='red-loading-view fixed'></div> }
                <Tabs defaultActiveKey="todo">
                    <Tabs.TabPane key="todo" tab="Todo List">
                        <Todo stateOnchange={ this.stateOnchange.bind(this) } 
                            todoText={ this.state.todoText }
                            onAdd={ this.onAdd.bind(this) } 
                            toDos={ this.state.toDos }
                            isLoading={ this.state.isLoading }
                            onCompleteTodo={ this.onCompleteTodo.bind(this) }  
                            onRemoveCompleted={ this.onRemoveCompleted.bind(this) }
                            onRemoveTodos={ this.onRemoveTodos.bind(this) } />
                    </Tabs.TabPane>
                    <Tabs.TabPane key="2" tab="Question 2" >
                        <code dangerouslySetInnerHTML={ {__html: `
                            <pre>
Using var will declare the variable 'btnNum' as a global variable
simply change "var" to "let" will fix the problem by declaring 'btnNum' as a local variable

var arr = ['button 1', 'button 2', 'button 3'];
for (let btnNum = 0; btnNum < arr.length; btnNum++) {
    document.getElementById('btn-' + btnNum).onclick = function() {
        alert(arr[btnNum]);
    };
}
                            </pre>
                        `} }>
                        </code>
                    </Tabs.TabPane>
                    <Tabs.TabPane key="3" tab="Question 3" >
                        <code dangerouslySetInnerHTML={ {__html: `
                            <pre>
var obj = { test: true,
        name1: 'jeff',
        name2: 'joe'
    };
var name = obj.test ? obj['name1']<span style="color:red;font-weight:bold;">:</span>obj.name2;
console.log(name);
                            </pre>`} }>
                           
                        </code>
                    </Tabs.TabPane>
                    <Tabs.TabPane key="4" tab="Question 4" >
                        <code dangerouslySetInnerHTML={ {__html:`
                            <pre>
1) 
for (var i in arr){
    console.log(arr[i]);
}

2) ES6
var arr = ['a', 'b', 'c', 'd'];
for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);
}
                            </pre>
                        `} }>

                        </code>
                    </Tabs.TabPane>
                    <Tabs.TabPane key="5" tab="Question 5" >
                        <code dangerouslySetInnerHTML={ {__html:`
                            <pre>
1) <b>it's faster to use addEventListener to bind events </b>

var arr = ['button 1', 'button 2', 'button 3'];
for (let btnNum = 0; btnNum < arr.length; btnNum++) {
    const element = document.getElementById('btn-' + btnNum);
    if ( element.attachEvent ){
        element.attachEvent('onclick', function(){
            alert(arr[btnNum]);
        })
    }else{
        element.addEventListener('click', function(){
            alert(arr[btnNum]);
        });
    }
}

2) <b>wrapping the elements in a container will be more efficient to bind events</b>

    &lt;div id=&quot;parent&quot;&gt;
        &lt;button id=&quot;btn-0&quot;&gt;Button 1!&lt;/button&gt;
        &lt;button id=&quot;btn-1&quot;&gt;Button 2!&lt;/button&gt;
        &lt;button id=&quot;btn-2&quot;&gt;Button 3!&lt;/button&gt;
    &lt;/div&gt;

    document.querySelector('#parent').addEventListener('click', function(e){
        if ( e.target === e.currentTarget ){
            e.stopPropagation();
            return;
        }

        const id = e.target.id.replace('btn-', '');
        alert(id);
    }, false);
                            </pre>
                        `} }>

                        </code>
                    </Tabs.TabPane>
                </Tabs>
            </Layout>
        );
    }
}


export default connect( state => ({global:state.global}))( App );