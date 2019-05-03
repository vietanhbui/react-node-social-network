import React, { Component } from 'react';
import { follow, unfollow } from './apiUser';

class FollowProfileButton extends Component {
    followClick = () => {
        this.props.onButtonClick(follow);
    };

    unfollowClick = () => {
        this.props.onButtonClick(unfollow);
    };

    render() {
        return (
            <div className="d-inline-block">
                {this.props.following ? (
                    <button
                        onClick={this.unfollowClick}
                        className="btn btn-warning btn-raised"
                    >
                        Unfollow
                    </button>
                ) : (
                    <button
                        onClick={this.followClick}
                        className="btn btn-success btn-raised mr-4"
                    >
                        Follow
                    </button>
                )}
            </div>
        );
    }
}

export default FollowProfileButton;
