import React, { Component } from 'react';
import classes from './ProfileSettings.module.css';
import defaultProfilePicture from '../../../pics/default-profile-pic.jpg';
import DisplayInterestsImport from './displayInterests/displayInterests';
import SettingsNavbar from '../SettingsNavbar/SettingsNavbar';
import Button from '../../../components/UI/Button/Button';

class ProfileSettings extends Component {
    state = {
        displayUploadError: false,
        displayDublicateError: false,
        displayEmptyInterestError: false,
        // User inputed interest
        Interests: '',
        storeInterests: [],
        profileSelected: true,
        changedProfileData: {
            FirstName: '',
            Lastname: '',
            AboutMe: '',
            storeAllInterests: [],
            selectedFile: null
        }
    };
    fileSelectedHandler = event => {
        const string = 'image';
        let svg = event.target.files[0].type.includes('image/svg+xml');
        let gif = event.target.files[0].type.includes('image/gif');
        if (event.target.files[0].type.includes(string) && !svg && !gif) {
            this.hideUploadError();
            this.setState({
                changedProfileData: {
                    ...this.state.changedProfileData,
                    selectedFile: event.target.files[0]
                }
            });
        } else {
            this.displayUploadError();
        }
    };
    // Get submitted value.
    handleSubmit = event => {
        event.preventDefault();
        console.log(this.state.changedProfileData);
    };
    addInterest = () => {
        let isDublicate = this.isInterestDublicate();

        if (this.state.Interests === '') {
            this.displayEmptyInterestError();
        } else if (isDublicate) {
            this.displayDublicateError();
        } else {
            this.hideDublicateError();
            this.storeInterests();
        }
    };
    storeInterests = () => {
        this.setState(
            {
                storeInterests: [
                    ...this.state.storeInterests,
                    this.state.Interests
                ]
            },
            function() {
                /* TODO
                    Couldn't figure it out how to update storeAllInterest in object
                    So I Created another variable that transfers
                    storeAllInterests value into this.state.storeInterests.
                    */
                this.setState({
                    changedProfileData: {
                        ...this.state.changedProfileData,
                        storeAllInterests: this.state.storeInterests
                    }
                });
            }
        );
    };
    isInterestDublicate = () => {
        let isDublicate = this.state.storeInterests.find(
            interest => interest === this.state.Interests
        );
        return isDublicate;
    };
    removeInterest = data => {
        const interestsToKeep = this.state.storeInterests.filter(
            interest => interest !== data
        );
        if (this.state.storeInterests.length > interestsToKeep.length) {
            this.setState({
                storeInterests: interestsToKeep
            });
        }
    };

    displayUploadError = () => this.setState({ displayUploadError: true });
    hideUploadError = () => this.setState({ displayUploadError: false });

    displayDublicateError = () =>
        this.setState({ displayDublicateError: true });
    hideDublicateError = () => this.setState({ displayDublicateError: false });

    cleanInterestState = () => this.setState({ Interests: '' });

    displayEmptyInterestError = () =>
        this.setState({ displayEmptyInterestError: true });
    hideEmptyInterestError = () =>
        this.setState({ displayEmptyInterestError: false });
    // Get input value to object
    handleChangeObject = event => {
        this.setState({
            changedProfileData: {
                ...this.state.changedProfileData,
                [event.target.name]: event.target.value
            }
        });
    };
    // Get input value from items not int the object.
    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    render() {
        // Render only if file format is not supported.
        let uploadError = '';
        if (this.state.displayUploadError) {
            uploadError = <p>This type of file is not supported</p>;
        }

        let dublicateError = '';
        if (this.state.displayDublicateError) {
            dublicateError = <p>This interest already exist</p>;
        }
        let emptyInterest = '';
        if (this.state.displayEmptyInterestError) {
            emptyInterest = <p>Interests can be empty space</p>;
        }

        return (
            <React.Fragment>
                <SettingsNavbar profileSelected={this.state.profileSelected} />
                <form
                    onSubmit={this.handleSubmit}
                    className={classes.container}
                >
                    <div className={classes.pictureItem}>
                        <img
                            src={defaultProfilePicture}
                            alt=""
                            className={classes.img}
                        />
                        <input
                            type="file"
                            style={{ display: 'none' }}
                            onChange={this.fileSelectedHandler}
                            ref={fileInput => (this.fileInput = fileInput)}
                        />
                        <p
                            className={classes.changePicture}
                            onClick={() => this.fileInput.click()}
                        >
                            Change picture
                        </p>
                        {uploadError}
                    </div>
                    <div className={classes.form}>
                        <div className={classes.nameContainer}>
                            <div>
                                <label htmlFor="Firstname">Firstname</label>
                                <br />
                                <input
                                    type="text"
                                    name="FirstName"
                                    className={[
                                        classes.input,
                                        classes.u_width_80
                                    ].join(' ')}
                                    onChange={this.handleChangeObject}
                                />
                            </div>
                            <div>
                                <label htmlFor="Lastname">Lastname</label>
                                <br />
                                <input
                                    type="text"
                                    name="Lastname"
                                    className={[
                                        classes.input,
                                        classes.u_width_80
                                    ].join(' ')}
                                    onChange={this.handleChangeObject}
                                />
                            </div>
                        </div>
                        <div>
                            <p>About me</p>
                            <textarea
                                name="AboutMe"
                                cols="30"
                                rows="10"
                                onChange={this.handleChangeObject}
                            />
                        </div>
                        <div>
                            <p>Interests</p>
                            <input
                                type="text"
                                name="Interests"
                                className={classes.input}
                                onChange={this.handleChange}
                            />
                            <Button
                                btnType="ProfileSettingsInterests"
                                onClick={this.addInterest}
                            >
                                Add
                            </Button>
                            {dublicateError}
                            {emptyInterest}
                            <div className={classes.displayInterests}>
                                {this.state.storeInterests.map(
                                    (data, index) => {
                                        return (
                                            <DisplayInterestsImport
                                                key={index}
                                                info={data}
                                                removeInterest={() =>
                                                    this.removeInterest(data)
                                                }
                                            />
                                        );
                                    }
                                )}
                            </div>
                        </div>
                        <div className={classes.submitContainer}>
                            <Button
                                btnType="ProfileSettingsInterests"
                                type="submit"
                            >
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </form>
            </React.Fragment>
        );
    }
}

export default ProfileSettings;
