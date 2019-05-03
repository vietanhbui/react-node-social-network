export const read = (userId, token) => {
    return fetch(process.env.REACT_APP_URL + '/user/' + userId, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
        }
    })
        .then(response => {
            return response.json();
        })
        .catch(error => {
            console.log(error);
        });
};

export const update = (userId, token, user) => {
    return fetch(process.env.REACT_APP_URL + '/user/' + userId, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + token
        },
        body: user
    })
        .then(response => {
            return response.json();
        })
        .catch(error => {
            console.log(error);
        });
};

export const remove = (userId, token) => {
    return fetch(process.env.REACT_APP_URL + '/user/' + userId, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
        }
    })
        .then(response => {
            return response.json();
        })
        .catch(error => {
            console.log(error);
        });
};

export const list = () => {
    return fetch(process.env.REACT_APP_URL + '/users', {
        method: 'GET'
    })
        .then(response => {
            return response.json();
        })
        .catch(error => {
            console.log(error);
        });
};

export const updateUser = (user, next) => {
    if (typeof window !== 'undefined') {
        if (localStorage.getItem('jwt')) {
            let auth = JSON.parse(localStorage.getItem('jwt'));
            auth.user = user;
            localStorage.setItem('jwt', JSON.stringify(auth));
            next();
        }
    }
}

export const follow = (userId, token, followId) => {
    console.log(JSON.stringify({ userId, followId }));
    return fetch(process.env.REACT_APP_URL + '/user/follow', {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
        },
        body: JSON.stringify({ userId, followId })
    })
        .then(response => {
            return response.json();
        })
        .catch(error => {
            console.log(error);
        });
};

export const unfollow = (userId, token, unfollowId) => {
    return fetch(process.env.REACT_APP_URL + '/user/unfollow', {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
        },
        body: JSON.stringify({ userId, unfollowId })
    })
        .then(response => {
            return response.json();
        })
        .catch(error => {
            console.log(error);
        });
};

export const findPeople = (userId, token) => {
    return fetch(process.env.REACT_APP_URL + '/user/findpeople/' + userId, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
        },
    })
        .then(response => {
            return response.json();
        })
        .catch(error => {
            console.log(error);
        });
};