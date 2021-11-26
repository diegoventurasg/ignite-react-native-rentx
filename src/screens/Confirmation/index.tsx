import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar, useWindowDimensions } from 'react-native';

import { RootStackParamList } from '../../@types/navigation';

import { ConfirmButton } from '../../components/ConfirmButton';

import LogoSvg from '../../assets/logo_background_gray.svg';
import DoneSvg from '../../assets/done.svg';

import {
    Container,
    Content,
    Title,
    Message,
    Footer,
} from './styles';

type ConfirmationProps = NativeStackScreenProps<RootStackParamList, 'Confirmation'>;

export function Confirmation({ navigation, route }: ConfirmationProps) {
    const { width } = useWindowDimensions();

    const { title, message, nextScreenRoute } = route.params;

    function handleConfirm() {
        navigation.navigate(nextScreenRoute);
    }

    return (
        <Container>
            <StatusBar
                barStyle="light-content"
                backgroundColor="transparent"
                translucent
            />

            <LogoSvg width={width} />

            <Content>
                <DoneSvg width={80} height={80} />
                <Title>{title}</Title>

                <Message>
                    {message}
                </Message>

                <Footer>
                    <ConfirmButton title="OK" onPress={handleConfirm} />
                </Footer>
            </Content>
        </Container>
    );
}