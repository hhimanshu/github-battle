const React = require('react');
const PropTypes = require('prop-types');
const Link = require('react-router-dom').Link;
const PlayerPreview = require('./PlayerPreview');

class PlayerInput extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            username: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const value = event.target.value;
        this.setState(function () {
            return {
                username: value
            };
        })
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.onSubmit(this.props.id, this.state.username);
    }

    render() {
        return (
            <form className="column" onSubmit={this.handleSubmit}>
                <label className="header" htmlFor="username">
                    {this.props.label}
                </label>
                <input
                    id="username"
                    type="text"
                    autoComplete="off"
                    placeholder="github username"
                    value={this.state.username}
                    onChange={this.handleChange}
                />
                <button
                    className="button"
                    type="submit"
                    disabled={!this.state.username}
                >Submit
                </button>
            </form>
        );
    }
}

PlayerInput.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired
};

class Battle extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            playerOneName: '',
            playerTwoName: '',
            playerOneImage: null,
            playerTwoImage: null
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleReset = this.handleReset.bind(this);
    }

    handleSubmit(id, username) {
        this.setState(function () {
            const newState = {};
            newState[id + 'Name'] = username;
            newState[id + "Image"] = "https://github.com/" + username + '.png?size=200';
            return newState;
        })
    }

    handleReset(id) {
        this.setState(function () {
            const newState = {};
            newState[id + 'Name'] = '';
            newState[id + "Image"] = null;
            return newState;
        })
    }


    render() {
        const playerOneName = this.state.playerOneName;
        const playerTwoName = this.state.playerTwoName;
        const playerOneImage = this.state.playerOneImage;
        const playerTwoImage = this.state.playerTwoImage;
        const match = this.props.match;

        return (
            <div>
                <div className="row">
                    {!playerOneName &&
                    <PlayerInput
                        id="playerOne"
                        label="Player One"
                        onSubmit={this.handleSubmit}/>}

                    {playerOneImage !== null &&
                    <PlayerPreview
                        username={playerOneName}
                        avatar={playerOneImage}
                    >
                        <button
                            className="reset"
                            onClick={this.handleReset.bind(null, 'playerOne')}
                        >Reset</button>
                    </PlayerPreview>}

                    {!playerTwoName &&
                    <PlayerInput
                        id="playerTwo"
                        label="Player Two"
                        onSubmit={this.handleSubmit}/>}

                    {playerTwoImage !== null &&
                    <PlayerPreview
                        username={playerTwoName}
                        avatar={playerTwoImage}
                    >
                        <button
                            className="reset"
                            onClick={this.handleReset.bind(null, 'playerTwo')}
                        >Reset</button>
                    </PlayerPreview>}

                </div>

                {playerTwoImage && playerTwoImage &&
                <Link
                    className="button"
                    to={{
                        pathname: match.url + "/results",
                        search: "?playerOneName=" + playerOneName + "&playerTwoName=" + playerTwoName
                    }}>
                    Battle
                </Link>}
            </div>
        )
    }
}

module.exports = Battle;