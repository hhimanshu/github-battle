const axios = require('axios');

const id = 'YOUR_CLIENT_ID';
const sec = 'YOUR_CLIENT_SECRET';
const params = '?client_id' + id + '&client_secret=' + sec;

var instance = axios.create({
    baseURL: 'https://api.github.com/',
    timeout: 1000,
    headers: {"Authorization": "token e88e5a05b8a9daa6562377c10b661f596168aaf3"}
});

function getProfile(username) {
    return instance.get('https://api.github.com/users/' + username)
        .then(function (user) {
            return user.data;
        });
}

function getRepos(username) {
    return instance.get('https://api.github.com/users/' + username + '/repos?per_page=100');
}

function getStarCount(repos) {
    return repos.data.reduce(function (count, repo) {
        return count + repo.stargazers_count;
    }, 0);
}

function calculateScore(profile, repos) {
    const followers = profile.followers;
    const totalStars = getStarCount(repos);

    return (followers * 3) + totalStars;
}

function handleError(error) {
    console.warn(error);
    return null;
}

function getUserData(player) {
    return axios.all([
        getProfile(player),
        getRepos(player)
    ]).then(function (data) {
        return {
            profile: data[0],
            score: calculateScore(data[0], data[1])
        }
    });
}

function sortPlayers(players) {
    return players.sort(function (a, b) {
        return b.score - a.score;
    });
}

module.exports = {
    battle: function (players) {
        return axios.all(players.map(getUserData))
            .then(sortPlayers)
            .catch(handleError)
    },
    fetchPopularRepos: function (language) {
        const encodedURI = window.encodeURI('https://api.github.com/search/repositories?q=stars:>1+language:' + language + '&sort=stars&order=desc&type=Repositories');
        return axios.get(encodedURI)
            .then(function (response) {
                return response.data.items;
            })
    }
};