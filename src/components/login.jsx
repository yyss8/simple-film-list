import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Layout, Row, Icon, Form, Input, message } from 'antd';

import { userLogin } from '../actions/user';

const { Item } = Form;
class LoginView extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            isLoading:false
        };
    }

    onLogin(e){
        e.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (err) {
                message.error('Please check your inputs', 1.5);
                return;
            }

            this.setState({ isLoading:true });

            setTimeout(() => {
                this.setState({ isLoading:false }, () =>{

                    const user = {
                        email:values.email,
                        accessToken:values.password
                    };

                    localStorage.setItem('user', JSON.stringify(user));

                    this.props.dispatch( userLogin( user ) )

                    this.props.history.push('/list');
                });
            }, 1500);
        });

    }

    render(){

        const { getFieldDecorator, setFieldsValue } = this.props.form;

        return(
            <Layout className="login-wrapper">
                <Layout.Content>
                     <div className="login-inner">
                        <Row type="flex" justify="center" align="middle" className="inner-header">
                             <h2>Simple Film List App</h2>
                        </Row>
                        <div className="login-form">
                            <h3 style={ {marginBottom:30} }>Enter your E-mail and password below</h3>
                            <Form onSubmit={ this.onLogin.bind(this) }>
                                <Item label="E-mail">
                                    {getFieldDecorator('email', {
                                        rules: [
                                            { required: true, message: 'Please enter your e-mail' },
                                            { pattern:/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, message:'Invalid E-mail address' }
                                        ],
                                        validateTrigger:'onBlur'
                                    })(
                                        <Input prefix={ <Icon type="user" /> } onChange={ e => setFieldsValue( {email:e.target.value} ) }  placeholder="Your E-mail" type="email" />
                                    )}
                                </Item>
                                <Item label="password">
                                    {getFieldDecorator('password', {
                                        rules: [
                                            { required: true, message: 'Please enter your password' }
                                        ],
                                    })(
                                        <Input prefix={ <Icon type="lock" /> } onChange={ e => setFieldsValue( {password:e.target.value} ) }  placeholder="Your password" type="password" />
                                    )}
                                </Item>
                                 <p><Button disabled={ this.state.isLoading } type="primary" htmlType="submit" style={ {width:'100%'} }>{ this.state.isLoading ? <Icon type='loading' />:'Login' }</Button></p>
                            </Form>
                           
                        </div>
                     </div>
                </Layout.Content>
            </Layout>
        );
    }
}

export default connect( state => ({user:state.user}) )( withRouter( Form.create()( LoginView ) ) );