import React, { Component } from 'react';
import { isAuthenticated } from '../auth/index';
import { Redirect } from 'react-router-dom';
import DefaultProfile from '../images/user_avatar.png';
import { read } from './apiUser';
import { Link } from 'react-router-dom';
import DeleteUser from './DeleteUser';
import FollowProfileButton from './FollowProfileButton';
import ProfileTabs from './ProfileTabs';
import { listByUser } from '../post/apiPost';

class Profile extends Component {
    constructor() {
        super();
        this.state = {
            user: { following: [], followers: [] },
            redirectToSignin: false,
            following: false,
            error: '',
            posts: []
        };
    }

    clickFollowButton = callApi => {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        callApi(userId, token, this.state.user._id).then(data => {
            if (data.error) {
                this.setState({ error: data.error });
            } else {
                this.setState({ user: data, following: !this.state.following });
            }
        });
    };

    init = userId => {
        read(userId, isAuthenticated().token).then(data => {
            if (data.error) {
                this.setState({
                    redirectToSignin: true
                });
            } else {
                let following = this.checkFollow(data);
                this.setState({
                    user: data,
                    following
                });
                this.loadPosts(data._id);
            }
        });
    };

    loadPosts = userId => {
        const token = isAuthenticated().token;
        listByUser(userId, token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ posts: data });
            }
        });
    };

    checkFollow = user => {
        const jwt = isAuthenticated();
        const match = user.followers.find(follower => {
            return follower._id === jwt.user._id;
        });
        return match;
    };

    componentDidMount() {
        this.init(this.props.match.params.userId);
    }

    componentWillReceiveProps(props) {
        this.init(props.match.params.userId);
    }

    render() {
        const { redirectToSignin, user, posts } = this.state;
        const photoUrl = user._id
            ? process.env.REACT_APP_URL +
              '/user/photo/' +
              user._id +
              '?' +
              new Date().getTime()
            : DefaultProfile;
        if (redirectToSignin) {
            return <Redirect to="/signin" />;
        }

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Profile</h2>
                <div className="row">
                    <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                        <img
                            style={{ height: '200px', width: 'auto' }}
                            className="img-thumbnail"
                            src={photoUrl}
                            onError={i => {
                                i.target.src = DefaultProfile;
                            }}
                            alt={user.name}
                        />
                    </div>
                    <div className="col-xs-8 col-sm-8 col-md-8 col-lg-8">
                        <div className="lead mt-2">
                            <p>Hello {user.name}</p>
                            <p>Email: {user.email}</p>
                            <p>
                                {'Joined ' +
                                    new Date(user.created).toDateString()}
                            </p>
                        </div>
                        {isAuthenticated().user &&
                        isAuthenticated().user._id === user._id ? (
                            <div className="d-inline-block mt-5">
                                <Link
                                    className="btn btn-raised btn-info mr-5"
                                    to={'/post/create'}
                                >
                                    Create Post
                                </Link>
                                <Link
                                    className="btn btn-raised btn-success mr-5"
                                    to={'/user/edit/' + user._id}
                                >
                                    Edit Profile
                                </Link>
                                <DeleteUser userId={user._id} />
                            </div>
                        ) : (
                            <FollowProfileButton
                                following={this.state.following}
                                onButtonClick={this.clickFollowButton}
                            />
                        )}
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 mt-5 mb-5">
                        <hr />
                        <p className="lead">{user.about}</p>
                        <hr />
                        <ProfileTabs
                            followers={user.followers}
                            following={user.following}
                            posts={posts}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default Profile;
