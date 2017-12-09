import React, { Component } from 'react';
import { Animated, Dimensions, ScrollView, View, Easing, PanResponder, Image } from 'react-native';
import { connect } from 'react-redux';
import { Card, CardSection, Header } from '../common';
import { updateMarkerIndex } from '../../actions';

const screen = Dimensions.get('window');
const height = (screen.height - 100);
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
      this.animate(initialHeight, 200);
    } 
    if (this.props.markerIndex !== nextProps.markerIndex && nextProps.scroll) {
      const scrollPosition = nextProps.markerIndex * width;

      this.scrollToPosition(scrollPosition, nextProps.markerIndex);
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

  render() {
    console.log(this.props);

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
          {this.props.markers && this.props.markers.map((marker, index) => {
            // console.log(marker.badge.image)
            return (
            <View key={index} style={styles.card} {...this.panResponder.panHandlers}>
              <Card>
                <CardSection>
                  <Header headerText={index} />
                </CardSection>
                <CardSection>
                  <Image 
                    style={{ width: 50, height: 50 }}
                    source={marker.badge.image} 
                  />
                </CardSection>
              </Card>
            </View>
            
            );
          }
        )}
        
          </ScrollView>
         </Animated.View>
      ); 
  }   
}

const styles = { 
  scrollView: {
    // flex: 1
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
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: height,
    width: width,
    overflow: "hidden",
  },
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 30
  }
};

const mapStateToProps = state => ({ ...state.map, badges: state.badge.badgeList });

export default connect(mapStateToProps, { updateMarkerIndex })(MarkerDetails);
