import React, { Component } from "react"
import { connect } from "react-redux"
import styled from "styled-components"
import propTypes from "prop-types"
import {
  logoutUser,
  clearErrors
} from "../../../../../../redux/actions/authActions"
import { addChannel } from "../../../../../../redux/actions/channelActions"
import { deleteAccount } from "../../../../../../redux/actions/profileActions"
import TextFieldGroup from "../../../../../common/TextFieldGroup"
import { Link, withRouter } from "react-router-dom"
import isEmpty from "../../../../../../validation/is-empty"

class Heading extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showMenu: false,
      channelOptions: false,
      name: "",
      purpose: "",
      errors: {}
    }
  }

  // mount the even listener for clicking outside of the ref
  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside)
  }

  // unmount when done
  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside)
  }

  // check for new errors
  static getDerivedStateFromProps(nextProps, prevState) {
    return nextProps.errors
      ? { errors: nextProps.errors }
      : this.props.clearErrors()
  }

  // if errors were found, update the errors state
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.errors !== this.props.errors) {
      this.setState({ errors: this.props.errors })
    }

    if (prevProps.profile.profile !== this.props.profile.profile)
      return this.props.profile.profile
  }

  // open/close user menu
  showMenu = e => {
    e.preventDefault()
    e.stopPropagation()
    this.setState({
      showMenu: !this.state.showMenu
    })
  }

  // Alert if clicked on outside of element
  handleClickOutside = e => {
    if (this.wrapperRef && !this.wrapperRef.contains(e.target)) {
      this.setState({ showMenu: false, channelOptions: false })
    }
  }

  // log yourself out
  logout = () => {
    this.props.logoutUser()
  }

  // delete your account
  removeAccount = () => {
    this.props.deleteAccount()
  }

  // open menu button
  createChannel = e => {
    e.preventDefault()
    e.stopPropagation()
    this.setState({
      channelOptions: !this.state.channelOptions
    })
  }

  onSubmit = e => {
    e.preventDefault()
    const { name, purpose, errors } = this.state
    const newChannel = { name, purpose }
    // submit new channel to the server
    this.props.addChannel(newChannel)
    // if no errors, close the menu button
    if (isEmpty(errors)) {
      this.setState({
        channelOptions: !this.state.channelOptions,
        name: "",
        purpose: ""
      })
    }
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }

  // Set the wrapper ref
  setWrapperRef = node => {
    this.wrapperRef = node
  }

  render() {
    const { auth } = this.props
    const { profile } = this.props.profile
    const { errors, name, purpose } = this.state
    // split user name for sidebar
    let nameArr = []
    nameArr = auth.user.name.split(" ")
    return (
      <div>
        <Wrapper>
          <Container>
            <Image src={auth.user.avatar} alt={auth.user.name} />
            <div>
              <H4>{nameArr[0]}</H4>
              <p className="status">{profile.status}</p>
            </div>
          </Container>
          <div>
            <i onClick={this.showMenu} className="fas fa-cog cog" />
            {this.state.showMenu ? (
              <ul className="settings" ref={this.setWrapperRef}>
                <li>
                  <i className="fas fa-user-cog" />
                  <Link to={`/chatify/profile/${profile._id}`}>
                    Edit Status
                  </Link>
                </li>
                <hr />
                <li onClick={() => this.logout()}>
                  <i className="fas fa-sign-out-alt" />
                  Logout
                </li>
                <hr />
                <li onClick={() => this.removeAccount()}>
                  <i className="far fa-trash-alt" />
                  Delete Account
                </li>
                <hr />
              </ul>
            ) : null}
          </div>
        </Wrapper>
        <MakeChannel>
          <p>Make a channel</p>
          <div>
            <button className="btn" onClick={this.createChannel}>
              <i className="fas fa-plus-square" />
            </button>
          </div>
          {this.state.channelOptions ? (
            <Form onSubmit={this.onSubmit} ref={this.setWrapperRef}>
              <h5>Create Your Own Channel..</h5>
              <div className="separator">
                <i className="fas fa-charging-station" />
                <TextFieldGroup
                  placeholder="Name your channel..."
                  name="name"
                  type="text"
                  value={name.toLowerCase().replace(" ", "_")}
                  handleChange={this.handleChange}
                  error={errors.name}
                />
              </div>
              <div className="separator">
                <i className="fas fa-wind" />
                <TextFieldGroup
                  placeholder="Give it a purpose, not required..."
                  name="purpose"
                  type="text"
                  value={purpose}
                  handleChange={this.handleChange}
                />
              </div>
              <Button type="submit">
                <i className="fas fa-arrow-circle-down" /> Add Channel
              </Button>
            </Form>
          ) : null}
        </MakeChannel>
      </div>
    )
  }
}

