import React, { Component } from 'react';
import { list } from './apiPost';
import { Link } from 'react-router-dom';
import DefaultPost from '../images/giaotiep.jpg';

class Posts extends Component {
    constructor() {
        super();
        this.state = {
            posts: []
        };
    }

    componentDidMount() {
        list().then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ posts: data });
            }
        });
    }

    renderPosts = posts => {
        return (
            <div className="row">
                {posts.map((post, index) => {
                    const posterId = post.postedBy ? post.postedBy._id : '';
                    const posterName = post.postedBy
                        ? post.postedBy.name
                        : 'Unknown';
                    const postBody =
                        post.body.length > 100
                            ? post.body.substring(0, 100) + '...'
                            : post.body;
                    return (
                        <div
                            className="card col-xs-4 col-sm-4 col-md-4 col-lg-4"
                            key={index}
                        >
                            <div className="card-body">
                                <img
                                    className="img-thumbnail mb-3"
                                    style={{ height: '200px', width: '100%' }}
                                    src={
                                        process.env.REACT_APP_URL +
                                        '/post/photo/' +
                                        post._id
                                    }
                                    alt={post.title}
                                    onError={index =>
                                        (index.target.src = DefaultPost)
                                    }
                                />
                                <h5 className="card-title">{post.title}</h5>
                                <p className="card-text">{postBody}</p>
                                <br />
                                <p className="font-italic mark">
                                    Posted by{' '}
                                    <Link to={'/user/' + posterId}>
                                        {posterName}
                                    </Link>{' '}
                                    on {new Date(post.created).toDateString()}
                                </p>
                                <Link
                                    to={'/post/' + post._id}
                                    className="btn btn-raised btn-sm btn-primary"
                                >
                                    Read more
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    render() {
        const { posts } = this.state;
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">{!posts.length ? 'Loading...' : 'Recent Posts'}</h2>
                {this.renderPosts(posts)}
            </div>
        );
    }
}

export default Posts;
