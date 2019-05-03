import React, { Component } from 'react';
import { isAuthenticated } from '../auth/index';
import { create } from './apiPost';
import { Redirect } from 'react-router-dom';

class NewPost extends Component {
    constructor() {
        super();
        this.state = {
            title: '',
            body: '',
            photo: '',
            loading: false,
            error: '',
            fileSize: 0,
            redirectToProfile: false,
            user: {}
        };
    }

    componentDidMount() {
        this.postData = new FormData();
        this.setState({ user: isAuthenticated().user });
    }

    isValid = () => {
        const { title, body, fileSize } = this.state;
        if (fileSize > 100000) {
            this.setState({
                error: 'File size should be less than 100kb',
                loading: false
            });
            return false;
        }
        if (title.length === 0) {
            this.setState({ error: 'Title is required', loading: false });
            return false;
        }
        if (body.length === 0) {
            this.setState({ error: 'Body is required', loading: false });
            return false;
        }
        return true;
    };

    handleChange = name => event => {
        this.setState({ error: '' });
        const value =
            name === 'photo' ? event.target.files[0] : event.target.value;
        const fileSize = name === 'photo' ? event.target.files[0].size : 0;
        this.postData.set(name, value);
        this.setState({ [name]: event.target.value, fileSize });
    };

    clickSubmit = e => {
        e.preventDefault();
        this.setState({ loading: true });
        if (this.isValid()) {
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;
            create(userId, token, this.postData).then(data => {
                if (data.error) {
                    this.setState({ error: data.error });
                } else {
                    this.setState({
                        title: '',
                        body: '',
                        photo: '',
                        loading: false,
                        redirectToProfile: true
                    });
                }
            });
        }
    };

    newPostForm = (title, body) => (
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
                <label className="text-muted">Title</label>
                <input
                    onChange={this.handleChange('title')}
                    type="text"
                    className="form-control"
                    value={title}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Body</label>
                <textarea
                    style={{ height: '200px' }}
                    onChange={this.handleChange('body')}
                    type="text"
                    className="form-control"
                    value={body}
                />
            </div>
            <button
                onClick={this.clickSubmit}
                className="btn btn-primary btn-raised"
            >
                Create Post
            </button>
        </form>
    );

    render() {
        const {
            title,
            body,
            user,
            redirectToProfile,
            error,
            loading
        } = this.state;

        if (redirectToProfile) {
            return <Redirect to={'/user/' + user._id} />;
        }

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Create a new post</h2>
                <div
                    className="alert alert-warning"
                    style={{ display: error ? '' : 'none' }}
                >
                    {error}
                </div>
                {loading ? (
                    <div className="jumbotron text-center">
                        <h2>Loading...</h2>
                    </div>
                ) : (
                        ''
                    )}
                {this.newPostForm(title, body)}
            </div>
        );
    }
}

export default NewPost;
