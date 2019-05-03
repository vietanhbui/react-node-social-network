import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { signin, authenticate } from '../auth/index';
import SocialLogin from './SocialLogin';

class Signin extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            error: '',
            redirectToReferer: false,
            loading: false
        };
    }

    handleChange = name => event => {
        this.setState({
            error: ''
        });
        this.setState({
            [name]: event.target.value
        });
    };

    clickSubmit = e => {
        e.preventDefault();
        this.setState({ loading: true });
        const { email, password } = this.state;
        const user = { email, password };
        signin(user).then(data => {
            if (data.error) {
                this.setState({
                    error: data.error,
                    loading: false
                });
            } else {
                // authenticate
                authenticate(data, () => {
                    this.setState({
                        redirectToReferer: true,
                        loading: false
                    });
                });
            }
        });
    };

    signinForm = (email, password) => (
        <form>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input
                    onChange={this.handleChange('email')}
                    type="email"
                    className="form-control"
                    value={email}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input
                    onChange={this.handleChange('password')}
                    type="password"
                    className="form-control"
                    value={password}
                />
            </div>
            <button
                onClick={this.clickSubmit}
                className="btn btn-primary btn-raised"
            >
                Sign in
            </button>
        </form>
    );

    render() {
        const {
            email,
            password,
            error,
            redirectToReferer,
            loading
        } = this.state;

        if (redirectToReferer) {
            return <Redirect to="/" />;
        }

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Sign In</h2>
                <div
                    className="alert alert-warning"
                    style={{ display: error ? '' : 'none' }}
                >
                    {error}
                </div>
                {loading ? (
                    <div className="jumbotron text-center">
                        <h2>Loading..</h2>
                    </div>
                ) : (
                    ''
                )}
                {this.signinForm(email, password)}
                <div className="row">
                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <p style={{paddingTop: '10px'}}>
                            <Link to="/forgot-password" className="text-danger">
                                {' '}
                                Forgot Password
                            </Link>
                        </p>
                    </div>
                    <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <SocialLogin />
                    </div>
                </div>
            </div>
        );
    }
}

export default Signin;
