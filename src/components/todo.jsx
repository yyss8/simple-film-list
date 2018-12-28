import React from 'react';
import { 
    Spin, 
    Input, 
    Button, 
    Row
} from 'antd';

export default class extends React.Component{

    render(){

        const { toDos } = this.props;
        const notCompleted = toDos.filter( todo => !todo.completed );
        const completed = toDos.filter( todo => todo.completed );

        return (
            <div className="todo-list-content">
                <Spin spinning={ this.props.isLoading }>
                    <h1>To-Do List</h1>
                    <Row className="todo-input" type="flex" justify="space-between">
                        <div><Input value={ this.props.todoText } onChange={ e => this.props.stateOnchange(e.target.value, 'todoText') } /></div>
                        <div><button disabled={ this.props.todoText === '' } onClick={ this.props.onAdd }  >Add</button></div>
                    </Row>
                    <ul className="todo-list">
                        { notCompleted.map( (todo, index) => {
                            return <li key={ `todo-${index}` } >
                                        <span>{todo.id}) {todo.title} </span>
                                        <div>
                                            <Button style={ {marginLeft:30} } icon="check" onClick={ () => this.props.onCompleteTodo( todo.id ) } />
                                            <Button style={ {marginLeft:15} } icon="close" onClick={ () => this.props.onRemoveTodos( todo.id ) } />
                                        </div>
                                    </li>
                        }) }
                    </ul>
                    <h4>Completed</h4>
                    <ul className="completed-list">
                        {
                            completed.map( (comp, index) => {
                                return <li key={ `completed-${index}` }>{comp.id}) {comp.title}<Button onClick={ ()=> this.props.onRemoveCompleted( comp.id ) } style={ {marginLeft:30} } icon="close" /></li>
                            })
                        }
                    </ul>
                </Spin>
            </div>
        );
    }
}