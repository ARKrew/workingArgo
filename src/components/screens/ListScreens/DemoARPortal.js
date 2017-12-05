'use strict';

import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { connect } from 'react-redux';
import { enterAR } from '../../../actions';
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

// ==============================================================================
// GLOBAL DECLARATIONS
// ==============================================================================

// For animations
const itemAnimation = {
    name: "bounceUpAndDown",
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
      text: 'Initializing AR...',
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
  }

// ==============================================================================
// HELPER FUNCTIONS
// ==============================================================================

// ===== Text update when AR initialized =====
  _onInitialized() {
    this.setState({
      text : "Walk In and Tap to Collect!"
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
        });
    }, 2000);
      // _routeToMap();
    }
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
          <ViroAmbientLight color="#ffffff" intensity={200} />

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
          source={require('./portal_res/models/flag/pirate_flag.obj')}
          materials={["flag"]}
          position={[0.75, 0, -1.25]}
          scale={[0.025, 0.025, 0.025]}
          rotation={[30, 0, -25]}
          visible={this.state.isPortalRendered}
          type="OBJ"
        />

{/*
==============================================================================
(TODO: REFACTOR) SUB-COMPONENT -> PORTAL SCENE
==============================================================================
*/}
          <ViroPortalScene
            passable={true}
            dragType="FixedDistance"
            onDrag={() => {}} >

            {/* ===== Positioning of Portal ===== */}
            <ViroPortal position={[0, 0, -1.3]} scale={[.15, .15, .15]}>

              {/* ===== Portal Door ===== */}
              <Viro3DObject source={require('./portal_res/portal_ship/portal_ship.vrx')}
                resources={[require('./portal_res/portal_ship/portal_ship_diffuse.png'),
                            require('./portal_res/portal_ship/portal_ship_normal.png'),
                            require('./portal_res/portal_ship/portal_ship_specular.png')]}
                type="VRX"
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
              source={require('./portal_res/360_surf.mp4')}
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
              source={require('./portal_res/models/badge/coin.obj')}
              // materials={["badge"]}
              materials={["defaultBadge"]}
              scale={[.1, .1, .1]}
              animation={{
                name: "rotate",
                run: true,
                loop: true
              }}
              type="OBJ"
              />

              {/* ===== DAGGER ===== */}
              {/* <Viro3DObject
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
                source:require("./portal_res/models/particles/yellow_glow.png"),
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
                  shape:"box",
                  params:[.7, 1, .1],
                  spawnOnSurface:false
                },
              }}
              // ------ Modify particle appearance through time------
              particleAppearance={{
                opacity:{
                  initialRange:[0.2, 0.2],
                  factor:"time",
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
    fontFamily: 'Arial',
    fontSize: 30,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
});

// ===== 3d Model aterials =====
ViroMaterials.createMaterials({
  defaultBadge: {
    diffuseTexture: require('./portal_res/models/badge/icons/gold_coin.png'),
  },
  flag: {
    diffuseTexture: require('./portal_res/models/flag/flag_texture.png'),
  },
});

// ===== Badge Animations =====
ViroAnimations.registerAnimations({
  // Spinning
  rotate: {
    properties: {
      rotateY: "+=90"
    },
    duration: 1000, // 250 .25 seconds
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
    // // Swirl
    // swirl: {
    //   properties: {
    //     rotateX:"+45",
    //   },
    //   easing:"EaseIn",
    //   duration: 10
    // },
});

// module.exports = DemoARPortal;

const mapStateToProps = state => ({ ARstate: state.demoAR });
//
export default connect(mapStateToProps,
  {
    enterAR,
  })(DemoARPortal);
