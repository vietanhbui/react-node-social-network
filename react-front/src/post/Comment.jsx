import React, { Component } from 'react';
import { comment, uncomment } from './apiPost';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
import DefaultProfile from '../images/user_avatar.png';

class Comment extends Component {
    constructor() {
        super();
        this.state = {
            text: '',
            error: ''
        };
    }

    handleChange = event => {
        this.setState({ text: event.target.value, error: '' });
    };

    isValid = () => {
        const { text } = this.state;
        if (!text.length > 0 || text.length > 150) {
            this.setState({
                error:
                    'Comment should not be empty and less than 150 characters long'
            });
            return false;
        }
        return true;
    };

    deleteComment = comment => {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        const postId = this.props.postId;

        uncomment(userId, token, postId, comment).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.props.updateComments(data.comments);
            }
        });
    };

    deleteConfirm = comment => {
        let answer = window.confirm(
            'Are you sure you want to delete this comment?'
        );
        if (answer) {
            this.deleteComment(comment);
        }
    };

    addComment = e => {
        e.preventDefault();
        if (!isAuthenticated()) {
            this.setState({ error: 'Please sign in to leave a comment' });
        }
        if (this.isValid()) {
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;
            const postId = this.props.postId;

            comment(userId, token, postId, { text: this.state.text }).then(
                data => {
                    if (data.error) {
                        console.log(data.error);
                    } else {
                        this.setState({ text: '' });
                        // dispatch fresh list of comments to parent (SinglePost)
                        this.props.updateComments(data.comments);
                    }
                }
            );
        }
    };

    render() {
        const { comments } = this.props;
        const { error } = this.state;
        return (
            <div>
                <h2 className="mt-5 mb-5">Leave a comment</h2>
                <form onSubmit={this.addComment}>
                    <div className="form-group">
                        <input
                            type="text"
                            value={this.state.text}
                            placeholder="Leave a comment..."
                            className="form-control"
                            onChange={this.handleChange}
                        />
                    </div>
                    <button className="btn btn-raised btn-success mt-2">
                        Post
                    </button>
                </form>
                <div
                    className="alert alert-warning"
                    style={{ display: error ? '' : 'none' }}
                >
                    {error}
                </div>
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <h3 className="text-primary">{comments.length} Comments</h3>
                    <hr />
                    {comments.map((comment, i) => {
                        return (
                            <div key={i}>
                                <div>
                                    <Link to={`/user/${comment.postedBy._id}`}>
                                        <img
                                            style={{
                                                border: '1px solid black',
                                                borderRadius: '50%'
                                            }}
                                            onError={i => {
                                                i.target.src = DefaultProfile;
                                            }}
                                            className="float-left mr-2"
                                            height="30px"
                                            alt={comment.postedBy.name}
                                            src={
                                                `${process.env.REACT_APP_URL}
                                                /user/photo/
                                                ${comment.postedBy._id}`
                                            }
                                        />
                                    </Link>
                                    <div>
                                        <p className="lead">{comment.text}</p>
                                    </div>
                                    <p className="font-italic mark">
                                        Posted by{' '}
                                        <Link
                                            to={`/user/${comment.postedBy._id}`}
                                        >
                                            {comment.postedBy.name}
                                        </Link>{' '}
                                        on{' '}
                                        {new Date(
                                            comment.created
                                        ).toDateString()}
                                        <span>
                                            {isAuthenticated() &&
                                                isAuthenticated().user._id ===
                                                comment.postedBy._id && (
                                                    <>
                                                        <span
                                                            onClick={() =>
                                                                this.deleteConfirm(
                                                                    comment
                                                                )
                                                            }
                                                            className="text-danger float-right mr-1"
                                                        >
                                                            Remove
                                                        </span>
                                                    </>
                                                )}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default Comment;
