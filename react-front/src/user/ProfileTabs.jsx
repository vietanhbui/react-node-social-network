import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import DefaultProfile from '../images/user_avatar.png';

class ProfileTabs extends Component {
    render() {
        const { following, followers, posts } = this.props;
        return (
            <div className="row">
                <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                    <h3 className="text-primary">Followers</h3>
                    <hr />
                    {followers.map((person, i) => (
                        <div key={i}>
                            <div>
                                <Link to={'/user/' + person._id}>
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
                                        alt={person.name}
                                        src={
                                            process.env.REACT_APP_URL +
                                            '/user/photo/' +
                                            person._id
                                        }
                                    />
                                    <div>
                                        <p className="lead">{person.name}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                    <h3 className="text-primary">Following</h3>
                    <hr />
                    {following.map((person, i) => (
                        <div key={i}>
                            <div>
                                <Link to={'/user/' + person._id}>
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
                                        alt={person.name}
                                        src={
                                            process.env.REACT_APP_URL +
                                            '/user/photo/' +
                                            person._id
                                        }
                                    />
                                    <div>
                                        <p className="lead">{person.name}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4">
                    <h3 className="text-primary">Posts</h3>
                    <hr />
                    {posts.map((post, i) => (
                        <div key={i}>
                            <div>
                                <Link to={'/post/' + post._id}>
                                    <div>
                                        <p className="lead">{post.title}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default ProfileTabs;