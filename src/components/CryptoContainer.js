import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

import FetchCoinData from './../Actions/FetchCoinData';
import CoinCard from './CoinCard';

class CryptoContainer extends Component {
    constructor(props) {
        super(props);
        this.scrollToTopAndRefresh = this.scrollToTopAndRefresh.bind(this);
        this.doRefresh = this.doRefresh.bind(this);
        this.state = {
            refreshing: false,
        }
    }

    scrollToTopAndRefresh() {
        this.flatlistref.scrollToOffset({y: 0, animated: true});
        this.setState({refreshing: true}, this.doRefresh);
    }

    doRefresh() {
        /// do refresh work here /////
        setTimeout( () => this.setState({refreshing: false}), 1000);
    }

	componentWillMount() {
		this.props.FetchCoinData();
	}

	renderCoinCards() {
		const { crypto } = this.props;
  
		return crypto.data.map((coin, index) =>
			<CoinCard
				key={index}
				coin_name={coin.name}
				symbol={coin.symbol}
				price_usd={coin.price_usd}
				percent_change_24h={coin.percent_change_24h}
				percent_change_7d={coin.percent_change_7d}
			/>
		)
	}

    refresh() {
        return new Promise((resolve) => {
          setTimeout(()=>{resolve()}, 2000)
        });
    }

	render() {
		const { crypto } = this.props;
		const { contentContainer } = styles;

		if (crypto.isFetching) {
			return (
				<View>
					<Spinner
						visible={crypto.isFetching}
						textContent={"Loading..."}
						textStyle={{color: '#253145'}}
						animation="fade"
					/>
				</View>
			);
		}

		return (
			<ScrollView contentContainerStyle={contentContainer} refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.doRefresh}
                        />
                    }>
				{this.renderCoinCards()}
			</ScrollView>
		)
	}
}

const styles = {
	contentContainer: {
		paddingBottom: 100,
		paddingTop: 30
	}
}

function mapStateToProps(state) {
	return {
		crypto: state.crypto
	}
}

export default connect(mapStateToProps, { FetchCoinData })(CryptoContainer)