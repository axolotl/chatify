import React, { Component } from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import styled from 'styled-components';
import ToggleButton from '../sidebar/sidedrawer/ToggleButton';
import { drawerOpen, drawerClose } from '../../../../redux/actions/drawerActions';
import Robot from '../../../../img/robot.png';

class Toolbar extends Component {
	drawerHandler = (e) => {
		e.preventDefault();
		console.log(this.props.drawer);
		this.props.drawer ? this.props.drawerOpen() : this.props.drawerClose();
	};

	static getDerivedStateFromProps(nextProps, prevState) {
		if (nextProps.drawer !== this.props.drawer) return this.props.drawer;
	}

	render() {
		const { channel } = this.props;
		return (
			<Toolbardiv>
				<nav className="toolbar__navigation">
					<ToggleButton drawerHandler={this.drawerHandler} />
					<div className="toolbar__logo">
						<img className="logo" src={Robot} alt="" />
					</div>
					<div className="toolbar_nav_items">
						{channel ? (
							<ul>
								<h3>{`${channel.name}`}</h3>
								<h6>{`${channel.purpose}`}</h6>
							</ul>
						) : (
							<h3>Select a Channel</h3>
						)}
					</div>
				</nav>
			</Toolbardiv>
		);
	}
}

const mapStateToProps = (state) => ({
	auth: state.auth,
	drawer: state.drawer
});

Toolbar.propTypes = {
	auth: propTypes.object.isRequired,
	channel: propTypes.object.isRequired,
	drawer: propTypes.object.isRequired,
	drawerOpen: propTypes.func.isRequired,
	drawerClose: propTypes.func.isRequired
};

export default connect(mapStateToProps, { drawerOpen, drawerClose })(Toolbar);

const Toolbardiv = styled.header`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	background: ${(props) => props.theme.sidebar};
	height: 70px;
	.toolbar__navigation {
		display: flex;
		flex-direction: row;
		align-items: center;
		height: 100%;
		width: 55%;
		justify-content: space-between;
		padding: 0 1rem;
		.toolbar__logo {
			margin-left: 0.5rem;
			.logo {
				height: 50px;
				width: 70px;
				border-radius: 50%;
			}
		}
		.toolbar_nav_items {
			ul {
				padding: 10px;
				h3 {
					color: ${(props) => props.theme.active};
				}
				h6 {
					color: ${(props) => props.theme.inactive};
				}
			}
		}
	}
`;