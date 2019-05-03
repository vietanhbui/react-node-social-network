import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { signout, isAuthenticated } from '../auth/index';

const isActive = (history, path) => {
    if (history.location.pathname === path) {
        return { color: '#ff9900' };
    } else {
        return { color: '#ffffff' };
    }
};

const Menu = ({ history }) => (
    <div>
        <ul className="nav nav-tabs bg-primary">
            <li className="nav-item">
                <Link
                    className="nav-link"
                    style={isActive(history, '/')}
                    to="/"
                >
                    Home
                </Link>
            </li>
            <li className="nav-item">
                <Link
                    className="nav-link"
                    style={isActive(history, '/users')}
                    to="/users"
                >
                    Users
                </Link>
            </li>
            <li className="nav-item">
                <Link
                    className="nav-link"
                    style={isActive(history, '/post/create')}
                    to="/post/create"
                >
                    Create Post
                        </Link>
            </li>
            {!isAuthenticated() ? (
                <>
                    <li className="nav-item">
                        <Link
                            className="nav-link"
                            style={isActive(history, '/signin')}
                            to="/signin"
                        >
                            Sign In
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link
                            className="nav-link"
                            style={isActive(history, '/signup')}
                            to="/signup"
                        >
                            Sign Up
                        </Link>
                    </li>
                </>
            ) : (
                    <>
                        <li className="nav-item">
                            <Link
                                className="nav-link"
                                style={isActive(history, '/findpeople')}
                                to="/findpeople"
                            >
                                Find people
                        </Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className="nav-link"
                                style={isActive(
                                    history,
                                    '/user/' + isAuthenticated().user._id
                                )}
                                to={'/user/' + isAuthenticated().user._id}
                            >
                                {isAuthenticated().user.name + "'s profile"}
                            </Link>
                        </li>
                        <li className="nav-item">
                            <span
                                onClick={() => signout(() => history.push('/'))}
                                className="nav-link"
                                style={
                                    (isActive(history, '/'),
                                        { cursor: 'pointer', color: '#fff' })
                                }
                            >
                                Sign Out
                        </span>
                        </li>
                    </>
                )}
        </ul>
    </div>
);

export default withRouter(Menu);
