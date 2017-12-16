# workingArgo
Mobile AR Game | iOS

ARgo is a mobile application that uses location intelligence and augmented reality to immerse users in a new experience. Users have the ability to enter into new worlds through AR portals and collect badges with their friends. ARgo believes that life is about acquiring new experiences and we want to help.

![ARgo Launchpage](ios/workingArgo/Images.xcassets/LaunchImage.launchimage/Default320x480.png)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

* OSX computer or Linux computer
* iOS Device with A9 chip or higher and running iOS 11
* [XCode9](https://itunes.apple.com/us/app/xcode/id497799835?mt=12)
* Node.js
* Watchman
* React Native Command Line Interface
* Viro Command Line Interface

### Installing
### Set Up Directions
In the command line, type 'npm install' to download node packages. Go to package.json file to view dependencies.
- Go to node modules -> react-navigation package -> src -> views -> TabView -> TabView.js
- On line 202 add ` && tabBarVisible` to conditional statement.

### Deployment

Download (insert link to app store to download)

## Built With

* [React-Native](https://facebook.github.io/react-native/docs/getting-started.html) - Framework
* [Redux](https://redux.js.org/) - State Container
* [ReactNavigation](https://reactnavigation.org/) - Routing/Navigation
* [ViroMedia](https://viromedia.com/) - Augmented Reality
* [React Native Maps](https://github.com/react-community/react-native-maps) - Map
* [Firebase](https://firebase.google.com/) - Database

### Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

### Directory structure
```none
src
├── actions
├── assets
│   ├── fonts
│   ├── icons	
│   ├── icons_greyscale
│   ├── images
│   ├── models
│   └── portal_backgrounds
│                            
├── components
│   ├── ar
│   ├── common
│   ├── maps
│   └── screens
│      ├── ListScreens
│      └── MoreScreens
├── constants                 
├── reducers  
├── App.js          
└── AppNavigator.js                
```

## License
This project is licensed under the MIT License.

## Developers
- James Tu | [GitHub](https://github.com/jmsjtu)
- Grace Park | [GitHub](https://github.com/gracepark)
- Ysrael "Izzy" Hernandez | [GitHub](https://github.com/ykeanu)
- Donovan Lowkeen | [GitHub](https://github.com/dlowkeen)
- Shinsuke "Mike" Yamato | [GitHub](https://github.com/mikeyamato)

## Acknowledgments
* Omar Patel and the UCLA staff

-------------
