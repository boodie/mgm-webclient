import * as React from "react";
import { Action } from 'redux';
import { Map } from 'immutable';
import shallowequal = require('shallowequal');

import { Job, User, Region } from '../../lib/Immutable';
import { ClientStack } from '../../lib/ClientStack';
import { ReduxStore } from '../../lib/Redux';

import { Grid, Row, Col, Button } from 'react-bootstrap';

import { JobList } from './JobList';
import { SetPasswordModal } from './SetPasswordModal';

interface props {
    store: ReduxStore,
    user: string,
    users: Map<string, User>,
    jobs: Map<number, Job>,
    regions: Map<string, Region>
}

interface state {
    showPasswordModal?: boolean
    user: User
}

export class Account extends React.Component<props, {}> {
    state: state

    constructor(props: props) {
        super(props);
        this.state = {
            showPasswordModal: false,
            user: props.users.get(props.user, new User())
        }
    }

    shouldComponentUpdate(nextProps: props, nextState: state) {
        return !shallowequal(this.props, nextProps) || !shallowequal(this.state, nextState);
    }

    componentWillReceiveProps(newProps: props) {
        if (this.state.user !== newProps.users.get(newProps.user, this.state.user)) {
            this.setState({
                user: newProps.users.get(newProps.user)
            })
        }
    }

    handleNewPassword(password: string): Promise<void> {
        return ClientStack.User.SetPassword(this.state.user, password).then(() => {
            this.setState({
                showPasswordModal: false
            })
        });
    }

    showNewPassword() {
        this.setState({
            showPasswordModal: true
        })
    }

    cancelNewPassword() {
        this.setState({
            showPasswordModal: false
        })
    }

    render() {
        return (
            <Grid>
                <Row>
                    <Col md={2}>Avatar Name</Col>
                    <Col md={6}>{this.state.user.username} {this.state.user.lastname}</Col>
                </Row>
                <Row>
                    <Col md={2}>Avatar User Level</Col>
                    <Col md={6}>{this.state.user.godLevel}</Col>
                </Row>
                <Row>
                    <Col md={2}>User Email</Col>
                    <Col md={6}>{this.state.user.email}</Col>
                </Row>
                <hr />
                <Button onClick={this.showNewPassword.bind(this)} disabled={this.state.showPasswordModal}>Set Password</Button>
                <SetPasswordModal show={this.state.showPasswordModal} submit={this.handleNewPassword.bind(this)} cancel={this.cancelNewPassword.bind(this)} />
                <hr />
                <JobList store={this.props.store} jobs={this.props.jobs} regions={this.props.regions} />
            </Grid>
        )
    }
}
