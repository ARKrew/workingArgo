import React from 'react';
import { TextInput, View, Text } from 'react-native';

// Functional-based component
// Pass props from parent container
const Input = ({ label, value, onChangeText, placeholder, secureTextEntry }) => {
    const { inputStyle, labelStyle, containerStyle } = styles;
    
    return (
        <View style={containerStyle}>
            <Text style={labelStyle}>{label}</Text>
            <TextInput
                // Tip: Booleans can just be defiend since default is secureTextEntry={true}
                secureTextEntry={secureTextEntry}
                // Allows placeholder from parent container
                placeholder={placeholder}
                // Prevents autocorrect in text field
                autocorrect={false}
                style={inputStyle}
                value={value}
                onChangeText={onChangeText}
            />
        </View>
    );
};

const styles = {
    inputStyle: {
        color: '#000',
        paddingRight: 5,
        paddingLeft: 5,
        fontSize: 18,
        lineHeight: 23,
        // Occupying 2/3s of available space
        flex: 2
    },
    labelStyle: {
        fontSize: 18,
        paddingLeft: 20,
        // Occupying 1/3 of available space
        flex: 1
    },
    // Applied to overall view tag
    containerStyle: {
        height: 40,
        flex: 1,
        // Aligns to the right
        flexDirection: 'row',
        alignItems: 'center'

    }
};

export { Input };
