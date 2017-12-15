import React, { Component } from 'react';
import { Animated, Dimensions, ScrollView, View, Easing, PanResponder } from 'react-native';
import { connect } from 'react-redux';
import { updateMarkerIndex } from '../../actions';
import MarkerDetailItem from './MarkerDetailItem';

const screen = Dimensions.get('window');
const height = (screen.height - 105);
const initialHeight = screen.height * 0.15;
const width = screen.width;

class MarkerDetails extends Component {
  constructor(props) {
    super(props);
    this.animation = new Animated.Value(0);

    const panResponder = PanResponder.create({
      onPanResponderTerminationRequest: () => false,
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        if (gesture.dy < -10) {
          this.animate(height, 1000, Easing.bounce);
        } else if (gesture.dy > 10) {
          this.animate(0, 1000, Easing.bounce);
        }    
      },
    });
    this.panResponder = panResponder;
  }

  componentWillUpdate(nextProps) {
    if (nextProps.scroll) {
      this.animate(initialHeight, 1000);
    } 
    if (this.props.markerIndex !== nextProps.markerIndex && nextProps.scroll) {
      const scrollPosition = nextProps.markerIndex * width;

      this.scrollToPosition(scrollPosition, nextProps.markerIndex);
    }
    if (nextProps.isHunting) {
      this.animate(0, 200);
    }
  }

  scrollToPosition(scrollPosition, markerIndex) {
    this.refs.scrollView.scrollTo({ x: scrollPosition, y: 0, animated: false });
    this.props.updateMarkerIndex({ markerIndex, scroll: false });
  }

  // Need to revisit
  handleScroll(event) {
    if (!this.props.scroll) {
      const index = Math.floor(event.nativeEvent.contentOffset.x / width);
      const markerIndex = index >= 0 ? index : 0;

      this.props.updateMarkerIndex({ markerIndex, scroll: false });
    }
  }

  animate(toValue, duration, easing) {
    Animated.timing(
      this.animation,
      {
        toValue,
        duration,
        easing
      }
    ).start();
  }

  renderDetails() {
    return this.props.markers.map((marker, index) => (
      <View key={index} style={styles.card} {...this.panResponder.panHandlers}>
        <MarkerDetailItem
          header={index}
          marker={marker}
        />
      </View>
    ));
  }

  render() {
    return (
      <Animated.View style={[styles.wrapper, { height: this.animation }]}>
        <ScrollView
          horizontal
          ref='scrollView'
          scrollEventThrottle={400}
          scrollEnabled={false}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={[{ flex: 1 }, { width }]}
        >
        {this.props.markers && this.renderDetails()}
        </ScrollView>
      </Animated.View>
    ); 
  }   
}

const styles = { 
  scrollView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: initialHeight,
    paddingVertical: 10,
  },
  endPadding: {
    paddingLeft: 0,
    paddingRight: 0
  },
  card: {
    padding: 10,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height,
    width,
    overflow: 'hidden',
  },
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 30
  }
};

const mapStateToProps = state => state.map;

export default connect(mapStateToProps, { updateMarkerIndex })(MarkerDetails);
