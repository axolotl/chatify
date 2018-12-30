import React, { Component } from 'react';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import styled from 'styled-components';

class ChannelItem extends Component {
	render() {
		const { channel } = this.props;
		return (
			<Container>
				<h3>{`${channel.name}`}</h3>
				<h6>{`${channel.purpose}`}</h6>
			</Container>
		);
	}
}

const mapStateToProps = (state) => ({
	auth: state.auth
});

ChannelItem.propTypes = {
	auth: propTypes.object.isRequired,
	channel: propTypes.object.isRequired
};

export default connect(mapStateToProps)(ChannelItem);

const Container = styled.div`
	display: flex;
	flex-direction: column;
	flex-wrap: nowrap;
	width: 89vw;
	margin-bottom: 10px;
	box-shadow: 0px 3px 10px -5px rgba(0, 0, 0, 0.75);
	padding: 20px 0 20px 20px;
	h3 {
		margin-bottom: 15px;
	}
	h6 {
		margin-left: 20px;
	}
`;
