import React, { Component } from 'react';
import { View, Image } from 'react-native';
import { connect } from 'react-redux';
import { updateDisplayBadge, initializeHunt } from '../../actions';
import { Card, CardSection, Header, Button } from '../common';

class MarkerDetailItem extends Component {
  constructor(props) {
    super(props);
  }

  handleOnPress() {
    this.props.updateDisplayBadge({ displayBadge: this.props.badge });
    // Need to disable ishunting when hunt is complete
    this.props.initializeHunt({ isHunting: true });
    console.log('after click');
    console.log(this.props);
  }

  render() {
    const { header, badge } = this.props;

    return (
      <Card>
        <CardSection>
          <View>
            <Header headerText={`Marker Text for  ${header}`} />
          </View>
        </CardSection>
        <CardSection>
          <View>
            <Image style={{ height: 50, width: 50 }} source={badge.image} />
          </View>
        </CardSection>
          <View>
            <Button 
              children='Begin this hunt!'
              onPress={this.handleOnPress.bind(this)}
            />
          </View>
        <CardSection />
      </Card>
    );
  }
}

const mapStateToProps = state => ({ ...state.map, ...state.badge });

export default connect(mapStateToProps, { updateDisplayBadge, initializeHunt })(MarkerDetailItem);
