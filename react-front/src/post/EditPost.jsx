import React, { Component } from 'react';
import { singlePost, update } from './apiPost';
import { isAuthenticated } from '../auth/index';
import { Redirect } from 'react-router-dom';
import DefaultPost from '../images/giaotiep.jpg';

class EditPost extends Component {
    constructor() {
        super();
        this.state = {
            id: '',
            title: '',
            body: '',
            error: '',
            redirectToProfile: false,
            fileSize: 0,
            loading: false
        };
    }

    init = postId => {
        singlePost(postId).then(data => {
            if (data.error) {
                this.setState({ error: data.error });
            } else {
                this.setState({
                    id: data._id,
                    title: data.title,
                    body: data.body,
                    error: ''
                });
            }
        });
    };

    componentDidMount() {
        this.postData = new FormData();
        this.init(this.props.match.params.postId);
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
            const postId = this.state.id;
            const token = isAuthenticated().token;
            update(postId, token, this.postData).then(data => {
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

    editPostForm = (title, body) => (
        <form>
            <div className="form-group">
                <label className="text-muted">Post photo</label>
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
                Update Post
            </button>
        </form>
    );

    render() {
        const {
            id,
            title,
            body,
            redirectToProfile,
            error,
            loading
        } = this.state;

        if (redirectToProfile) {
            return <Redirect to={'/user/' + isAuthenticated().user._id} />;
        }

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">{title}</h2>
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
                    src={
                        process.env.REACT_APP_URL +
                        '/post/photo/' +
                        id +
                        '?' +
                        new Date().getTime()
                    }
                    onError={i => {
                        i.target.src = DefaultPost;
                    }}
                    alt={title}
                />
                {this.editPostForm(title, body)}
            </div>
        );
    }
}

export default EditPost;
