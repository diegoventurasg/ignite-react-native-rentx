import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Splash } from '../screens/Splash';
import { SignIn } from '../screens/SignIn';
import { SignUpFirstStep } from '../screens/SignUp/SignUpFirstStep';
import { SignUpSecondyStep } from '../screens/SignUp/SignUpSecondyStep';
import { Confirmation } from '../screens/Confirmation';

const { Navigator, Screen } = createNativeStackNavigator();

export function AuthRoutes() {
    return (
        <Navigator
            screenOptions={{
                headerShown: false,
            }}
            initialRouteName="Splash"
        >
            <Screen
                name="Splash"
                component={Splash}
            />
            <Screen
                name="SignIn"
                component={SignIn}
            />
            <Screen
                name="SignUpFirstStep"
                component={SignUpFirstStep}
            />
            <Screen
                name="SignUpSecondyStep"
                component={SignUpSecondyStep}
            />
            <Screen
                name="Confirmation"
                component={Confirmation}
            />
        </Navigator>
    )
}