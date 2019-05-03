import React, { Component } from 'react';
import { isAuthenticated } from '../auth/index';
import { read, update } from './apiUser';
import { Redirect } from 'react-router-dom';
import DefaultProfile from '../images/user_avatar.png';
import { updateUser } from '../user/apiUser';

class EditProfile extends Component {
    constructor() {
        super();
        this.state = {
            id: '',
            name: '',
            password: '',
            email: '',
            redirectToProfile: false,
            error: '',
            fileSize: 0,
            loading: false,
            about: ''
        };
    }

    init = userId => {
        read(userId, isAuthenticated().token).then(data => {
            if (data.error) {
                this.setState({ error: data.error });
            } else {
                this.setState({
                    id: data._id,
                    name: data.name,
                    email: data.email,
                    error: '',
                    about: data.about
                });
            }
        });
    };

    componentDidMount() {
        this.userData = new FormData();
        this.init(this.props.match.params.userId);
    }

    isValid = () => {
        const { name, email, password, fileSize } = this.state;
        if (fileSize > 100000) {
            this.setState({
                error: 'File size should be less than 100kb',
                loading: false
            });
            return false;
        }
        if (name.length === 0) {
            this.setState({ error: 'Name is required', loading: false });
            return false;
        }
        // eslint-disable-next-line no-useless-escape
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            this.setState({
                error: 'A valid email is required',
                loading: false
            });
            return false;
        }
        if (password.length >= 1 && password.length <= 5) {
            this.setState({
                error: 'Password must be at least 6 characters long',
                loading: false
            });
            return false;
        }
        if (password.length !== 0 && !/\d/.test(password)) {
            this.setState({
                error: 'Password must contain a number',
                loading: false
            });
            return false;
        }
        return true;
    };

    handleChange = name => event => {
        this.setState({ error: '' });
        const value =
            name === 'photo' ? event.target.files[0] : event.target.value;
        const fileSize = name === 'photo' ? event.target.files[0].size : 0;
        this.userData.set(name, value);
        this.setState({ [name]: event.target.value, fileSize });
    };

    clickSubmit = e => {
        e.preventDefault();
        this.setState({ loading: true });
        if (this.isValid()) {
            // const { name, email, password } = this.state;
            // const user = {
            //     name,
            //     email,
            //     password: password || undefined
            // };
            // console.log(JSON.stringify(user));
            const userId = this.props.match.params.userId;
            const token = isAuthenticated().token;
            update(userId, token, this.userData).then(data => {
                if (data.error) {
                    this.setState({ error: data.error });
                } else {
                    updateUser(data, () => {
                        this.setState({
                            redirectToProfile: true,
                            error: ''
                        });
                    });
                }
            });
        }
    };

    signupForm = (name, email, password, about) => (
        <form>
            <div className="form-group">
                <label className="text-muted">Profile photo</label>
                <input
                    onChange={this.handleChange('photo')}
                    type="file"
                    accept="image/*"
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input
                    onChange={this.handleChange('name')}
                    type="text"
                    className="form-control"
                    value={name}
                />
            </div>
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
                <label className="text-muted">About</label>
                <textarea
                    onChange={this.handleChange('about')}
                    type="text"
                    className="form-control"
                    value={about}
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
                Update
            </button>
        </form>
    );

    render() {
        const {
            id,
            name,
            email,
            password,
            redirectToProfile,
            error,
            about,
            loading
        } = this.state;

        const photoUrl = id
            ? process.env.REACT_APP_URL +
              '/user/photo/' +
              id +
              '?' +
              new Date().getTime()
            : DefaultProfile;

        if (redirectToProfile) {
            return <Redirect to={'/user/' + id} />;
        }

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Edit Profile</h2>
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
                <img
                    style={{ height: '200px', width: 'auto' }}
                    className="img-thumbnail"
                    src={photoUrl}
                    onError={i => {
                        i.target.src = DefaultProfile;
                    }}
                    alt={name}
                />
                {this.signupForm(name, email, password, about)}
            </div>
        );
    }
}

export default EditProfile;
