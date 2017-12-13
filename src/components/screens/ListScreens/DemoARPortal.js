'use strict';

import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { enterAR, clickedObj } from '../../../actions';
import {
  // ViroARSceneNavigator,
  ViroText,
  ViroARScene,
  ViroAmbientLight,
  Viro360Video,
  // Viro360Image,
  // ViroUtils,
  ViroPortal,
  ViroPortalScene,
  Viro3DObject,
  ViroSpinner,
  // ViroBox,
  ViroMaterials,
  ViroAnimations,
  ViroNode,
  ViroParticleEmitter
} from 'react-viro';
import badgeMaterials from '../../../constants/badgeMaterials';

// ==============================================================================
// GLOBAL DECLARATIONS
// ==============================================================================

// For animations
const itemAnimation = {
    name: 'bounceUpAndDown',
    run: true,
    loop: true
};

// ==============================================================================
// AR COMPONENT -> MAIN SCENE
// ==============================================================================

class DemoARPortal extends Component {
  constructor() {
    super();

    // Set initial state here
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
    // this._onTappedItem = this._onTappedItem.bind(this);
    this._onClickState = this._onClickState.bind(this);
    // this._routeToMap = this._routeToMap.bind(this);
    this._onExit = this._onExit.bind(this);

    this._onObjClicked = this._onObjClicked.bind(this);
  }

// ==============================================================================
// HELPER FUNCTIONS
// ==============================================================================

  componentWillUnmount() {
    console.log("DEMOARPORTAL UNMOUNTED ASDFASDFLKAGSEJLAJWKELGKA");
  }
// ===== Text update when AR initialized =====
  _onInitialized() {
    this.setState({
      text : 'DemoARPortal finished loading'
    });
  }

  // ===== Animation when user collects item =====
  _onClickState(state, source) {
    if (state === 1) {
      this.setState({
        itemAnimation : itemAnimation
      });
    //   this.setTimeout(
    //     () => { console.log('I do not leak!'); },
    //     500
      setTimeout(() => {
        this.props.enterAR({
          enterAR: false,
        },
        this.props.clickedObj({
          clickedObj: true,
        })
      );
    }, 2000);
      // _routeToMap();
    }
  }

  _onExit() {
    this.props.enterAR({
          enterAR: false,
        });
  }

  _onObjClicked() {
    this.props.clickedObj({
          clickedObj: true,
        });
  }
  // ===== Route to map =====
  // _routeToMap() {
  //   this.props.enterAR({
  //     enterAR: false,
  //   });
  // }

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
        <ViroARScene onTrackingInitialized={this._onInitialized} >
          {/* ===== Ambient Light hitting all 3D Models (required to view textures) ===== */}
          <ViroAmbientLight color='#ffffff' intensity={200} />

          {/* ===== Loading Spinner for Portal ===== */}
          <ViroSpinner
            type='light'
            position={[0, 0, -2]}
            visible={this.state.isLoading}
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

        {/* ===== Pirate Flag ====== */}
        <Viro3DObject
          // source={require('./portal_res/models/flag/pirate_flag.obj')}
          source={require('./../../../assets/models/flag/pirate_flag.obj')}
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
            onDrag={() => {}} >

            {/* ===== Positioning of Portal ===== */}
            <ViroPortal position={[0, 0, -1.3]} scale={[.15, .15, .15]}>

              {/* ===== Portal Door ===== */}
              <Viro3DObject source={require('./../../../assets/models/portal_ship/portal_ship.vrx')}
                resources={[require('./../../../assets/models/portal_ship/portal_ship_diffuse.png'),
                            require('./../../../assets/models/portal_ship/portal_ship_normal.png'),
                            require('./../../../assets/models/portal_ship/portal_ship_specular.png')]}
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

            {/* ===== Background Scene inside Portal ====== */}
            {/* TODO: Dynamic update/Customize user portals */}
            <Viro360Video
              // source={require('./portal_res/360_surf.mp4')}
              source={require('./../../../assets/portal_backgrounds/360_surf.mp4')}
              loop={true}
            />

