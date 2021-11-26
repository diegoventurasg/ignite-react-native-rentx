import React, { useState, useEffect } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { useTheme } from 'styled-components';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { useNetInfo } from '@react-native-community/netinfo';

import Animated, {
    Extrapolate,
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue
} from 'react-native-reanimated';

import { RootStackParamList } from '../../@types/navigation';

import { BackButton } from '../../components/BackButton';
import { Button } from '../../components/Button';
import { ImageSlider } from '../../components/ImageSlider';
import { Accessory } from '../../components/Accessory';

import { getAccessoryIcon } from '../../utils/getAccessoryIcon';

import { CarDTO } from '../../dtos/CarDTO';
import { api } from '../../services/api';

import {
    Container,
    Header,
    CarImages,
    Details,
    Description,
    Brand,
    Name,
    Rent,
    Period,
    Price,
    AboutWrapper,
    About,
    Accessories,
    Footer,
    OffilineInfo
} from './styles';

type CarDetailsProps = NativeStackScreenProps<RootStackParamList, 'CarDetails'>;

export function CarDetails({ navigation, route }: CarDetailsProps) {
    const [carUpdated, setCarUpdated] = useState<CarDTO>({} as CarDTO);

    const netInfo = useNetInfo();

    const theme = useTheme();
    const { car } = route.params;

    const scrollY = useSharedValue(0);
    const scrollHandler = useAnimatedScrollHandler(event => {
        scrollY.value = event.contentOffset.y;
    });

    const headerStyleAnimation = useAnimatedStyle(() => {
        return {
            height: interpolate(
                scrollY.value,
                [0, 200],
                [200, 70],
                Extrapolate.CLAMP
            )
        }
    });

    const sliderCarsStyleAnimation = useAnimatedStyle(() => {
        return {
            opacity: interpolate(
                scrollY.value,
                [0, 150],
                [1, 0],
                Extrapolate.CLAMP
            )
        }
    });

    function handleConfirmRental() {
        navigation.navigate('Scheduling', { car });
    }

    function handleBack() {
        navigation.goBack();
    }

    useEffect(() => {
        async function fetchCarUpdated() {
            const response = await api.get(`/cars/${car.id}`);
            setCarUpdated(response.data);
        }

        if (netInfo.isConnected === true) {
            fetchCarUpdated();
        }
    }, [netInfo.isConnected]);

    return (
        <Container>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="transparent"
                translucent
            />

            <Animated.View
                style={[
                    headerStyleAnimation,
                    styles.header,
                    { backgroundColor: theme.colors.background_secondary }
                ]}
            >
                <Header>
                    <BackButton onPress={handleBack} />
                </Header>

                <Animated.View style={sliderCarsStyleAnimation}>
                    <CarImages>
                        <ImageSlider
                            imagesUrl={
                                !!carUpdated.photos ?
                                    carUpdated.photos : [{ id: car.thumbnail, photo: car.thumbnail }]
                            }
                        />
                    </CarImages>
                </Animated.View>
            </Animated.View>

            <Animated.ScrollView
                contentContainerStyle={{
                    paddingHorizontal: 24,
                    paddingTop: getStatusBarHeight() + 160,
                }}
                showsVerticalScrollIndicator={false}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
            >
                <Details>
                    <Description>
                        <Brand>{car.brand}</Brand>
                        <Name>{car.name}</Name>
                    </Description>

                    <Rent>
                        <Period>{car.period}</Period>
                        <Price>R$ {netInfo.isConnected === true ? car.price : '...'}</Price>
                    </Rent>
                </Details>

                {
                    carUpdated.accessories &&
                    <Accessories>
                        {
                            carUpdated.accessories.map(accessory => (
                                <Accessory
                                    key={accessory.type}
                                    name={accessory.name}
                                    icon={getAccessoryIcon(accessory.type)}
                                />
                            ))
                        }
                    </Accessories>
                }

                <AboutWrapper>
                    <About>
                        {car.about}
                    </About>
                </AboutWrapper>
            </Animated.ScrollView>

            <Footer>
                <Button
                    title="Escolher período do aluguel"
                    onPress={handleConfirmRental}
                    enabled={netInfo.isConnected === true}
                />

                {
                    netInfo.isConnected === false &&
                    <OffilineInfo>
                        Conecte-se a Internet para ver mais detalhes e agendar seu carro.
                    </OffilineInfo>
                }
            </Footer>
        </Container>
    );
}

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        overflow: 'hidden',
        zIndex: 1,
    }
});