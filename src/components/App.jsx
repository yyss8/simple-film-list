import React from 'react';
import { Switch, Route, withRouter, Redirect } from 'react-router-dom';
import Progress from 'antd/lib/progress';
import Layout from 'antd/lib/layout';
import { connect } from 'react-redux';
import asyncComponent from './async-component';

import 'antd/dist/antd.css';
import '../styles/main.scss';

const Dashboard = asyncComponent( () => import( './dashboard.jsx' ).then( module => module.default ));
const LoginView = asyncComponent( () => import( './login.jsx' ).then( module => module.default ));

class App extends React.Component{


    componentDidMount(){
        const cover = document.getElementById('pre-loading-cover');

        if ( cover ){
            cover.style.display = 'none';
        }
    }

    componentDidUpdate( prevProps ){

        if ( this.props.global.isPageLoaded && !prevProps.global.isPageLoaded ){

            const { user } = this.props;
            const isLogged = user !== null;
            
            if ( isLogged ){

                if ( this.props.location.pathname.startsWith('/login') ){
                    this.props.history.push('/list');
                }

            }else if (!this.props.location.pathname.startsWith('/login')){
                this.props.history.push('/login');
            }

        }

    }

    render(){

        const { global } = this.props;
        

        return(
            <Layout className='app-wrapper'>
                { global.pageLoadingPerc > 0 && <Progress className='global-loader-progress' showInfo={false} status="active" strokeLinecap="square" percent={global.pageLoadingPerc} />}
                { !global.isPageLoaded && global.pageLoadingPerc < 100 && <div className='red-loading-view fixed'></div> }
                <Switch>
                    <Redirect path="/" exact to="/login" />
                    <Route path="/login" component={ LoginView } />
                    <Route path='/list' component={ Dashboard } />
                </Switch>
            </Layout>
        );
    }
}


export default connect( state => ({global:state.global, user:state.user}))( withRouter( App ) );