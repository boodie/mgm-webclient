import * as React from "react";
import { Action } from 'redux'
import { ReduxStore, Synchronizer, StateModel } from '../lib/Redux';
import { Map } from 'immutable';
import shallowequal = require('shallowequal');

import { ClientStack } from '../lib/ClientStack';
import { User } from '../lib/Immutable';

import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Button } from 'react-bootstrap';

import { Account } from "./Account";
import { RegionList } from "./Regions";
import { EstateList } from './Estates';
import { GroupList } from './Groups';
import { HostList } from './Hosts';
import { UserList } from "./Users";
import { PendingUserList } from "./PendingUsers";

interface authenticatedProps {
    store: ReduxStore,
    state: StateModel
}

interface state {
    url?: string
}

export class Authenticated extends React.Component<authenticatedProps, state> {
    state: state
    timerToken: any;

    constructor(props: authenticatedProps) {
        super(props);
        this.state = {
            url: props.state.url
        }

        this.timerToken = setInterval(Synchronizer.bind(null, this.props.store), 10000);
        Synchronizer(this.props.store);
    }

    shouldComponentUpdate(nextProps: authenticatedProps, nextState: state) {
        return !shallowequal(this.props, nextProps) || !shallowequal(this.state, nextState);
    }

    componentWillReceiveProps(newProps: authenticatedProps) {
        if (this.state.url !== newProps.state.url) {
            this.setState({
                url: newProps.state.url
            })
        }
    }

    componentWillUnmount() {
        clearInterval(this.timerToken);
    }

    handleLogout() {
        this.props.store.Auth.Logout();
        clearInterval(this.timerToken);
    }

    handleNav(href: string) {
        this.props.store.NavigateTo(href);
    }

    render() {
        let navbar = (
            <Navbar>
                <Navbar.Header>
                    <Navbar.Toggle />
                    <Navbar.Brand>MGM</Navbar.Brand>
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
                        <NavItem
                            active={this.state.url === "/account" || this.state.url === "/"}
                            onClick={this.handleNav.bind(this, "/account")}>
                            Account
                        </NavItem>
                        <NavItem
                            active={this.state.url === "/regions"}
                            onClick={this.handleNav.bind(this, "/regions")}>
                            Regions
                        </NavItem>
                        <NavDropdown id="grid-dropdown" title="Grid">
                            <MenuItem active={this.state.url === "/estates"}
                                onClick={this.handleNav.bind(this, "/estates")}>
                                Estates
                            </MenuItem>
                            <MenuItem active={this.state.url === "/groups"}
                                onClick={this.handleNav.bind(this, "/groups")}>
                                Groups
                            </MenuItem>
                            <MenuItem active={this.state.url === "/hosts"}
                                onClick={this.handleNav.bind(this, "/hosts")}>
                                Hosts
                            </MenuItem>
                        </NavDropdown>
                        <NavItem
                            active={this.state.url === "/users"}
                            onClick={this.handleNav.bind(this, "/users")}>
                            Users
                        </NavItem >
                        <NavItem
                            active={this.state.url === "/pending"}
                            onClick={this.handleNav.bind(this, "/pending")}>
                            Pending Users
                        </NavItem >
                    </Nav >
                    <Nav pullRight>
                        <NavItem><Button bsSize="xsmall" onClick={this.handleLogout.bind(this)}>Log Out</Button></NavItem>
                    </Nav>
                </Navbar.Collapse >
            </Navbar >
        )
        switch (this.state.url) {
            case '/regions':
                return (
                    <div>
                        {navbar}
                        <RegionList
                            isAdmin={this.props.state.auth.isAdmin}
                            store={this.props.store}
                            regions={this.props.state.regions}
                            estateMap={this.props.state.estateMap}
                            estates={this.props.state.estates}
                            hosts={this.props.state.hosts} />
                    </div>
                )
            case '/estates':
                return (
                    <div>
                        {navbar}
                        <EstateList
                            isAdmin={this.props.state.auth.isAdmin}
                            store={this.props.store}
                            estates={this.props.state.estates}
                            estateMap={this.props.state.estateMap}
                            managers={this.props.state.managers}
                            users={this.props.state.users} />
                    </div>
                )
            case '/groups':
                return (
                    <div>
                        {navbar}
                        <GroupList
                            groups={this.props.state.groups}
                            roles={this.props.state.roles}
                            members={this.props.state.members}
                            users={this.props.state.users} />
                    </div>
                )
            case '/hosts':
                return (
                    <div>
                        {navbar}
                        <HostList
                            store={this.props.store}
                            hosts={this.props.state.hosts}
                            regions={this.props.state.regions} />
                    </div>
                )
            case '/users':
                return (
                    <div>
                        {navbar}
                        <UserList
                            isAdmin={this.props.state.auth.isAdmin}
                            store={this.props.store}
                            users={this.props.state.users}
                            groups={this.props.state.groups}
                            members={this.props.state.members}
                            roles={this.props.state.roles} />
                    </div>
                )
            case '/pending':
                return (
                    <div>
                        {navbar}
                        <PendingUserList
                            store={this.props.store}
                            users={this.props.state.pendingUsers} />
                    </div>
                )
            case '/account':
                return (
                    <div>
                        {navbar}
                        <Account
                            store={this.props.store}
                            user={this.props.state.auth.user}
                            users={this.props.state.users}
                            jobs={this.props.state.jobs}
                            regions={this.props.state.regions} />
                    </div>
                )
            default:
                return <h3>Whoops: please navigate using the navbar above</h3>
        }
    }
}