            {/* ===== Collectible Badge inside Portal ===== */}
            {/* TODO: Dynamic update of badges */}
            <ViroNode
              position={[0, 0, -2]}
              animation={this.state.itemAnimation}
              onClickState={this._onClickState}
            >

              {/* ===== Badge inside Portal ===== */}
              <Viro3DObject
              // source={require('./portal_res/models/badge/coin.obj')}
              source={require('./../../../assets/models/coin/coin.obj')}
              materials={[this.props.currentBadge.fileName]}
              // materials={['defaultBadge']}
              scale={[.1, .1, .1]}
              animation={{
                name: 'rotate',
                run: true,
                loop: true
              }}
              type='OBJ'
              />

              {/* ===== DAGGER ===== */}
              {/* <Viro3DObject
                source={require('./portal_res/res/dagger.obj')}
                materials={['defaultBadge']}
                position={[10, 2.5, -4]}
                rotation={[90, 0, 0]}
                scale={[.01, .01, .01]}
                animation={{
                  name: 'rotate',
                  run: true,
                  loop: true
                }}
                // onClick
                type='OBJ'
              /> */}

              {/* ===== Particle Effects on Badge ===== */}
              <ViroParticleEmitter
              // ----- Basic properties ------
              position={[0,-0.25,-1.75]}
              scale={[.4,.4,.4]}
              duration={1100}
              delay={1100}
              visible={true}
              run={true}
              loop={true}
              // Emitter attach to node
              fixedToEmitter={true}
              // ------ Image source of particle ------
              image={{
                // source:require('./portal_res/models/particles/yellow_glow.png'),
                source:require('./../../../assets/models/particles/yellow_glow.png'),
                height:1,
                width:1,
              }}
              // ---- Respawn behavior -----
              spawnBehavior={{
                // how long they live
                particleLifetime:[1100,1100],
                // how fast particles are emitted
                emissionRatePerSecond:[100, 100],
                // total number of particles that can be emitted at one time
                maxParticles:200,
                spawnVolume:{
                  shape:'box',
                  params:[.7, 1, .1],
                  spawnOnSurface:false
                },
              }}
              // ------ Modify particle appearance through time------
              particleAppearance={{
                opacity:{
                  initialRange:[0.2, 0.2],
                  factor:'time',
                  interpolation:[
                    {endValue:0.4, interval:[0,100]},
                    {endValue:0.0, interval:[200,500]},
                  ]
                },
              }}
              // ------ Direction of particle movement --------
              particlePhysics={{
                velocity:{initialRange:[[0,0,0], [0,-1,0]]},
                acceleration:{initialRange:[[0,0,0], [0,0,0]]}
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

// ==============================================================================
// STYLING && ANIMATIONS
// ==============================================================================

const styles = StyleSheet.create({
  helloWorldTextStyle: {
    fontFamily: 'IM Fell English',
    fontSize: 30,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center'
  },
});

// ===== 3d Model aterials =====
ViroMaterials.createMaterials({
  flag: {
    diffuseTexture: require('./../../../assets/models/flag/flag_texture.png'),
  },
});

// ===== Badge Animations =====
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
      positionY:'+=0.5',
    },
    easing:'Bounce',
    duration: 500
  },
  // Descend
  bounceDown: {
    properties: {
      positionY:'-=0.5',
    },
    easing:'Bounce',
    duration: 500
  },
  // Runs bounce animation sequentially
  bounceUpAndDown: [
      ['bounceUp', 'bounceDown'],
  ],
});

// module.exports = DemoARPortal;

const mapStateToProps = state => ({ ARstate: state.demoAR, currentBadge: state.badge.displayBadge });
//
export default connect(mapStateToProps,
  {
    enterAR,
    clickedObj
  })(DemoARPortal);
