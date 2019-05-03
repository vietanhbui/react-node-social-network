import React, { Component } from 'react';
import { singlePost, remove, like, unlike } from './apiPost';
import { Link, Redirect } from 'react-router-dom';
import DefaultPost from '../images/giaotiep.jpg';
import Comment from './Comment';
import { isAuthenticated } from '../auth/index';

class SinglePost extends Component {
    constructor() {
        super();
        this.state = {
            post: '',
            redirectToSignin: false,
            redirectToHome: false,
            like: false,
            likes: 0,
            comments: [],
            reverseComments: true
        };
    }

    deletePost = () => {
        const postId = this.state.post._id;
        const token = isAuthenticated().token;
        remove(postId, token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({
                    redirectToHome: true,
                    likes: data.likes.length
                });
            }
        });
    };

    deleteConfirm = () => {
        let answer = window.confirm(
            'Are you sure you want to delete this post?'
        );
        if (answer) {
            this.deletePost();
        }
    };

    likeToggle = () => {
        if (!isAuthenticated()) {
            this.setState({ redirectToSignin: true });
            return false;
        }
        let callApi = this.state.like ? unlike : like;
        const userId = isAuthenticated().user._id;
        const postId = this.state.post._id;
        const token = isAuthenticated().token;
        callApi(userId, token, postId).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({
                    like: !this.state.like,
                    likes: data.likes.length,
                    comments: this.state.comments.reverse()
                });
            }
        });
    };

    checkLike = likes => {
        const userId = isAuthenticated() && isAuthenticated().user._id;
        return likes.indexOf(userId) !== -1;
    };

    componentDidMount() {
        const postId = this.props.match.params.postId;
        singlePost(postId).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({
                    post: data,
                    likes: data.likes.length,
                    like: this.checkLike(data.likes),
                    comments: data.comments
                });
            }
        });
    }

    updateComments = comments => {
        this.setState({ comments });
    };

    renderPost = post => {
        const posterId = post.postedBy ? post.postedBy._id : '';
        const posterName = post.postedBy ? post.postedBy.name : 'Unknown';
        const { like, likes } = this.state;

        return (
            <div className="card-body">
                <img
                    className="img-thumbnail mb-3"
                    style={{
                        height: '300px',
                        width: '100%',
                        objectFit: 'cover'
                    }}
                    src={process.env.REACT_APP_URL + '/post/photo/' + post._id}
                    alt={post.title}
                    onError={index => (index.target.src = DefaultPost)}
                />
                {like ? (
                    <h3 onClick={this.likeToggle}>
                        <i
                            className="fa fa-thumbs-up text-warning bg-dark"
                            style={{ padding: '10px', borderRadius: '50%' }}
                        />{' '}
                        {likes} Likes
                    </h3>
                ) : (
                    <h3 onClick={this.likeToggle}>
                        <i
                            className="fa fa-thumbs-up text-success bg-dark"
                            style={{ padding: '10px', borderRadius: '50%' }}
                        />{' '}
                        {likes} Likes
                    </h3>
                )}
                <p className="card-text">{post.body}</p>
                <br />
                <p style={{ textAlign: 'right' }} className="font-italic mark">
                    Posted by <Link to={'/user/' + posterId}>{posterName}</Link>{' '}
                    on {new Date(post.created).toDateString()}
                </p>
                <div className="d-inline-block">
                    <Link to="/" className="btn btn-raised btn-primary mr-5">
                        Back to posts
                    </Link>
                    {isAuthenticated() &&
                        isAuthenticated().user._id === post.postedBy._id && (
                            <>
                                <Link
                                    to={'/post/edit/' + post._id}
                                    className="btn btn-raised btn-warning mr-5"
                                >
                                    Update Post
                                </Link>
                                <button
                                    onClick={this.deleteConfirm}
                                    className="btn btn-raised btn-danger"
                                >
                                    Delete Post
                                </button>
                            </>
                        )}
                </div>
            </div>
        );
    };

    render() {
        const { post, redirectToHome, redirectToSignin, comments } = this.state;
        if (redirectToHome) {
            return <Redirect to="/" />;
        } else if (redirectToSignin) {
            return <Redirect to="/signin" />;
        }
        return (
            <div className="container">
                <h2 className="display-2 mt-5 mb-5">{post.title}</h2>
                {!post ? (
                    <div className="jumbotron text-center">
                        <h2>Loading..</h2>
                    </div>
                ) : (
                    this.renderPost(post)
                )}
                <Comment
                    postId={post._id}
                    comments={comments.reverse()}
                    updateComments={this.updateComments}
                />
            </div>
        );
    }
}

export default SinglePost;