Heading.propTypes = {
  auth: propTypes.object.isRequired,
  errors: propTypes.object.isRequired,
  logoutUser: propTypes.func.isRequired,
  addChannel: propTypes.func.isRequired,
  deleteAccount: propTypes.func.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  profile: state.profile
})

export default connect(
  mapStateToProps,
  { logoutUser, clearErrors, addChannel, deleteAccount }
)(withRouter(Heading))

const Form = styled.form`
  position: absolute;
  left: 211px;
  top: 87px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  border: 1px solid red;
  width: 238px;
  height: 205px;
  padding: 16px;
  box-shadow: 0px 0px 11px -1px rgba(0, 0, 0, 0.75);
  background: #ffffff;
  border: 1px solid slategray;
  border-radius: 4px;
  h5 {
    color: ${props => props.theme.inactive};
  }
  .separator {
    margin-top: 20px;
    color: ${props => props.theme.inactive};
  }
  i {
    font-size: 2rem;
    color: ${props => props.theme.inactive};
  }
`

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: 132px;
  border: 1px solid black;
  padding: 8px;
  margin: 10px;
  border-radius: 25px;
  cursor: pointer;
  background: #000000;
  color: ${props => props.theme.active};
  i {
    color: ${props => props.theme.active};
  }
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 250px;
  .cog {
    position: absolute;
    font-size: 2rem;
    color: ${props => props.theme.inactive};
    cursor: pointer;
    transition: 0.5s ease-in-out;
    position: relative;
    &:hover {
      color: ${props => props.theme.active};
      transform: rotate(360deg);
    }
  }
  .settings {
    z-index: 200;
    position: absolute;
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    box-shadow: 0px 0px 11px -1px rgba(0, 0, 0, 0.75);
    background: #ffffff;
    width: 165px;
    height: 278px;
    padding: 14px;
    border: 1px solid slategray;
    border-radius: 4px;
    hr {
      border-color: rgba(0, 0, 0, 0.1);
    }
    li:first-child {
      margin-top: 20px;
    }

    li {
      color: ${props => props.theme.inactive};
      cursor: pointer;
      display: flex;
      transition: 0.4s ease-in-out;
      margin-bottom: 22px;
      margin-top: 22px;
      &:hover {
        color: ${props => props.theme.active};
      }

      i {
        margin-right: 20px;
        &:hover {
          transform: rotate(0deg);
        }
      }
    }
  }
`

const Container = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
  .status {
    color: ${props => props.theme.active};
    margin-top: 13px;
    font-size: 1.6rem;
    max-width: 100px;
    text-overflow: ellipsis;
  }
`

const Image = styled.img`
  border-radius: 50%;
  width: 25px;
  height: 25px;
  margin-right: 10px;
`

const MakeChannel = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
  p {
    color: ${props => props.theme.active};
  }
  .btn {
    padding: 0;
    margin: 0;
    border: transparent;
    background: transparent;
    i {
      color: ${props => props.theme.inactive};
      font-size: 2rem;
      cursor: pointer;
      &:hover {
        color: ${props => props.theme.active};
      }
    }
  }
`
const H4 = styled.h4`
  color: ${props => props.theme.active};
`
