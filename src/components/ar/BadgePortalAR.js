'use strict';

import firebase from 'firebase';
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import {
  ViroText,
  ViroARScene,
  ViroAmbientLight,
  Viro360Video,
  ViroPortal,
  ViroPortalScene,
  Viro3DObject,
  ViroSpinner,
  ViroMaterials,
  ViroAnimations,
  ViroNode,
  ViroParticleEmitter,
  ViroBox
} from 'react-viro';
import { 
  enterAR, 
  clickedObj, 
  updateProfileBadges, 
  disableHunt 
} from '../../actions';
import badgeMaterials from '../../constants/badgeMaterials';

// For animations
const itemAnimation = {
    name: 'bounceUpAndDown',
    run: true,
    loop: true
};

class DemoARPortal extends Component {

  constructor() {
    super();
    this.state = {
      text: 'Initializing AR... DemoARPortal',
      isLoading: true,
      isPortalRendered: false,
      itemAnimation: {
        name: 'bounceUpAndDown',
        run: false,
        loop: true
      }
    };

    // Bind 'this' to functions
    this._onInitialized = this._onInitialized.bind(this);
    this._onClickState = this._onClickState.bind(this);
    this.updateBadge = this.updateBadge.bind(this);
  }

// Text update when AR initialized
  _onInitialized() {
    this.setState({
      text : `${this.props.currentBadge.title}!`
    });
  }

  // Animation when user collects item
  _onClickState(state, source) {
    if (state === 1) {
      // Animates item after user collects
      this.setState({
        itemAnimation : itemAnimation
      });
      // Allows animation to run after x amount of seconds
      setTimeout(() => {
        this.props.enterAR({
          enterAR: false,
        },
        this.props.clickedObj({
          clickedObj: true,
        })
      );
    }, 2000);
    this.updateBadge();
    }
  }

  updateBadge() {
    const uid = this.props.user.uid;
    const collectedBadgesArray = this.props.badge.collectedBadges;
    const currentBadge = this.props.currentBadge.fileName;
    const collectedBadges = collectedBadgesArray.indexOf(currentBadge) === -1 ? [...collectedBadgesArray, currentBadge] : collectedBadgesArray;
    this.props.updateProfileBadges({ collectedBadges });
    // Push collected badges array into firebase
    firebase.database().ref(`collected_badges/${uid}`).set({ ...collectedBadges });
  }

  render() {
    if (this.props.ARstate.enterAR) {
      return (
        <ViroARScene onTrackingInitialized={this._onInitialized} >
          {/* Ambient Light hitting all 3D Models (required to view textures) */}
          <ViroAmbientLight color='#ffffff' intensity={200} />

          {/* Loading Spinner for Portal */}
          <ViroSpinner
            type='light'
            position={[0, 0, -2]}
            visible={this.state.isLoading}
          />

          {/* Initializing Text Component */}
          <ViroText
            text={this.state.text}
            width={2}
            height={2}
            scale={[0.5, 0.5, 0.5]}
            position={[0, 0.6, -1]}
            style={styles.helloWorldTextStyle}
          />

          {/* Pirate Flag */}
          <Viro3DObject
            source={require('../../assets/models/flag/pirate_flag.obj')}
            materials={['flag']}
            position={[0.75, 0, -1.25]}
            scale={[0.025, 0.025, 0.025]}
            rotation={[30, 0, -25]}
            visible={this.state.isPortalRendered}
            type='OBJ'
          />

{/*
==============================================================================
(TODO: REFACTOR) SUB-COMPONENT -> PORTAL SCENE
==============================================================================
*/}
          <ViroPortalScene
            passable={true}
            dragType='FixedDistance'
            onDrag={() => {}}
          >

            {/* Positioning of Portal */}
            <ViroPortal position={[0, 0, -1.3]} scale={[0.15, 0.15, 0.15]}>

              {/* Portal Door */}
              <Viro3DObject
                source={require('../../assets/models/portal_ship/portal_ship.vrx')}
                resources={[require('../../assets/models/portal_ship/portal_ship_diffuse.png'),
                            require('../../assets/models/portal_ship/portal_ship_normal.png'),
                            require('../../assets/models/portal_ship/portal_ship_specular.png')]}
                type='VRX'
                // Removes spinner when loaded
                onLoadEnd={() => {
                  this.setState({
                    isLoading: false,
                    isPortalRendered: true
                  });
                }}
              />

            </ViroPortal>

            {/* Background Scene inside Portal */}
            <Viro360Video
              source={require('../../assets/portal_backgrounds/360_surf.mp4')}
              loop={true}
            />

            {/* Collectible Badge inside Portal */}
            <ViroNode
              position={[0, 0, -2]}
              animation={this.state.itemAnimation}
              onClickState={this._onClickState}
            >

              {/* Badge inside Portal */}
              <ViroBox
              materials={[this.props.currentBadge.fileName]}
              scale={[0.3, 0.3, 0]}
              animation={{
                name: 'rotate',
                run: true,
                loop: true
              }}
              />

              {/* Particle Effects on Badge */}
              <ViroParticleEmitter
                // Basic properties
                position={[0, -0.25, -1.75]}
                scale={[0.4, 0.4, 0.4]}
                duration={1100}
                delay={1100}
                visible={true}
                run={true}
                loop={true}
                // Emitter attach to node
                fixedToEmitter={true}
                // Image source of particle
                image={{
                  source: require('../../assets/models/particles/yellow_glow.png'),
                  height: 1,
                  width: 1,
                }}
                // Respawn behavior
                spawnBehavior={{
                  // how long they live
                  particleLifetime: [1100, 1100],
                  // how fast particles are emitted
                  emissionRatePerSecond: [100, 100],
                  // total number of particles that can be emitted at one time
                  maxParticles: 200,
                  spawnVolume: {
                    shape: 'box',
                    params: [0.7, 1, 0.1],
                    spawnOnSurface: false
                  },
                }}
                // Modify particle appearance through time
                particleAppearance={{
                  opacity: {
                    initialRange: [0.2, 0.2],
                    factor: 'time',
                    interpolation: [
                      { endValue: 0.4, interval: [0, 100] },
                      { endValue: 0.0, interval: [200, 500] },
                    ]
                  },
                }}
                // Direction of particle movement
                particlePhysics={{
                  velocity: { initialRange: [[0, 0, 0], [0, -1, 0]] },
                  acceleration: { initialRange: [[0, 0, 0], [0, 0, 0]] }
                }}
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
    fontFamily: 'IM Fell English',
    fontSize: 30,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center'
  },
});

ViroMaterials.createMaterials({
  flag: {
    diffuseTexture: require('../../assets/models/flag/flag_texture.png'),
  },
});

ViroAnimations.registerAnimations({
  // Spinning
  rotate: {
    properties: {
      rotateY: '+=90'
    },
    duration: 1000, // 250 .25 seconds
  },
  // Ascend
  bounceUp: {
    properties: {
      positionY: '+=0.5',
    },
    easing: 'Bounce',
    duration: 500
  },
  // Descend
  bounceDown: {
    properties: {
      positionY: '-=0.5',
    },
    easing: 'Bounce',
    duration: 500
  },
  // Runs bounce animation sequentially
  bounceUpAndDown: [
      ['bounceUp', 'bounceDown'],
  ],
});

const mapStateToProps = state => ({
  ARstate: state.demoAR,
  currentBadge: state.badge.displayBadge,
  badge: state.badge,
  user: state.auth.user
 });

export default connect(mapStateToProps,
  {
    enterAR,
    clickedObj,
    updateProfileBadges,
    disableHunt
  })(DemoARPortal);
