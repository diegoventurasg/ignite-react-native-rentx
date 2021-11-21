import React from 'react';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { StatusBar, useWindowDimensions } from 'react-native';

import { RootStackParamList } from '../../routes/RootStackParamList';

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

type SchedulingCompleteScreenProp = NavigationProp<RootStackParamList, 'SchedulingComplete'>;

export function SchedulingComplete() {
    const { width } = useWindowDimensions();

    const { navigate } = useNavigation<SchedulingCompleteScreenProp>();

    function handleConfirm() {
        navigate('Home');
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
                <Title>Carro alugado!</Title>

                <Message>
                    Agora você só precisa ir {'\n'}
                    até a concessionária da RENTX {'\n'}
                    pegar o seu automóvel.
                </Message>

                <Footer>
                    <ConfirmButton title="OK" onPress={handleConfirm} />
                </Footer>
            </Content>
        </Container>
    );
}