import React from 'react';
import updater from 'immutability-helper';
import { Card, Dropdown, message, Avatar, Menu, Modal, Icon, Button, Row, Spin } from 'antd';
import { connect } from 'react-redux';
import Waypoint from 'react-waypoint';

import { getJson } from '../utilities/request';
import { userLogout } from '../actions/user';

class DashboardView extends React.Component{

    constructor( props ){
        super(props);

        this.state = {
            isLoading:true,
            isLoaded:false,
            offset:0,
            step:1,
            total:0,
            films:[]
        };
    }

    componentWillMount(){

        const { user } = this.props;

        if ( user.idToken === null ){
            this.props.history.push('/login');
        }

    }

    componentDidMount(){

        const { user } = this.props; 

        this.fetchList();
    }

    fetchList(){
 
        const url = 'http://www.snagfilms.com/apis/films.json';

        getJson( {limit:20, offset:this.state.offset}, url)
        .then( res =>{

            const { films } = res;

            if ( typeof films === 'undefined' ){
                console.log(rejected);
                message.error('Error happened while fetching data', 1.5);
                this.setState({ isLoaded:true, isLoading:false });
                return;
            }

            this.setState({ 
                isLoading:false, 
                films:updater( this.state.films , {
                    $push:films.film
                }), 
                offset:films.nextOffset, 
                step:films.pageIndex, 
                total:films.pageTotal ,
                isLoaded:this.state.films.length >= films.pageTotal
            }); 

        })
        .catch( rejected =>{
            console.log(rejected);
            message.error('Error happened while fetching data', 1.5);
            this.setState({ isLoaded:true, isLoading:false });
        });
    }

    onLogout(){

        Modal.confirm({
            title:'Confilm to logout from the system?',
            onOk:() =>{

                this.props.dispatch( userLogout() );
                this.props.history.push('/login');
                localStorage.removeItem('user');
                
            }
        });

    }

    onLoadMore(){

        if ( this.state.isLoading || this.state.isLoaded ){
            return;
        }

        this.setState({ isLoading:true }, () =>{
            this.fetchList();
        });

    }

    render(){

        const { user } = this.props;
        const dropdownContent = (
            <Menu style={ {width:230} }>
                <Menu.Item style={ {cursor:'default',color:'rgba(0, 0, 0, 0.65)'} } disabled={true} >
                    <span>Welcome { !!user.email ? user.email:'' }</span>
                </Menu.Item>      
                <Menu.Divider />
                <Menu.Item>
                    <a onClick={ this.onLogout.bind(this) }><Icon type="logout" />&nbsp;&nbsp;Logout</a>
                </Menu.Item>     
            </Menu>
        );

        return(
            <div className="dahsboard-wrapper">
                <Card className="dashboard-inner" title='Simple film List' 
                      extra={ <Dropdown placement="bottomRight" overlay={ dropdownContent } >
                          <Avatar size="large" icon="user" />
                      </Dropdown> } >
                      <div className="film-list-wrapper">
                        {
                            this.state.films.length === 0 ? 
                            (
                                <Spin spinning={ this.state.isLoading }>
                                    <Row type="flex" justify="center" align="middle" style={ {minHeight:300} }>
                                        <span style={ {textAlign:'center', position:'relative', top:30} }>{ this.state.isLoading ? 'Loading more...':'There is 0 films found' }</span>
                                    </Row>
                                </Spin>
                            )
                            :<div className="flim-list-items">
                                {
                                    this.state.films.map( (film, index) =>{
                                        return (
                                            <Row className="film-item" key={ `film-${index}` } type="flex" justify="center" align="middle">
                                                <a href={ film.permaLink }>
                                                    <span className="item-inner">
                                                        { !!film.images.image[0] ? <img src={ film.images.image[0].src }  />:'' }
                                                    </span>
                                                    <span>{film.title}</span>
                                                </a>
                                            </Row>
                                        );
                                    })
                                }

                                {
                                    this.state.isLoading ? <div className="load-more-films"><Spin spinning={ this.state.isLoading } size="large" /></div>
                                                         : !this.state.isLoaded && (
                                                            (this.state.step  > 2 && this.state.step % 2 === 1 )
                                                            ? <div className="load-more-films"><Button onClick={ this.onLoadMore.bind(this) } type="primary" size="small" >Load more</Button></div>
                                                            : <div className="load-more-films"><Spin size="large" spinning={ true }><Waypoint onEnter={ this.onLoadMore.bind(this) } /></Spin></div>
                                                         )
                                }
                            </div>
                        }
                      </div>
                </Card>
            </div>
        );
    }
}

export default connect( state => ({ user:state.user }) )( DashboardView );