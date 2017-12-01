import React from 'react';
import { View, ActivityIndicator } from 'react-native';

// Functional Component
const Spinner = ({ size }) => {
    return (
        <View style={styles.spinnerStyles}>
            {/* If size isn't specified, will default to large */}
            <ActivityIndicator size={size || 'large'} />
        </View>
    );
};

const styles = {
    spinnerStyles: {
        // Full-width of the container
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
};

export { Spinner };
