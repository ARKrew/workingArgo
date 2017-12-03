'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { connect } from 'react-redux';
import { enterAR } from '../../../actions';
import {
  ViroARSceneNavigator,
  ViroScene,
  ViroARScene,
  ViroAmbientLight,
  Viro360Video,
  Viro360Image,
  ViroUtils,
  ViroPortal,
  ViroPortalScene,
  Viro3DObject,
  ViroSpinner,
  ViroBox,
  ViroMaterials,
  ViroAnimations,
  ViroNode,
  ViroText,
} from 'react-viro';

// For animations
const itemAnimation = {
    name: "bounceUpAndDown",
    run: true,
    loop: true
};

class DemoARPortal extends Component {
  constructor() {
    super();

    // Set initial state here
    this.state = {
      text: 'Initializing AR...',
      visible: true,
      itemAnimation: {
        name: 'bounceUpAndDown',
        run: false,
        loop: true
      }
    };

    // Bind 'this' to functions
    this._onInitialized = this._onInitialized.bind(this);
    // this._onTappedItem = this._onTappedItem.bind(this);
    this._onClickState = this._onClickState.bind(this);
  }

  // ===== Text update when AR initialized =====
  _onInitialized() {
    this.setState({
      text : "Walk In and Tap to Collect!"
    });
  }

  // ===== Animation when user collects item =====
  _onClickState(state, source) {
    if (state === 1) {
      this.props.enterAR({
        enterAR: false,
      });
    }
  }

  // ===== Push to firebase =====
  // _onTappedItem() {
  //   return (
  //     <ViroSceneNavigator {...this.state.sharedProps}
  //       initialScene={{ scene: exitScene }} />
  //   );
  // }

  render() {
    if (this.props.ARstate.enterAR) {
      return (
        <ViroARScene
          onTrackingInitialized={this._onInitialized}
        >
          {/* ===== Ambient Light hitting all 3D Models (required to view textures) ===== */}
          <ViroAmbientLight color="#ffffff" intensity={200} />

          {/* ===== Loading Spinner for Portal ===== */}
          <ViroSpinner
            type='light'
            position={[0, 0, -2]}
            visible={this.state.visible}
          />

          {/* ===== Initializing Text Component ====== */}
          <ViroText
            text={this.state.text}
            width={2}
            height={2}
            scale={[.5, .5, .5]}
            position={[0, 0.5, -1]}
            style={styles.helloWorldTextStyle}
          />

          <ViroPortalScene
            passable={true}
            dragType="FixedDistance"
            onDrag={() => {}}>

            {/* ===== Positioning of Portal ===== */}
            <ViroPortal position={[0, 0, -1]} scale={[.1, .1, .1]}>

              {/* ===== Portal Door ===== */}
              <Viro3DObject source={require('./portal_res/portal_ship/portal_ship.vrx')}
                resources={[require('./portal_res/portal_ship/portal_ship_diffuse.png'),
                            require('./portal_res/portal_ship/portal_ship_normal.png'),
                            require('./portal_res/portal_ship/portal_ship_specular.png')]}
                type="VRX"

                // Removes spinner when loaded
                onLoadEnd={() => {
                  this.setState({
                    visible: false
                  });
                }}
              />

            </ViroPortal>

            <Viro360Video source={require('./portal_res/360_surf.mp4')} loop={true} />

            <ViroNode
              position={[0, 0, -2]}
              animation={this.state.itemAnimation}
              onClickState={this._onClickState}
            >

              <Viro3DObject
                source={require('./portal_res/res/dagger.obj')}
                materials={['defaultBadge']}
                position={[10, 2.5, -4]}
                rotation={[90, 0, 0]}
                scale={[.01, .01, .01]}
                animation={{
                  name: "rotate",
                  run: true,
                  loop: true
                }}
                // onClick
                type="OBJ"
              />
            </ViroNode>

          </ViroPortalScene>

        </ViroARScene>
      );
    }
    return null;
  }
}

const styles = StyleSheet.create({
  helloWorldTextStyle: {
    fontFamily: 'Arial',
    fontSize: 30,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
});

ViroMaterials.createMaterials({
  defaultBadge: {
    diffuseTexture: require('./portal_res/Textures/daggerTexture.png'),
  }
});

// ===== Badge Animations =====
ViroAnimations.registerAnimations({
  // Spinning
  rotate: {
    properties: {
      rotateX: "+=90"
    },
    duration: 1000, // 250 .25 seconds
  },
  // Swirl
  swirl: {
    properties: {
      rotateX:"+45",
    },
    easing:"EaseIn",
    duration: 10
  },
  // Ascend
  bounceUp: {
    properties: {
      positionY:"+=0.5",
    },
    easing:"Bounce",
    duration: 500
  },
  // Descend
  bounceDown: {
    properties: {
      positionY:"-=0.5",
    },
    easing:"Bounce",
    duration: 500
  },
  // Runs bounce animation sequentially
  bounceUpAndDown: [
      ["bounceUp", "bounceDown"],
  ],
});

// module.exports = DemoARPortal;

const mapStateToProps = state => ({ ARstate: state.demoAR });
//
export default connect(mapStateToProps,
  {
    enterAR,
  })(DemoARPortal);
